import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderR } from './models/order-service.schema';
import { CreateOrderDto } from './dto/create-order-service.dto';
import { UpdateOrderDto } from './dto/update-order-service.dto';
import { UserDto } from '@app/common';
import { OrderRepository } from './order-service.repository';
import { UsersRepository } from 'apps/auth/src/users/users.repository';
import { Types } from 'mongoose';
import { ProductServiceRepository } from 'apps/product-service/src/product-service.repository';
import { OrderItem } from './models/order-item.schema';

@Injectable()
export class OrderServiceService {
  private readonly logger = new Logger(OrderServiceService.name);

  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: OrderRepository,
    private productServiceRepository: ProductServiceRepository,
    private usersRepository: UsersRepository,
  ) {}

  async findAll(user: UserDto): Promise<OrderR | any> {
    try {
      const orders = await this.ordersRepository.find({
        where: {
          userId: String(user?._id),
        },
      });

      const userRes = await this.fetchUser(user._id);

      // If user not found, return the error message
      if ('status' in userRes) {
        return userRes;
      }

      // Map orders with user details and products
      const mappedOrders = await Promise.all(
        orders.map(order => this.mapOrderWithUserAndProducts(order, userRes))
      );
      
      return {
        status: 200,
        data: mappedOrders,
      };
    } catch (error) {
      if (error.code === '11000') {
        return {
          status: 500,
          message: error.message,
        };
      }

      return {
        status: 500,
        message: error.message,
      };
    }
  }

  async findOne(user: UserDto, id: number): Promise<OrderR | any> {
    try {
      const order = await this.ordersRepository.findOne({ where: { id } });

      if (!order) {
        this.logger.warn('Order not found', id);
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      const userRes = await this.fetchUser(user._id);

      // If user not found, return the error message
      if ('status' in userRes) {
        return userRes;
      }

      // Map orders with user details and products
      const mappedOrder = await this.mapOrderWithUserAndProducts(order, userRes);

      return {
        status: 200,
        data: mappedOrder,
      };
    } catch (error) {
      this.logger.warn('Error finding order', id);
      throw error;
    }
  }

  async create(createOrderDto: CreateOrderDto, user: UserDto): Promise<OrderR> {
    try {
      const order = this.ordersRepository.create({
        userId: user?._id,
        completedAt: false,
        ...createOrderDto,
      });

      await this.ordersRepository.save(await order);

      // await this.validateCreateUserDto(createUserDto);

      return {
        status: 201,
        message: 'Order created successfully!',
      };
    } catch (error) {
      if (error.code === '11000') {
        return {
          status: 500,
          message: error.message,
        };
      }

      return {
        status: 500,
        message: error.message,
      };
    }
  }

  async update(user: UserDto, id: number, updateOrderDto: UpdateOrderDto): Promise<OrderR> {
    try {
      const updatedOrder = await this.ordersRepository.findOne({
        where: { id },
      });

      if (!updatedOrder) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      
      const updated = await this.ordersRepository.update({ id }, updateOrderDto);

      return {
        status: 200,
        message: 'Order updated successfully!',
      };
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  }

  async trackOrderStatus(id: number): Promise<any> {
    try {
      const order = await this.ordersRepository.findOne({
        where: { id },
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      return {
        status: 200,
        data: {
          status: order.status
        },
      };
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  }

  async remove(id: number, updateOrderDto: UpdateOrderDto): Promise<OrderR> {
    try {
      const cancelledOrder = await this.ordersRepository.findOne({
        where: { id },
      });

      if (!cancelledOrder) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      await this.ordersRepository.update({ id }, updateOrderDto);

      return {
        status: 200,
        message: 'Order cancelled successfully!',
      };
    } catch (error) {
      return {
        status: 500,
        message: error.message,
      };
    }
  }

   // Helper function to fetch user details
  private async fetchUser(userId: string) {
    const user = await this.usersRepository.findOne(new Types.ObjectId(userId));
    if (!user) {
      return {
        status: 404,
        message: 'User not found',
      };
    }
    return user;
  }

  // Helper function to fetch product details for an order item
  private async fetchProductDetails(productItem: OrderItem) {
    const product = await this.productServiceRepository.findOne({ _id: productItem.productId });
    if (product) {
      return {
        quantity: productItem.quantity,
        ...product,
      };
    }
    return null;
  }

  // Helper function to map orders with user details and products
  private async mapOrderWithUserAndProducts(order: Order, user: any) {
    const orderProducts = await Promise.all(
      order?.products?.map(productItem => this.fetchProductDetails(productItem))
    );

    return {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email,
      },
      orderItems: orderProducts,
      shippingAddress: user.address,
      billingAddress: user.address,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentMethod: order.paymentMethod,
      completedAt: order.completedAt,
      shippingMethod: order.shippingMethod,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}

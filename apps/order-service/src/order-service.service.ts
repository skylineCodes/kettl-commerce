import { Injectable, NotFoundException, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderR } from './models/order-service.schema';
import { CreateOrderDto } from './dto/create-order-service.dto';
import { UpdateOrderDto } from './dto/update-order-service.dto';
import { NOTIFICATIONS_SERVICE, PAYMENTS_SERVICE, UserDto } from '@app/common';
import { OrderRepository } from './order-service.repository';
import { UsersRepository } from 'apps/auth/src/users/users.repository';
import { Types } from 'mongoose';
import { ProductServiceRepository } from 'apps/product-service/src/product-service.repository';
import { OrderItem } from './models/order-item.schema';
import { ClientProxy } from '@nestjs/microservices';
import { generateRandomDigits } from '@app/common/utils/helper.util';
import { InvoiceService } from 'apps/product-service/src/invoice/invoice.service';
import { CreateInvoiceDto } from 'apps/product-service/src/invoice/dto/create-invoice.dto';
import { InvoiceRepository } from 'apps/product-service/src/invoice/invoice.repository';

@Injectable()
export class OrderServiceService {
  private readonly logger = new Logger(OrderServiceService.name);

  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: OrderRepository,
    private productServiceRepository: ProductServiceRepository,
    private usersRepository: UsersRepository,
    private invoiceService: InvoiceService,
    private invoiceRepository: InvoiceRepository,
    @Inject(PAYMENTS_SERVICE) private paymentsService: ClientProxy,
    @Inject(NOTIFICATIONS_SERVICE) private notificationService: ClientProxy,
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
      // Process 'create_charge' from the payment service
      const paymentRes = this.paymentsService.send('create_charge', {
        ...createOrderDto.charge,
        email: user?.email
      }).subscribe(async (response: any) => {
        if (response?.status === 'succeeded') {
          const order = await this.ordersRepository.create({
            ...createOrderDto,
            userId: user?._id,
            order_id: generateRandomDigits(10),
            completedAt: new Date(),
          });

          await this.ordersRepository.save(order);

          const userRes = await this.fetchUser(user?._id);

          // Map orders with user details and products
          const mappedOrder = await this.mapSingleOrderWithUserAndProducts(order, userRes);

          const invoiceItems = mappedOrder?.orderItems?.map((item: any) => {
            return {
              quantity: item?.quantity,
              price: item?.price,
              amount: item.price * item?.quantity,
              description: item.name
            }
          })

          const invoicePayload: CreateInvoiceDto = {
            title: `Invoice for your order ${order?.order_id}`,
            currency: mappedOrder?.orderItems[0]?.currency,
            dueDate: new Date(),
            items: invoiceItems,
            orderId: mappedOrder?.order_id,
            subtotal: 0,
            discount: {
              type: "percentage",
              value: 0
            },
            total: mappedOrder?.totalAmount,
            note: "Thank you for your patronage.",
            issuedOn: new Date()
          }

          const invoice = await this.invoiceService.createInvoice(invoicePayload, user);

          const fetchInvoice = await this.invoiceRepository.findOne({ orderId: mappedOrder?.order_id });

          console.log(fetchInvoice)

          this.notificationService.emit('order.created', { order: mappedOrder, user: userRes, invoice: fetchInvoice });
    
          // await this.validateCreateUserDto(createUserDto);
        }
      });


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
  private async mapSingleOrderWithUserAndProducts(order: Order, user: any) {
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
      order_id: order?.order_id,
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
      order_id: order?.order_id,
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

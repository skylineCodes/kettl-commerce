import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { Order, OrderR } from './models/order-service.schema';
import { CreateOrderDto } from './dto/create-order-service.dto';
import { UpdateOrderDto } from './dto/update-order-service.dto';
import { UserDocument } from 'apps/auth/src/users/models/user.schema';
import { UserDto } from '@app/common';

@Injectable()
export class OrderServiceService {
  private readonly logger = new Logger(OrderServiceService.name);
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async findAll(user: UserDto): Promise<OrderR> {
    try {
      const order = await this.ordersRepository.find({
        where: {
          userId: String(user?._id),
        },
      });

      return {
        status: 200,
        data: order,
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

  async findOne(id: number): Promise<OrderR> {
    try {
      const order = await this.ordersRepository.findOne({ where: { id } });

      if (!order) {
        this.logger.warn('Order not found', id);
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      return {
        status: 200,
        data: order,
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

      await this.ordersRepository.save(order);

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

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<OrderR> {
    try {
      const updatedOrder = await this.ordersRepository.findOne({
        where: { id },
      });

      if (!updatedOrder) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      await this.ordersRepository.update(id, updateOrderDto);

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
      await this.ordersRepository.update(id, updateOrderDto);

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
}

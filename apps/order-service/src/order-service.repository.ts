import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './models/order-service.schema';
import { MariadbAbstractRepository } from '@app/common'

@Injectable()
export class OrderRepository extends MariadbAbstractRepository<Order> {
  protected readonly logger = new Logger(OrderRepository.name);

  constructor(
    @InjectRepository(Order)
    orderRepository: Repository<Order>,
  ) {
    super(orderRepository);
  }
}
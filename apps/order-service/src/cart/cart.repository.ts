import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MariadbAbstractRepository } from '@app/common'
import { Cart } from './models/cart.schema';

@Injectable()
export class CartRepository extends MariadbAbstractRepository<Cart> {
  protected readonly logger = new Logger(CartRepository.name);

  constructor(
    @InjectRepository(Cart)
    cartServiceModel: Repository<Cart>,
  ) {
    super(cartServiceModel);
  }
}
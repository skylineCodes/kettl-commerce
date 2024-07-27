import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MariadbAbstractRepository } from '@app/common'
import { Wishlist } from './models/wishlist.schema';

@Injectable()
export class WishlistRepository extends MariadbAbstractRepository<Wishlist> {
  protected readonly logger = new Logger(WishlistRepository.name);

  constructor(
    @InjectRepository(Wishlist)
    wishlistServiceModel: Repository<Wishlist>,
  ) {
    super(wishlistServiceModel);
  }
}
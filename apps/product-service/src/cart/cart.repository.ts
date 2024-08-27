import { Injectable, Logger } from '@nestjs/common';
import { MongooseAbstractRepository } from '@app/common'
import { CartDocument } from './models/cart.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CartDocumentRepository extends MongooseAbstractRepository<CartDocument> {
  protected readonly logger = new Logger(CartDocumentRepository.name);

  constructor(
    @InjectModel(CartDocument.name)
    cartServiceModel: Model<CartDocument>,
  ) {
    super(cartServiceModel);
  }
}
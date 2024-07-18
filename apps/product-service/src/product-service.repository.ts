import { MongooseAbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductServiceDocument } from './models/product-service.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductServiceRepository extends MongooseAbstractRepository<ProductServiceDocument> {
  protected readonly logger = new Logger(ProductServiceRepository.name);

  constructor(
    @InjectModel(ProductServiceDocument.name)
    productServiceModel: Model<ProductServiceDocument>
  ) {
    super(productServiceModel)
  }
}
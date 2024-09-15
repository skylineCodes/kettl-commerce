import { Injectable, Logger } from '@nestjs/common';
import { MongooseAbstractRepository } from '@app/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice } from './models/invoice-schema';

@Injectable()
export class InvoiceRepository extends MongooseAbstractRepository<Invoice> {
  protected readonly logger = new Logger(InvoiceRepository.name);

  constructor(
    @InjectModel(Invoice.name)
    invoiceServiceModel: Model<Invoice>,
  ) {
    super(invoiceServiceModel);
  }
}
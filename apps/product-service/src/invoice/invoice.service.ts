import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InvoiceRepository } from './invoice.repository';
import { InvoiceItem, InvoiceR } from './models/invoice-schema';
import { UsersRepository } from 'apps/auth/src/users/users.repository';
import { Types } from 'mongoose';
import { CreateInvoiceDto, InvoiceItemDto } from './dto/create-invoice.dto';
import { GetUserDto } from 'apps/auth/src/users/dto/get-user.dto';
import { PaginateDto } from '../dto/paginate-product-service.dto';
import { UserDto } from '@app/common';
import { generateRequestId } from '@app/common/utils/helper.util';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly configService: ConfigService,
  ) {}

  async findAll(paginateDto: PaginateDto, user: UserDto): Promise<InvoiceR> {
    const requestId = generateRequestId();
    
    this.logger.log({
      message: 'Invoice Read',
      timestamp: new Date().toISOString(),
      operation: 'Read',
      service_type: 'Invoice',
      userId: user?._id,
      requestId: requestId,
      status: 'processing',
    });

    try {
      const { page, pageSize } = paginateDto;

      const totalItems = await this.invoiceRepository.countDocuments();
      const totalPages = Math.ceil(totalItems / pageSize);

      const invoice = await this.invoiceRepository.paginatedFind({
        page,
        pageSize,
      });

      this.logger.log({
        message: 'Product Read',
        timestamp: new Date().toISOString(),
        operation: 'Read',
        service_type: 'Product',
        userId: user?._id,
        numberOfProductsFetched: invoice.length,
        filtersApplied: paginateDto,
        requestId: requestId,
        status: 'success',
      });

      return {
        status: 200,
        message: 'Invoice retrieved successfully',
        data: invoice,
        page,
        pageSize,
        totalPages,
        totalItems,
        _links: {
          self: {
            href: `${this.configService.get<string>('INVOICE_BASE_URL')}?page=${page}&pageSize=${pageSize}`,
          },
          next:
            page < totalPages
              ? {
                  href: `${this.configService.get<string>('INVOICE_BASE_URL')}?page=${page + 1}&pageSize=${pageSize}`,
                }
              : null,
          prev:
            page > 1
              ? {
                  href: `${this.configService.get<string>('INVOICE_BASE_URL')}?page=${page - 1}&pageSize=${pageSize}`,
                }
              : null,
          first: {
            href: `${this.configService.get<string>('INVOICE_BASE_URL')}?page=1&pageSize=${pageSize}`,
          },
          last: {
            href: `${this.configService.get<string>('INVOICE_BASE_URL')}?page=${totalPages}&pageSize=${pageSize}`,
          },
        },
      };
    } catch (error) {
      this.logger.error({
        message: 'Invoice Read',
        timestamp: new Date().toISOString(),
        operation: 'Read',
        service_type: 'Invoice',
        userId: user?._id,
        requestId: requestId,
        status: 'failed',
        errors: error.message,
      });

      throw error;
    }
  }

  async findOne(id: string,  user: UserDto): Promise<InvoiceR> {
    const requestId = generateRequestId();

    this.logger.log(JSON.stringify({
      message: 'Invoice Single Read',
      timestamp: new Date().toISOString(),
      operation: 'Single Read',
      service_type: 'Invoice',
      userId: user?._id,
      invoiceId: id,
      requestId: requestId,
      status: 'processing',
    }));

    try {
      const invoice = await this.invoiceRepository.findOne({ _id: id });

      this.logger.log(JSON.stringify({
        message: 'Invoice Single Read',
        timestamp: new Date().toISOString(),
        operation: 'Single Read',
        service_type: 'Invoice',
        userId: user?._id,
        invoiceId: id,
        requestId: requestId,
        status: 'success',
      }));

      return {
        status: 200,
        data: invoice,
      };
    } catch (error) {
      this.logger.error(JSON.stringify({
        message: 'Invoice Single Read',
        timestamp: new Date().toISOString(),
        operation: 'Single Read',
        service_type: 'Invoice',
        userId: user?._id,
        invoiceId: id,
        requestId: requestId,
        status: 'failed',
        errors: error.message,
      }));

      throw error;
    }
  }

  private transformToInvoiceItems(itemsDto: InvoiceItemDto[]): any[] {
    return itemsDto.map(itemDto => ({
      quantity: itemDto.quantity,
      price: itemDto.price,
      amount: itemDto.amount,
      description: itemDto.description
    }));
  }

  async createInvoice(createInvoiceDto: CreateInvoiceDto, user: GetUserDto): Promise<InvoiceR> {
    try {
      await this.invoiceRepository.create({
        ...createInvoiceDto,
        userId: user?._id,
        items: this.transformToInvoiceItems(createInvoiceDto.items),
        invoiceNo: this.generateInvoiceNo()
      });

      return {
        status: 201,
        message: 'Invoice added successfully!',
      };
    } catch (error) {
      this.logger.warn('Error create or updating cart');
      
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

  private generateInvoiceNo(): string {
    // Generate a random number with leading zeros if necessary
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    // Format the number with leading zeros to ensure it's always 4 digits
    const invoiceNo = `INV-${randomNumber.toString().padStart(4, '0')}`;
    return invoiceNo;
  }
}

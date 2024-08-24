import { Injectable, Logger } from '@nestjs/common';
import { UpdateProductServiceDto } from './dto/update-product-service.dto';
import { ProductServiceRepository } from './product-service.repository';
import { Product, ProductR } from './models/product-service.schema';
import { CreateProductServiceDto } from './dto/create-product-service.dto';
import { DynamicPricingDto } from './dto/discount-product-dto';
import { PaginateDto } from './dto/paginate-product-service.dto';
import { ConfigService } from '@nestjs/config';
import { LoggerModule, UserDto } from '@app/common';

@Injectable()
export class ProductServiceService {
  private readonly logger = new Logger(ProductServiceService.name);

  constructor(
    private readonly productServiceRepository: ProductServiceRepository,
    private readonly configService: ConfigService,
  ) {}

  generateRequestId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  async create(
    createProductServiceDto: CreateProductServiceDto,
    user: UserDto
  ): Promise<ProductR> {
    const requestId = this.generateRequestId();
    
    this.logger.log(JSON.stringify({
      message: 'Product Create',
      timestamp: new Date().toISOString(),
      operation: 'Create',
      service_type: 'Product',
      userId: user?._id,
      productData: createProductServiceDto.products,
      requestId: requestId,
      status: 'processing',
    }));

    try {
      const createdProduct = await this.productServiceRepository.insertMany(
        createProductServiceDto.products,
      );

      this.logger.log(JSON.stringify({
        message: 'Product Create',
        timestamp: new Date().toISOString(),
        operation: 'Create',
        service_type: 'Product',
        userId: user?._id,
        productData: createProductServiceDto.products,
        requestId: requestId,
        status: 'success',
      }));

      return {
        status: 201,
        message: 'Products created successfully!',
      };
    } catch (error) {
      this.logger.error(JSON.stringify({
        message: 'Product Create',
        timestamp: new Date().toISOString(),
        operation: 'Create',
        service_type: 'Product',
        userId: user?._id,
        productData: createProductServiceDto.products,
        requestId: requestId,
        status: 'failed',
        errors: error.message,
      }));

      throw error;
    }
  }

  async findAll(paginateDto: PaginateDto, user: UserDto): Promise<ProductR> {
    const requestId = this.generateRequestId();
    
    this.logger.log({
      message: 'Product Read',
      timestamp: new Date().toISOString(),
      operation: 'Read',
      service_type: 'Product',
      userId: user?._id,
      requestId: requestId,
      status: 'processing',
    });

    try {
      const { page, pageSize } = paginateDto;

      const totalItems = await this.productServiceRepository.countDocuments();
      const totalPages = Math.ceil(totalItems / pageSize);

      const products = await this.productServiceRepository.paginatedFind({
        page,
        pageSize,
      });

      this.logger.log({
        message: 'Product Read',
        timestamp: new Date().toISOString(),
        operation: 'Read',
        service_type: 'Product',
        userId: user?._id,
        numberOfProductsFetched: products.length,
        filtersApplied: paginateDto,
        requestId: requestId,
        status: 'success',
      });

      return {
        status: 200,
        message: 'Products retrieved successfully',
        data: products,
        page,
        pageSize,
        totalPages,
        totalItems,
        _links: {
          self: {
            href: `${this.configService.get<string>('PRODUCT_BASE_URL')}?page=${page}&pageSize=${pageSize}`,
          },
          next:
            page < totalPages
              ? {
                  href: `${this.configService.get<string>('PRODUCT_BASE_URL')}?page=${page + 1}&pageSize=${pageSize}`,
                }
              : null,
          prev:
            page > 1
              ? {
                  href: `${this.configService.get<string>('PRODUCT_BASE_URL')}?page=${page - 1}&pageSize=${pageSize}`,
                }
              : null,
          first: {
            href: `${this.configService.get<string>('PRODUCT_BASE_URL')}?page=1&pageSize=${pageSize}`,
          },
          last: {
            href: `${this.configService.get<string>('PRODUCT_BASE_URL')}?page=${totalPages}&pageSize=${pageSize}`,
          },
        },
      };
    } catch (error) {
      this.logger.error({
        message: 'Product Read',
        timestamp: new Date().toISOString(),
        operation: 'Read',
        service_type: 'Product',
        userId: user?._id,
        requestId: requestId,
        status: 'failed',
        errors: error.message,
      });

      throw error;
    }
  }

  async findOne(id: string,  user: UserDto): Promise<ProductR> {
    const requestId = this.generateRequestId();

    this.logger.log(JSON.stringify({
      message: 'Product Single Read',
      timestamp: new Date().toISOString(),
      operation: 'Single Read',
      service_type: 'Product',
      userId: user?._id,
      productId: id,
      requestId: requestId,
      status: 'processing',
    }));

    try {
      const product = await this.productServiceRepository.findOne({ _id: id });

      this.logger.log(JSON.stringify({
        message: 'Product Single Read',
        timestamp: new Date().toISOString(),
        operation: 'Single Read',
        service_type: 'Product',
        userId: user?._id,
        productId: id,
        requestId: requestId,
        status: 'success',
      }));

      return {
        status: 200,
        data: product,
      };
    } catch (error) {
      this.logger.error(JSON.stringify({
        message: 'Product Single Read',
        timestamp: new Date().toISOString(),
        operation: 'Single Read',
        service_type: 'Product',
        userId: user?._id,
        productId: id,
        requestId: requestId,
        status: 'failed',
        errors: error.message,
      }));

      throw error;
    }
  }

  async update(
    id: string,
    updateProductServiceDto: UpdateProductServiceDto,
    user: UserDto
  ): Promise<ProductR> {
    const requestId = this.generateRequestId();

    this.logger.log(JSON.stringify({
      message: 'Product Update',
      timestamp: new Date().toISOString(),
      operation: 'Update',
      service_type: 'Product',
      userId: user?._id,
      productId: id,
      fieldsUpdated: updateProductServiceDto,
      requestId: requestId,
      status: 'processing',
    }));

    try {
      const existingProduct = await this.productServiceRepository.findOneAndUpdate(
          { _id: id },
          updateProductServiceDto,
        );

      this.logger.log(JSON.stringify({
        message: 'Product Update',
        timestamp: new Date().toISOString(),
        operation: 'Update',
        service_type: 'Product',
        userId: user?._id,
        productId: id,
        fieldsUpdated: updateProductServiceDto,
        requestId: requestId,
        status: 'success',
      }));

      return {
        status: 200,
        message: 'Products updated successfully',
      };
    } catch (error) {
      this.logger.error(JSON.stringify({
        message: 'Product Update',
        timestamp: new Date().toISOString(),
        operation: 'Update',
        service_type: 'Product',
        userId: user?._id,
        productId: id,
        requestId: requestId,
        status: 'failed',
        errors: error.message,
      }));

      throw error;
    }
  }

  async remove(id: string, user: UserDto): Promise<ProductR> {
    const requestId = this.generateRequestId();
    this.logger.log(JSON.stringify({
      message: 'Product Delete',
      timestamp: new Date().toISOString(),
      operation: 'Delete',
      service_type: 'Product',
      userId: user?._id,
      productId: id,
      reasonForDeletion: 'No reason provided',
      requestId: requestId,
      status: 'processing',
    }));

    try {
      const deletedProduct =
        await this.productServiceRepository.findOneAndDelete({ _id: id });

      this.logger.log(JSON.stringify({
        message: 'Product Delete',
        timestamp: new Date().toISOString(),
        operation: 'Delete',
        service_type: 'Product',
        userId: user?._id,
        productId: id,
        reasonForDeletion: 'No reason provided',
        requestId: requestId,
        status: 'success',
      }));

      return {
        status: 200,
        message: 'Product deleted successfully!',
      };
    } catch (error) {
      this.logger.log(JSON.stringify({
        message: 'Product Delete',
        timestamp: new Date().toISOString(),
        operation: 'Delete',
        service_type: 'Product',
        userId: user?._id,
        productId: id,
        reasonForDeletion: 'No reason provided',
        requestId: requestId,
        status: 'failed',
        errors: error.message,
      }));

      throw error;
    }
  }

  // Check product stock count is available
  async checkStockAvailability(id: string, quantity: number, user: UserDto): Promise<boolean> {
    try {
      const product: Product | any =
        await this.productServiceRepository.findOne({
          _id: id,
        });

      return product.stockQuantity >= quantity;
    } catch (error) {
      throw error;
    }
  }

  // Update product stock as reduced when order is made
  async reduceStockQuantity(id: string, quantity: number, user: UserDto): Promise<ProductR> {
    try {
      const product: Product | any =
        await this.productServiceRepository.findOne({
          _id: id,
        });

      product.stockQuantity -= quantity;

      await product.save();

      return {
        status: 200,
        message: 'Product stock count updated successfully!',
      };
    } catch (error) {
      throw error;
    }
  }

  // Apply discount to product price when applies
  async applyDiscount(
    id: string,
    discountPercentage: number,
    user: UserDto
  ): Promise<ProductR> {
    try {
      const product: Product | any =
        await this.productServiceRepository.findOne({
          _id: id,
        });

      product.discountedPrice = product.price * (1 - discountPercentage / 100);

      await product.save();

      return {
        status: 200,
        message: 'Product price updated successfully!',
      };
    } catch (error) {
      throw error;
    }
  }

  async removeDiscount(id: string, user: UserDto): Promise<ProductR> {
    try {
      const product: Product | any =
        await this.productServiceRepository.findOne({
          _id: id,
        });

      product.discountedPrice = undefined;

      await product.save();

      return {
        status: 200,
        message: 'Product price updated successfully!',
      };
    } catch (error) {
      throw error;
    }
  }

  async applyDynamicPricing(
    id: string,
    pricingDto: DynamicPricingDto,
    user: UserDto
  ): Promise<ProductR> {
    try {
      const product: Product | any =
        await this.productServiceRepository.findOne({
          _id: id,
        });

      let newPrice = product.price;

      if (pricingDto.demandFactor) {
        newPrice *= pricingDto.demandFactor;
      }

      if (pricingDto.timeOfDay) {
        // Apply a 10% discount during off-peak hours
        const offPeakHours = ['22:00', '06:00'];
        if (offPeakHours.includes(pricingDto.timeOfDay)) {
          newPrice *= 0.9;
        }

        const currentTime = new Date().getHours();
        const [startHour, endHour] = pricingDto.timeOfDay
          .split('-')
          .map(Number);
        if (currentTime >= startHour && currentTime <= endHour) {
          newPrice *= 0.9; // 10% discount during specified hours
        }
      }

      if (
        pricingDto.customerSegments &&
        pricingDto.customerSegments.includes('VIP')
      ) {
        newPrice *= 0.95; // 5% discount for VIP customers
      }

      product.price = newPrice;
      product.save();

      return {
        status: 200,
        message: 'Product price updated successfully!',
      };
    } catch (error) {
      throw error;
    }
  }
}

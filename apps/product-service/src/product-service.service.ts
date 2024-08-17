import { Injectable } from '@nestjs/common';
import { UpdateProductServiceDto } from './dto/update-product-service.dto';
import { ProductServiceRepository } from './product-service.repository';
import { Product, ProductR } from './models/product-service.schema';
import { CreateProductServiceDto } from './dto/create-product-service.dto';
import { DynamicPricingDto } from './dto/discount-product-dto';
import { PaginateDto } from './dto/paginate-product-service.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductServiceService {
  constructor(
    private readonly productServiceRepository: ProductServiceRepository,
    private readonly configService: ConfigService
  ) {}

  async create(
    createProductServiceDto: CreateProductServiceDto,
  ): Promise<ProductR> {
    try {
      const createdProduct = await this.productServiceRepository.insertMany(
        createProductServiceDto.products,
      );

      return {
        status: 201,
        message: 'Products created successfully!',
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(paginateDto: PaginateDto): Promise<ProductR> {
    try {
      const { page, pageSize } = paginateDto;

      const totalItems = await this.productServiceRepository.countDocuments();
      const totalPages = Math.ceil(totalItems / pageSize);

      const products = await this.productServiceRepository.paginatedFind({ page, pageSize });

      return {
        status: 200,
        message: 'Products retrieved successfully',
        data: products,
        page,
        pageSize,
        totalPages,
        totalItems,
        _links: {
          self: { href: `${this.configService.get<string>('PRODUCT_BASE_URL')}?page=${page}&pageSize=${pageSize}` },
          next: page < totalPages ? { href: `${this.configService.get<string>('PRODUCT_BASE_URL')}?page=${page + 1}&pageSize=${pageSize}` } : null,
          prev: page > 1 ? { href: `${this.configService.get<string>('PRODUCT_BASE_URL')}?page=${page - 1}&pageSize=${pageSize}` } : null,
          first: { href: `${this.configService.get<string>('PRODUCT_BASE_URL')}?page=1&pageSize=${pageSize}` },
          last: { href: `${this.configService.get<string>('PRODUCT_BASE_URL')}?page=${totalPages}&pageSize=${pageSize}` },
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<ProductR> {
    try {
      const product = await this.productServiceRepository.findOne({ _id: id });

      return {
        status: 200,
        data: product,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateProductServiceDto: UpdateProductServiceDto,
  ): Promise<ProductR> {
    try {
      const existingProduct =
        await this.productServiceRepository.findOneAndUpdate(
          { _id: id },
          updateProductServiceDto,
        );

      return {
        status: 200,
        message: 'Products updated successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<ProductR> {
    try {
      const deletedProduct =
        await this.productServiceRepository.findOneAndDelete({ _id: id });

      return {
        status: 200,
        message: 'Product deleted successfully!',
      };
    } catch (error) {
      throw error;
    }
  }

  // Check product stock count is available
  async checkStockAvailability(id: string, quantity: number): Promise<boolean> {
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
  async reduceStockQuantity(id: string, quantity: number): Promise<ProductR> {
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

  async removeDiscount(id: string): Promise<ProductR> {
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

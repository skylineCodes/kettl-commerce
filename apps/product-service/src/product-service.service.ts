import { Injectable } from '@nestjs/common';
import { UpdateProductServiceDto } from './dto/update-product-service.dto';
import { ProductServiceRepository } from './product-service.repository';
import { Product, ProductR } from './models/product-service.schema';
import { CreateProductServiceDto } from './dto/create-product-service.dto';
import { DynamicPricingDto } from './dto/discount-product-dto';

@Injectable()
export class ProductServiceService {
  constructor(
    private readonly productServiceRepository: ProductServiceRepository,
  ) {}

  async create(
    createProductServiceDto: CreateProductServiceDto,
  ): Promise<ProductR> {
    try {
      const createdProduct = await this.productServiceRepository.insertMany(
        createProductServiceDto.products,
      );

      return {
        status: 200,
        message: 'Products created successfully!',
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<ProductR> {
    try {
      const products = await this.productServiceRepository.find();

      return {
        status: 200,
        message: 'Products retrieved successfully',
        data: products,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<ProductR> {
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
    id: number,
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
        data: existingProduct,
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number): Promise<ProductR> {
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
  async checkStockAvailability(
    id: string,
    quantity: number,
  ): Promise<boolean> {
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
  async reduceStockQuantity(
    id: string,
    quantity: number,
  ): Promise<ProductR> {
    try {
      const product: Product | any =
        await this.productServiceRepository.findOne({
          _id: id,
        });
      
      product.stockQuantity -= quantity;

      product.save()

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

      product.save();

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
      const product: Product | any = await this.productServiceRepository.findOne({
        _id: id,
      });

      product.discountedPrice = undefined;

      product.save();

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
        // const offPeakHours = ['22:00', '06:00'];
        // if (offPeakHours.includes(pricingDto.timeOfDay)) {
        //   newPrice *= 0.9;
        // }

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

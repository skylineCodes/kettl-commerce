import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart, CartR } from './models/cart.schema';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  async getCart(userId: string): Promise<CartR> {
    try {
      const cart = await this.cartRepository.findOne({ where: { userId } });

      // Fetch products details from product service with productId in cart response

      if (!cart) {
        this.logger.warn('Cart not found', userId);
        throw new NotFoundException(`Cart with ID ${userId} not found`);
      }

      return {
        status: 200,
        data: cart,
      };
    } catch (error) {
      this.logger.warn('Error finding cart', userId);
      throw error;
    }
  }

  async addOrUpdateCart(createCartDto: CreateCartDto): Promise<CartR> {
    try {
      const { userId, products, total, tax } = createCartDto;

      let cart: CreateCartDto = await this.cartRepository.findOne({
        where: { userId },
      });

      if (cart) {
        cart.products = products;
        cart.total = total;
        cart.tax = tax;
      } else {
        cart = this.cartRepository.create({ userId, products, total, tax });
      }

      this.cartRepository.save(cart);

      return {
        status: 201,
        message: 'Cart added successfully!',
      };
    } catch (error) {
      this.logger.warn('Error create or updating cart');
      throw error;
    }
  }

  async removeProductFromCart(
    userId: string,
    productId: string,
  ): Promise<CartR> {
    try {
      const cart = await this.cartRepository.findOne({ where: { userId } });

      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      // Filter out the product to be removed
      const updatedProducts = cart.products.filter(
        (product) => product.productId !== productId,
      );

      // Update the cart with the new products array
      cart.products = updatedProducts;

      await this.cartRepository.save(cart);

      return {
        status: 200,
        message: 'Product removed successfully from the cart!',
      };
    } catch (error) {
      this.logger.warn('Error removing product from cart');
      throw error;
    }
  }

  async removeCart(userId: string): Promise<CartR> {
    try {
      const result = await this.cartRepository.delete({ userId });

      if (result.affected === 0) {
        throw new NotFoundException('Cart not found');
      }

      return {
        status: 200,
        message: 'Cart added successfully!',
      };
    } catch (error) {
      this.logger.warn('Error removing cart');
      throw error;
    }
  }
}

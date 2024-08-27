import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CartDocument, CartR } from './models/cart.schema';
import { CartProductDocumentDto, CreateCartDto } from './dto/create-cart.dto';
import { CartDocumentRepository } from './cart.repository';
import { UsersRepository } from 'apps/auth/src/users/users.repository';
import { Types } from 'mongoose';
import { ProductServiceRepository } from 'apps/product-service/src/product-service.repository';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly productServiceRepository: ProductServiceRepository,
    private readonly cartRepository: CartDocumentRepository,
  ) {}

  async getCart(userId: string): Promise<CartR | any> {
    try {
      const cart = await this.cartRepository.findOne({ userId });

      if (!cart) {
        this.logger.warn('Cart not found', userId);
        throw new NotFoundException(`User cart with ID ${userId} not found`);
      }

      const userRes = await this.fetchUser(userId);

      // If user not found, return the error message
      if ('status' in userRes) {
        return userRes;
      }

      // Map orders with user details and products
      const mappedCart = await this.mapCartWithUserAndProducts(cart, userRes);

      return {
        status: 200,
        data: mappedCart,
      };
    } catch (error) {
      this.logger.warn('Error finding cart', userId);

      return {
        status: 500,
        message: error.message,
      };
    }
  }

  async addOrUpdateCart(createCartDto: CreateCartDto): Promise<CartR> {
    try {
      const { userId, products, total, tax } = createCartDto;

      let cart: CreateCartDto = await this.cartRepository.findOne({
        userId,
      });

      
      if (cart) {
        await this.cartRepository.findOneAndUpdate(
          { userId },
          {
            products,
            total,
            tax
          },
        );
      } else {
        cart = await this.cartRepository.create({ userId, products, total, tax });
      }
      
      // await this.cartRepository.save(cart);

      return {
        status: 201,
        message: 'Cart added successfully!',
      };
    } catch (error) {
      this.logger.warn('Error create or updating cart');
      
      return {
        status: 500,
        message: error.message,
      };
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

      await this.cartRepository.findOneAndUpdate({
        userId
      }, cart);

      return {
        status: 200,
        message: 'Product removed successfully from the cart!',
      };
    } catch (error) {
      this.logger.warn('Error removing product from cart');
      return {
        status: 500,
        message: error.message,
      };
    }
  }

  async removeCart(userId: string): Promise<CartR> {
    try {
      const result = await this.cartRepository.findOneAndDelete({ where: { userId } });

      return {
        status: 200,
        message: 'Cart removed successfully!',
      };
    } catch (error) {
      this.logger.warn('Error removing cart');
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

  // Helper function to fetch product details for an order item
  private async fetchProductDetails(productItem: CartProductDocumentDto) {
    const product = await this.productServiceRepository.findOne({ _id: productItem.productId });
    if (product) {
      return {
        quantity: productItem.quantity,
        subtotal: productItem.subtotal,
        ...product,
      };
    }
    return null;
  }

  // Helper function to map orders with user details and products
  private async mapCartWithUserAndProducts(cart: CartDocument, user: any) {
    const orderProducts = await Promise.all(
      cart?.products?.map(productItem => this.fetchProductDetails(productItem))
    );

    return {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email,
      },
      cartItems: orderProducts,
      shippingAddress: user.address,
      billingAddress: user.address,
      total: cart.total,
      tax: cart.tax,
    };
  }
}

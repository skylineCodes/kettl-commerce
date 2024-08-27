import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Wishlist, WishlistR } from './models/wishlist.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { WishlistRepository } from './wishlist.repository';
import { UsersRepository } from 'apps/auth/src/users/users.repository';
import { ProductServiceRepository } from 'apps/product-service/src/product-service.repository';
import { Types } from 'mongoose';

@Injectable()
export class WishlistService {
  private readonly logger = new Logger(WishlistService.name);

  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRespository: WishlistRepository,
    private usersRepository: UsersRepository,
    private productServiceRepository: ProductServiceRepository,
  ) {}

  async getWishlist(userId: string): Promise<WishlistR | any> {
    try {
      const wishlist = await this.wishlistRespository.findOne({
        where: { userId },
      });

      if (!wishlist) {
        throw new NotFoundException('Wishlists not found');
      }

      const userRes = await this.fetchUser(userId);

      // If user not found, return the error message
      if ('status' in userRes) {
        return userRes;
      }

      // Map orders with user details and products
      const mappedCart = await this.mapWishlistWithUserAndProducts(wishlist, userRes)

      return {
        status: 200,
        data: mappedCart,
      };
    } catch (error) {
      this.logger.warn('Error finding wishlists', userId);
      
      return {
        status: 500,
        message: error.message,
      };
    }
  }

  async addItemToWishlist(createWishlistDto: CreateWishlistDto): Promise<WishlistR> {
    try {
      const { userId, productId } = createWishlistDto;

      let wishlist = await this.wishlistRespository.findOne({
        where: { userId },
      });

      if (!wishlist) {
        wishlist = new Wishlist();
        wishlist.userId = userId;
        wishlist.products = [];
      }

      wishlist.products.push({ productId, addedAt: new Date() });

      await this.wishlistRespository.save(wishlist);

      return {
        status: 201,
        message: 'Wishlist added successfully!',
      };
    } catch (error) {
      this.logger.warn('Error adding wishlists', createWishlistDto.productId);
      
      return {
        status: 500,
        message: error.message,
      };
    }
  }

  async removeItemFromWishlist(
    userId: string,
    productId: string,
  ): Promise<WishlistR> {
    try {
      const wishlist = await this.wishlistRespository.findOne({
        where: { userId },
      });

      if (!wishlist) {
        throw new NotFoundException('Wishlist not found!');
      }

      wishlist.products = wishlist.products.filter(
        (product) => product.productId !== productId,
      );

      await this.wishlistRespository.save(wishlist);

      return {
        status: 200,
        message: 'Product removed successfully!',
      };
    } catch (error) {
      this.logger.warn('Error removing item from wishlists', productId);
      
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
  private async fetchProductDetails(products: CreateWishlistDto | any) {
    const product = await this.productServiceRepository.findOne({ _id: products.productId });
    
    if (product) {
      return {
        addedAt: products?.addedAt,
        ...product,
      };
    }

    return null;
  }

  // Helper function to map orders with user details and products
  private async mapWishlistWithUserAndProducts(wishlist: Wishlist, user: any) {
    const wishlistProducts = await Promise.all(
      wishlist?.products?.map(productItem => this.fetchProductDetails(productItem))
    );
    
    return {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email,
      },
      wishlistItems: wishlistProducts,
    };
  }
}

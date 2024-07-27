import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Wishlist, WishlistR } from './models/wishlist.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@Injectable()
export class WishlistService {
  private readonly logger = new Logger(WishlistService.name);

  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRespository: Repository<Wishlist>,
  ) {}

  async getWishlist(userId: string): Promise<WishlistR> {
    try {
      const wishlist = await this.wishlistRespository.findOne({
        where: { userId },
      });

      if (!wishlist) {
        throw new NotFoundException('Wishlists not found');
      }

      return {
        status: 200,
        data: wishlist,
      };
    } catch (error) {
      this.logger.warn('Error finding wishlists', userId);
      throw error;
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
      throw error;
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
      throw error;
    }
  }
}

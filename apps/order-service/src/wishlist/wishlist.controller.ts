import { CurrentUser, JwtAuthGuard } from '@app/common';
import {
  Controller,
  UseGuards,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  Body,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { WishlistService } from './wishlist.service';
import { GetUserDto } from 'apps/auth/src/users/dto/get-user.dto';
import { WishlistR } from './models/wishlist.schema';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WishlistResponseDtoR } from './dto/wishlist-response-array.dto';

@ApiTags('Wishlist')
@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch User Wishlist' })
  @ApiResponse({
    status: 200,
    type: WishlistResponseDtoR
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
  })
  @ApiResponse({
    status: 500,
    description: 'Wishlists not found',
  })
  async getWishlist(
    @CurrentUser() user: GetUserDto,
    @Res() response: Response,
  ) {
    const wishlistResponse: WishlistR = await this.wishlistService.getWishlist(
      user._id,
    );

    return response.status(wishlistResponse.status).json(wishlistResponse);
  }

  @Post()
  @ApiOperation({ summary: 'Add To Wishlist' })
  @ApiResponse({
    status: 201,
    description: 'Wishlist added successfully!',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
  })
  async addItemToWishlist(
    @CurrentUser() user: GetUserDto,
    @Body() createWishlistDto: CreateWishlistDto,
    @Res() response: Response,
  ) {
    createWishlistDto.userId = user._id;

    const wishlistResponse: WishlistR =
      await this.wishlistService.addItemToWishlist(createWishlistDto);

    return response.status(wishlistResponse.status).json(wishlistResponse);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remove Product From Wishlist' })
  @ApiResponse({
    status: 200,
    description: 'Product removed successfully from the wishlist!',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
  })
  async removeItemFromWishlist(
    @CurrentUser() user: GetUserDto,
    @Param('productId') productId: string,
    @Res() response: Response,
  ) {
    const wishlistResponse: WishlistR =
      await this.wishlistService.removeItemFromWishlist(user._id, productId);

    return response.status(wishlistResponse.status).json(wishlistResponse);
  }
}

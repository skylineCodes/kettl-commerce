import { CurrentUser, JwtAuthGuard } from '@app/common';
import { Controller, UseGuards, Get, Post, Patch, Param, Delete, Body, Res } from '@nestjs/common';
import { CartService } from './cart.service';
import { GetUserDto } from 'apps/auth/src/users/dto/get-user.dto';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartR } from './models/cart.schema';
import { Response } from 'express';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@CurrentUser() user: GetUserDto, @Res() response: Response) {
    const cartResponse: CartR = await this.cartService.getCart(user._id);

    return response.status(cartResponse.status).json(cartResponse);
  }

  @Post()
  async addOrUpdateCart(
    @CurrentUser() user: GetUserDto,
    @Body() createCartDto: CreateCartDto,
    @Res() response: Response,
  ) {
    createCartDto.userId = user._id;

    const cartResponse: CartR =
      await this.cartService.addOrUpdateCart(createCartDto);

    return response.status(cartResponse.status).json(cartResponse);
  }

  @Patch()
  async updateCart(
    @CurrentUser() user: GetUserDto,
    @Body() updateCartDto: UpdateCartDto,
    @Res() response: Response,
  ) {
    updateCartDto.userId = user._id;

    const cartResponse: CartR =
      await this.cartService.addOrUpdateCart(updateCartDto);

    return response.status(cartResponse.status).json(cartResponse);
  }

  @Delete(':productId')
  async deleteCart(
    @CurrentUser() user: GetUserDto,
    @Param('productId') productId: string,
    @Res() response: Response,
  ) {
    const cartResponse: CartR = await this.cartService.removeProductFromCart(
      user._id,
      productId,
    );

    return response.status(cartResponse.status).json(cartResponse);
  }
}

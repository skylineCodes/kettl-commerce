import { CurrentUser, JwtAuthGuard } from '@app/common';
import { Controller, UseGuards, Get, Post, Patch, Param, Delete, Body, Res } from '@nestjs/common';
import { CartService } from './cart.service';
import { GetUserDto } from 'apps/auth/src/users/dto/get-user.dto';
import { CreateCartDto } from './dto/create-cart.dto';
import { CartR } from './models/cart.schema';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartResponseDtoR } from './dto/cart-response-array.dto';

@ApiTags('Cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch User Cart' })
  @ApiResponse({
    status: 200,
    type: CartResponseDtoR
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
  })
  @ApiResponse({
    status: 500,
    description: 'User cart with ID 66c72ef1591afcd4c692706c not found',
  })
  async getCart(@CurrentUser() user: GetUserDto, @Res() response: Response) {
    const cartResponse: CartR = await this.cartService.getCart(user._id);

    return response.status(cartResponse.status).json(cartResponse);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add To Cart' })
  @ApiResponse({
    status: 201,
    description: 'Cart added successfully!',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
  })
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

  @Delete(':productId')
  @ApiOperation({ summary: 'Remove Product From Cart' })
  @ApiResponse({
    status: 200,
    description: 'Product removed successfully from the cart!',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
  })
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

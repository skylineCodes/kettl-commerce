import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Res
} from '@nestjs/common';
import { Response } from 'express';
import { OrderServiceService } from './order-service.service';
import { CreateOrderDto } from './dto/create-order-service.dto';
import { UpdateOrderDto } from './dto/update-order-service.dto';
import { OrderR } from './models/order-service.schema';
import { CurrentUser, JwtAuthGuard, UserDto } from '@app/common';
import { UserDocument } from 'apps/auth/src/users/models/user.schema';

@Controller('orders')
export class OrderServiceController {
  constructor(private readonly orderService: OrderServiceService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: UserDto, @Res() response: Response) {
    const orderResponse: OrderR = await this.orderService.findAll(user);

    return response.status(orderResponse.status).json(orderResponse);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() response: Response) {
    const orderResponse: OrderR = await this.orderService.findOne(id);

    return response.status(orderResponse.status).json(orderResponse);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: UserDto,
    @Body() createOrderDto: CreateOrderDto,
    @Res() response: Response,
  ) {
    const orderResponse: OrderR = await this.orderService.create(
      createOrderDto,
      user,
    );

    return response.status(orderResponse.status).json(orderResponse);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @Res() response: Response,
  ) {
    const orderResponse: OrderR = await this.orderService.update(
      id,
      updateOrderDto,
    );

    return response.status(orderResponse.status).json(orderResponse);
  }

  @Get(':id/track')
  @UseGuards(JwtAuthGuard)
  async trackOrderStatus(@Param('id') id: number, @Res() response: Response) {
    const orderResponse: OrderR = await this.orderService.trackOrderStatus(id);

    return response.status(orderResponse.status).json(orderResponse);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @Res() response: Response,
  ) {
    const orderResponse: OrderR = await this.orderService.remove(
      id,
      updateOrderDto,
    );

    return response.status(orderResponse.status).json(orderResponse);
  }
}

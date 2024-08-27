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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderResponseDtoR, SingleOrderResponseDtoR, TrackOrderResponseDtoR } from './dto/order-response-array.dto';
import { CancelOrderDto } from './dto/cancel-order-service.dto';

@ApiTags('Orders')
@Controller('order-service')
export class OrderServiceController {
  constructor(private readonly orderService: OrderServiceService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Fetch Orders' })
  @ApiResponse({
    status: 200,
    type: OrderResponseDtoR
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
  })
  async findAll(@CurrentUser() user: UserDto, @Res() response: Response) {
    const orderResponse: OrderR = await this.orderService.findAll(user);

    return response.status(orderResponse.status).json(orderResponse);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Fetch Single Orders' })
  @ApiResponse({
    status: 200,
    type: SingleOrderResponseDtoR
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
  })
  async findOne(@CurrentUser() user: UserDto, @Param('id') id: number, @Res() response: Response) {
    const orderResponse: OrderR = await this.orderService.findOne(user, id);

    return response.status(orderResponse.status).json(orderResponse);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create Orders' })
  @ApiResponse({
    status: 200,
    description: 'Order created successfully!',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
  })
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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update Order' })
  @ApiResponse({
    status: 201,
    description: 'Order updated successfully!',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
  })
  async update(
    @CurrentUser() user: UserDto,
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @Res() response: Response,
  ) {
    const orderResponse: OrderR = await this.orderService.update(
      user,
      id,
      updateOrderDto,
    );

    return response.status(orderResponse.status).json(orderResponse);
  }

  @Get(':id/track')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Track Order' })
  @ApiResponse({
    status: 200,
    type: TrackOrderResponseDtoR
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
  })
  async trackOrderStatus(@Param('id') id: number, @Res() response: Response) {
    const orderResponse: OrderR = await this.orderService.trackOrderStatus(id);

    return response.status(orderResponse.status).json(orderResponse);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cancel Order' })
  @ApiResponse({
    status: 200,
    description: 'Order cancelled successfully!',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
  })
  async remove(
    @Param('id') id: number,
    @Body() cancelOrderDto: CancelOrderDto,
    @Res() response: Response,
  ) {
    const orderResponse: OrderR = await this.orderService.remove(
      id,
      cancelOrderDto,
    );

    return response.status(orderResponse.status).json(orderResponse);
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { AddressDto } from 'apps/auth/src/users/dto/create-address.dto';
import { UserDocument } from 'apps/auth/src/users/models/user.schema';
import { ProductServiceDocument } from 'apps/product-service/src/models/product-service.schema';

export class OrderResponseDto {
    @ApiProperty({ type: UserDocument })
    user: UserDocument;

    @ApiProperty({ type: [ProductServiceDocument] })
    orderItems: ProductServiceDocument[];

    @ApiProperty({ type: AddressDto })
    shippingAddress: AddressDto;

    @ApiProperty({ type: AddressDto })
    billingAddress: AddressDto;

    @ApiProperty({ example: '109.97' })
    totalAmount: string;

    @ApiProperty({ example: 'pending' })
    status: string;

    @ApiProperty({ example: 'credit_card' })
    paymentMethod: string;

    @ApiProperty({ example: null })
    completedAt: Date;

    @ApiProperty({ example: 'standard' })
    shippingMethod: string;

    @ApiProperty({ example: '2024-08-25T19:17:20.000Z' })
    createdAt: Date;

    @ApiProperty({ example: '2024-08-25T19:17:20.213Z' })
    updatedAt: Date;
}

export class TrackOrderResponseDto {
    @ApiProperty({ example: 'shipped' })
    status: string;
}

export class OrderResponseDtoR {
    @ApiProperty({ example: 200 })
    status: number;

    @ApiProperty({ type: [OrderResponseDto] })
    data?: OrderResponseDto[];
}

export class SingleOrderResponseDtoR {
    @ApiProperty({ example: 200 })
    status: number;

    @ApiProperty({ type: OrderResponseDto })
    data?: OrderResponseDto;
}

export class TrackOrderResponseDtoR {
    @ApiProperty({ example: 200 })
    status: number;

    @ApiProperty({ type: TrackOrderResponseDto })
    data?: TrackOrderResponseDto;
}

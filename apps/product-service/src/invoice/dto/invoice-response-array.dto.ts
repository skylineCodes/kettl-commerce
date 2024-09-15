import { ApiProperty } from '@nestjs/swagger';
import { AddressDto } from 'apps/auth/src/users/dto/create-address.dto';
import { UserDocument } from 'apps/auth/src/users/models/user.schema';
import { ProductServiceDocument } from 'apps/product-service/src/models/product-service.schema';

export class InvoiceResponseDto {
    @ApiProperty({ type: UserDocument })
    user: UserDocument;

    @ApiProperty({ example: [
        {
            "quantity": 2,
            "subtotal": 3999,
            "_id": "66c73238bc684d9aeeae9e0a",
            "name": "Gaming Laptop Pro",
            "description": "High performance gaming laptop",
            "slug": "gaming-laptop-pro",
            "price": 1999.99,
            "currency": "USD",
            "stockQuantity": 30,
            "sku": "GLP12345",
            "availabilityStatus": "In Stock",
            "categories": [
                "Electronics",
                "Computers"
            ],
            "tags": [
                "gaming",
                "laptop",
                "high-performance"
            ],
            "brand": "GameTech",
            "product_model": "GLP2021",
            "colors": [
                "Black"
            ],
            "sizes": [
                "15.6-inch"
            ],
            "weight": 2.5,
            "dimensions": {
                "length": 38,
                "width": 25.5,
                "height": 2.5,
                "_id": "66c73238bc684d9aeeae9e14"
            },
            "product_images": [
                "https://images.pexels.com/photos/19012059/pexels-photo-19012059/free-photo-of-a-gaming-laptop-and-headphones.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://images.pexels.com/photos/3951449/pexels-photo-3951449.jpeg?auto=compress&cs=tinysrgb&w=600"
            ],
            "videos": [
                "https://videos.pexels.com/video-files/15114969/15114969-hd_1280_720_25fps.mp4"
            ],
            "thumbnails": [
                "https://images.pexels.com/photos/15838208/pexels-photo-15838208/free-photo-of-close-up-of-gaming-desk.jpeg?auto=compress&cs=tinysrgb&w=600"
            ],
            "manufacturer": "GameTech Co.",
            "warranty": "3 Years",
            "countryOfOrigin": "Taiwan",
            "ratings": 4.7,
            "relatedProducts": [],
            "reviews": [],
            "__v": 0
        },
        {
            "quantity": 1,
            "subtotal": 1999,
            "_id": "66c73238bc684d9aeeae9e0b",
            "name": "Wireless Earbuds",
            "description": "Noise-cancelling wireless earbuds",
            "slug": "wireless-earbuds",
            "price": 199.99,
            "currency": "USD",
            "stockQuantity": 200,
            "sku": "WE12345",
            "availabilityStatus": "In Stock",
            "categories": [
                "Electronics",
                "Audio"
            ],
            "tags": [
                "wireless",
                "earbuds",
                "noise-cancelling"
            ],
            "brand": "SoundWave",
            "product_model": "WE2021",
            "colors": [
                "White",
                "Black"
            ],
            "sizes": [],
            "weight": 0.05,
            "dimensions": {
                "length": 6,
                "width": 5,
                "height": 2.5,
                "_id": "66c73238bc684d9aeeae9e15"
            },
            "product_images": [
                "https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://images.pexels.com/photos/10029870/pexels-photo-10029870.jpeg?auto=compress&cs=tinysrgb&w=600"
            ],
            "videos": [
                "https://videos.pexels.com/video-files/7710285/7710285-hd_720_1366_25fps.mp4"
            ],
            "thumbnails": [
                "https://images.pexels.com/photos/10029870/pexels-photo-10029870.jpeg?auto=compress&cs=tinysrgb&w=600"
            ],
            "manufacturer": "SoundWave Ltd.",
            "warranty": "1 Year",
            "countryOfOrigin": "China",
            "ratings": 4.3,
            "relatedProducts": [],
            "reviews": [],
            "__v": 0
        }
    ]})
    cartItems: ProductServiceDocument[];

    @ApiProperty({ type: AddressDto })
    shippingAddress: AddressDto;

    @ApiProperty({ type: AddressDto })
    billingAddress: AddressDto;

    @ApiProperty({ example: '3999.97' })
    total: string;

    @ApiProperty({ example: '499.99' })
    tax: string;
}

export class InvoiceResponseDtoR {
    @ApiProperty({ example: 200 })
    status: number;

    @ApiProperty({ type: InvoiceResponseDto })
    data?: InvoiceResponseDto;
}
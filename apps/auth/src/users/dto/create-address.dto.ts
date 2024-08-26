import { ApiProperty } from "@nestjs/swagger";

export class AddressDto {
  @ApiProperty({ example: 'Kolade estate, Gof area.' })
  street: string;

  @ApiProperty({ example: 'Osogbo' })
  city: string;

  @ApiProperty({ example: 'Osun' })
  state: string;

  @ApiProperty({ example: '10011' })
  postalCode: string;

  @ApiProperty({ example: 'Nigeria' })
  country: string;
}

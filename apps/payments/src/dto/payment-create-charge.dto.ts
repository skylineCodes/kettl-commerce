import { CreateChargeDTO } from "@app/common/dto/create-charge.dto";
import { IsEmail } from "class-validator";


export class PaymentsCreateChargeDto extends CreateChargeDTO {
    @IsEmail()
    email: string;
}
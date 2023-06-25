import { IsString } from "class-validator";
import { BaseDto } from "src/base/base.dto";

import { ApiProperty } from "@nestjs/swagger";
import { Customer } from "@src/entities/Customer.entity";

export class CreateCustomerDto extends BaseDto<Customer> {
    @ApiProperty({
        description: "name",
        required: true,
    })
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty({
        description: "address",
        required: true,
    })
    @ApiProperty()
    @IsString()
    address: string;

    @ApiProperty({
        description: "phoneNumber",
        required: true,
    })
    @ApiProperty()
    @IsString()
    phoneNumber: string;
}

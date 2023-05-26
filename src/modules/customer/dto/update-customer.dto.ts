import {
    IsNumber,
    IsOptional,
} from "class-validator";
import { BaseDto } from "src/base/base.dto";

import { ApiProperty } from "@nestjs/swagger";
import { Customer } from "@src/entities/Customer.entity";
import { Property } from "@src/utils/general.util";

export class UpdateCustomerDto extends BaseDto<Customer> {
    @ApiProperty({
        required: true,
        description: "User's id"
    })
    @IsNumber()
    @Property()
    id: number

    @ApiProperty({
        default: null,
        required: false,
        description: "User's phoneNumber"
    })
    @IsOptional()
    @Property()
    phoneNumber: string

    @ApiProperty({
        default: null,
        required: false,
        description: "User's email"
    })
    @IsOptional()
    @Property()
    email: string

    @ApiProperty({
        default: "New User",
        required: false,
        description: "User's name"
    })
    @IsOptional()
    @Property()
    name: string

    @ApiProperty({
        default: 0,
        required: false,
        description: "User's name"
    })
    @IsOptional()
    @IsNumber()
    @Property()
    gender: number

    @ApiProperty({
        default: null,
        required: false,
        description: "User's address"
    })
    @IsOptional()
    @Property()
    address: string

}
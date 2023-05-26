import { BaseDto } from "src/base/base.dto";

import { ApiProperty } from "@nestjs/swagger";
import { Customer } from "@src/entities/Customer.entity";

export class CreateCustomerDto extends BaseDto<Customer> {
    @ApiProperty({
        description: "name",
        required: true
    })
    name: string

    @ApiProperty({
        description: "address",
        required: true
    })
    address: string


    @ApiProperty({
        description: "phoneNumber",
        required: true
    })
    phoneNumber: string

}
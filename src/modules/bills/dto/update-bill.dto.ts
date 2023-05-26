import {
    IsNumber,
    IsOptional,
} from "class-validator";
import { BaseDto } from "src/base/base.dto";
import { Property } from "src/utils/general.util";

import { ApiProperty } from "@nestjs/swagger";
import { Bills } from "@src/entities/Bill.entity";

class CustomerInfo {
    @ApiProperty({
        description: "name",
        required: true
    })
    name: string

    @ApiProperty({
        description: "phoneNumber",
        required: true
    })
    phoneNumber: string

    @ApiProperty({
        description: "address",
        required: true
    })
    address: string

}
export class UpdateBillDto extends BaseDto<Bills>{

    @ApiProperty({
        description: "Customer",
        required: true

    })
    // @IsString()
    @Property()
    @IsNumber()
    customer: CustomerInfo

    @ApiProperty({
        description: "ItemId",
        required: true
    })
    @Property()
    items: any


    @ApiProperty({
        description: "Start",
        required: true
    })
    // @IsNumber()
    @Property()
    @IsOptional()
    start: number

    @ApiProperty({
        description: "End",
        required: true
    })
    // @IsNumber()
    @Property()
    @IsOptional()
    end: number

    @ApiProperty({
        description: "address",
        required: true
    })
    // @IsNumber()
    @Property()
    @IsOptional()
    address: string

    @ApiProperty({
        description: "deposit",
        required: true
    })
    // @IsNumber()
    @Property()
    @IsOptional()
    deposit: string

    @ApiProperty({
        description: "Quantity",
        required: true
    })
    // @IsNumber()
    @Property()
    @IsOptional()
    quantity: number

}
import {
    IsOptional,
    IsString,
} from "class-validator";
import { BaseDto } from "src/base/base.dto";
import { Property } from "src/utils/general.util";

import { ApiProperty } from "@nestjs/swagger";
import { Product } from "@src/entities/Product.entity";

export class GetProductDto extends BaseDto<Product>{

    @ApiProperty({
        description: "Product's id",
        required: false
    })
    // @IsString()
    @Property()
    @IsOptional()
    id: number

    @ApiProperty({
        description: "Product names",
        required: false

    })
    // @IsString()
    @Property()
    @IsString()
    @IsOptional()
    name: string

    @ApiProperty({
        description: "Product type",
        required: false
    })
    @Property()
    @IsOptional()
    type: number


    @ApiProperty({
        description: "Product Size",
        required: false
    })
    // @IsNumber()
    @Property()
    @IsOptional()
    size: string

    @ApiProperty({
        description: "Post's price",
        required: false
    })
    // @IsNumber()
    @Property()
    @IsOptional()
    price: string

    @ApiProperty({
        description: "Quantity",
        required: false
    })
    // @IsNumber()
    @Property()
    @IsOptional()
    quantity: number

}
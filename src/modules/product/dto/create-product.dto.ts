import { IsInt, IsOptional, IsString } from "class-validator";
import { BaseDto } from "src/base/base.dto";
import { Property } from "src/utils/general.util";

import { ApiProperty } from "@nestjs/swagger";
import { Product } from "@src/entities/Product.entity";

export class CreateProductDto extends BaseDto<Product> {
    @ApiProperty({
        description: "Product names",
        required: true,
    })
    // @IsString()
    @Property()
    @IsString()
    name: string;

    @ApiProperty({
        description: "Product type",
        required: true,
    })
    @Property()
    @IsInt()
    type: number;

    @ApiProperty({
        description: "Product Size",
        required: true,
    })
    // @IsNumber()
    @Property()
    @IsOptional()
    size: string;

    @ApiProperty({
        description: "Post's price",
        required: true,
    })
    // @IsNumber()
    @Property()
    @IsOptional()
    price: string;

    @ApiProperty({
        description: "Quantity",
        required: true,
    })
    // @IsNumber()
    @Property()
    @IsOptional()
    quantity: number;

    @ApiProperty({
        description: "Post's image",
        required: false,
    })
    @IsString()
    @Property()
    @IsOptional()
    // @IsNumber()
    image: string;
}

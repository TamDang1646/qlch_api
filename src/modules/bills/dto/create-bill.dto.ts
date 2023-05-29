import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsObject, IsOptional } from "class-validator";
import { BaseDto } from "src/base/base.dto";
import { Property } from "src/utils/general.util";

import { ApiProperty } from "@nestjs/swagger";
import { Bills } from "@src/entities/Bill.entity";
import { Product } from "@src/entities/Product.entity";
import { CreateCustomerDto } from "@src/modules/customer/dto/create-customer.dto";
import { CreateBillItemDto } from "@src/modules/bill-item/dto/create-bill-item.dto";

class ItemDto extends BaseDto<Product> {
  @ApiProperty({
    description: "id",
    required: true,
  })
  id: number;

  @ApiProperty({
    description: "name",
    required: true,
  })
  name: string;

  @ApiProperty({
    description: "type",
    required: true,
  })
  type: number;

  @ApiProperty({
    description: "price",
    required: true,
  })
  price: string;

  @ApiProperty({
    description: "quantity",
    required: true,
  })
  quantity: number;

  @ApiProperty({
    description: "size",
    required: true,
  })
  size: string;
}
export class CreateBillDto extends BaseDto<Bills> {
  @ApiProperty({
    description: "Customer",
    required: true,
  })
  // @IsString()
  @IsObject()
  @Property()
  @Type(() => CreateCustomerDto)
  customer: CreateCustomerDto;

  @ApiProperty({
    description: "Items",
    required: true,
    default: [],
  })
  @IsArray()
  @Property()
  @ArrayMinSize(1)
  @Type(() => CreateBillItemDto)
  items: CreateBillItemDto[];

  @ApiProperty({
    description: "Start",
    required: true,
  })
  // @IsNumber()
  @Property()
  @IsOptional()
  start: number;

  @ApiProperty({
    description: "End",
    required: true,
  })
  // @IsNumber()
  @Property()
  @IsOptional()
  end: number;

  @ApiProperty({
    description: "address",
    required: true,
  })
  // @IsNumber()
  @Property()
  @IsOptional()
  address: string;

  @ApiProperty({
    description: "deposit",
    required: true,
  })
  // @IsNumber()
  @Property()
  @IsOptional()
  deposit: string;
}

export class BillDto {
  @ApiProperty({
    description: "CustomerId",
    required: true,
  })
  // @IsString()
  @Property()
  customerId: number;

  @ApiProperty({
    description: "Start",
    required: true,
  })
  // @IsNumber()
  @Property()
  @IsOptional()
  start: number;

  @ApiProperty({
    description: "End",
    required: true,
  })
  // @IsNumber()
  @Property()
  @IsOptional()
  end: number;

  @ApiProperty({
    description: "address",
    required: true,
  })
  // @IsNumber()
  @Property()
  @IsOptional()
  address: string;

  @ApiProperty({
    description: "deposit",
    required: true,
  })
  // @IsNumber()
  @Property()
  @IsOptional()
  deposit: string;

  @ApiProperty({
    description: "totalPrice",
    required: true,
  })
  // @IsNumber()
  @Property()
  @IsOptional()
  totalPrice: string;

  @ApiProperty({
    description: "paid",
    required: true,
    default: 0,
  })
  // @IsNumber()
  @Property()
  @IsOptional()
  paid: number;
}

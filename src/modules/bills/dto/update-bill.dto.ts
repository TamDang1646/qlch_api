import { IsArray, IsNumber, IsOptional } from "class-validator";
import { BaseDto } from "src/base/base.dto";
import { Property } from "src/utils/general.util";

import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Bills } from "@src/entities/Bill.entity";
import { CreateBillItemDto } from "@src/modules/bill-item/dto/create-bill-item.dto";
import { UpdateBillItemDto } from "@src/modules/bill-item/dto/update-bill-item.dto";

class CustomerInfo {
    @ApiProperty({
        description: "name",
        required: true,
    })
    name: string;

    @ApiProperty({
        description: "phoneNumber",
        required: true,
    })
    phoneNumber: string;

    @ApiProperty({
        description: "address",
        required: true,
    })
    address: string;
}

export class UpdateCustomerInfor extends PartialType(CustomerInfo) {
    @ApiProperty({
        description: "id of customer",
    })
    id: number;
}
export class UpdateBillDto extends BaseDto<Bills> {
    @ApiProperty({
        description: "Customer",
        required: true,
    })
    // @IsString()
    @Property()
    @IsOptional()
    customer: UpdateCustomerInfor;

    @ApiProperty({
        description: "delete billitem ids",
    })
    @IsOptional()
    deleteBillItemIds: number[];

    @ApiProperty({
        description: "ItemId",
        required: true,
    })
    @Property()
    @IsOptional()
    items: UpdateBillItemDto[];

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
        description: "Quantity",
        required: true,
    })
    // @IsNumber()
    @Property()
    @IsOptional()
    quantity: number;
}

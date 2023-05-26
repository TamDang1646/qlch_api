import { ApiProperty } from "@nestjs/swagger";

export class CreateBillItemDto {
    @ApiProperty({
        description: "billId",
        required: true
    })
    billId: number

    @ApiProperty({
        description: "itemId",
        required: true
    })
    itemId: number


    @ApiProperty({
        description: "size",
        required: true
    })
    size: string

    @ApiProperty({
        description: "quantity",
        required: true
    })
    quantity: number

}
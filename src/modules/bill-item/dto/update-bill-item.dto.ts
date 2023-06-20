import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateBillItemDto } from "./create-bill-item.dto";

export class UpdateBillItemDto extends PartialType(CreateBillItemDto) {
    @ApiProperty({
        description: "id of bill-item",
    })
    id: number;
}

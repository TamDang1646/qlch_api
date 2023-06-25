import { IsOptional } from "class-validator";
import { BaseDto } from "src/base/base.dto";
import { Property } from "src/utils/general.util";

import { ApiProperty } from "@nestjs/swagger";
import { Bills } from "@src/entities/Bill.entity";

export class GetBillDto extends BaseDto<Bills> {
    @ApiProperty({
        description: "Start",
        required: false,
    })
    // @IsNumber()
    @Property()
    @IsOptional()
    start: number;

    @ApiProperty({
        description: "End",
        required: false,
    })
    // @IsNumber()
    @Property()
    @IsOptional()
    end: number;
}

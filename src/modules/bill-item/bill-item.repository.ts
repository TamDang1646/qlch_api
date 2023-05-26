import {
    EntityRepository,
    Repository,
} from "typeorm";

import { BillItems } from "@src/entities/BillItem.entity";

@EntityRepository(BillItems)
export class BillItemRepository extends Repository<BillItems> {

}
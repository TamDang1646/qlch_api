import {
    EntityRepository,
    Repository,
} from "typeorm";

import { Bills } from "@src/entities/Bill.entity";

@EntityRepository(Bills)
export class BillsRepository extends Repository<Bills> {

}
import { LoggerService } from "src/logger/custom.logger";
import {
    InsertResult,
    QueryFailedError,
} from "typeorm";

import { BaseService } from "@base/base.service";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorCodes } from "@src/constants/error-code.const";
import { Bills } from "@src/entities/Bill.entity";
import { Customer } from "@src/entities/Customer.entity";
import { DatabaseError } from "@src/exceptions/errors/database.error";

import { BillsRepository } from "./bills.repository";
import { BillDto } from "./dto/create-bill.dto";

@Injectable()
export class BillsService extends BaseService<Bills, BillsRepository> {
    constructor(
        @InjectRepository(Bills)
        protected readonly repository: BillsRepository,
        protected readonly logger: LoggerService,
    ) {
        super(repository, logger);
    }
    async getAll(param: any): Promise<Bills[]> {
        const query = this.repository.manager.createQueryBuilder<Bills>(Bills, "bills")
            .innerJoin(Customer, "cus", "bills.customerId=cus.id ")
            .select("bills.*, cus.name as customerName,cus.phone_number as customerPhonenumber, cus.address as customerAddress")
        if (param?.start && param?.end) {
            const start = new Date(parseInt(`${param.start}`))
            const end = new Date(parseInt(`${param.end}`))
            query.andWhere("bills.start >= :start or bills.end <= :end", { start: start, end: end })
                .orderBy("bills.id", "DESC")
        } else {
            query.orderBy("bills.id", "DESC")
        }
        return await query.execute()
        // return await this.repository.find();
    }
    async getBillsId(id): Promise<Bills> {
        return await this.repository.findOne({
            where: [{ id }],
        });
    }

    async deleteBillsById(id): Promise<boolean> {
        const isExist = await this.repository.findOne({
            where: {
                id,
            },
        });

        if (!isExist) {
            throw new DatabaseError(
                "BILLS_NOT_EXIST",
                "BILLS_NOT_EXIST",
                ErrorCodes.BILL_NOT_EXIST,
            );
        }

        try {
            await this.repository.delete({ id: isExist.id });
            return true;
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new DatabaseError(
                    "DELETE_ERROR",
                    error as unknown as Record<string, unknown>,
                    ErrorCodes.DELETE_ERROR,
                );
            }
            throw new DatabaseError(
                "DATABASE_CONNECTION_ERROR",
                error as Record<string, unknown>,
                ErrorCodes.DATABASE_CONNECTION_ERROR,
            );
        }
    }

    async addBills(addData: BillDto) {
        let result: InsertResult;
        try {
            console.log(addData);

            console.log(
                await this.repository
                    .createQueryBuilder()
                    .insert()
                    .values(addData)
                    .getQuery(),
            );

            result = await this.repository
                .createQueryBuilder()
                .insert()
                .values(addData)
                .execute();
        } catch (error: unknown) {
            if (error instanceof QueryFailedError) {
                throw new DatabaseError(
                    "INSERT_ERROR",
                    error as unknown as Record<string, unknown>,
                    ErrorCodes.INSERT_ERROR,
                );
            }
            throw new DatabaseError(
                "DATABASE_CONNECTION_ERROR",
                error as Record<string, unknown>,
                ErrorCodes.DATABASE_CONNECTION_ERROR,
            );
        }

        return new Bills(result.generatedMaps[0]);
    }

    async updateBillsById(id, data: unknown): Promise<any> {
        try {
            //Update Record in User Table

            const res = await this.repository
                .createQueryBuilder()
                .update()
                .set(data)
                .where("id = :id", { id: id })
                .execute();
        } catch (error: unknown) {
            console.log("data", error);
            if (error instanceof QueryFailedError) {
                throw new DatabaseError(
                    "UPDATE_ERROR",
                    error as unknown as Record<string, unknown>,
                    ErrorCodes.UPDATE_ERROR,
                );
            }
            throw new DatabaseError(
                "DATABASE_CONNECTION_ERROR",
                error as Record<string, unknown>,
                ErrorCodes.DATABASE_CONNECTION_ERROR,
            );
        }

        return await this.repository.findOne({ where: { id: id } });
    }

    async getDeposit(): Promise<any> {
        try {
            //Update Record in User Table

            const res = await this.repository
                .createQueryBuilder()
                .select('COUNT (*) as totalBill,SUM(CAST(CONCAT(deposit) AS DECIMAL(10,0))) as totalDeposit')

            return res.getRawOne();
        } catch (error: unknown) {
            console.log("data", error);
            if (error instanceof QueryFailedError) {
                throw new DatabaseError(
                    "UPDATE_ERROR",
                    error as unknown as Record<string, unknown>,
                    ErrorCodes.UPDATE_ERROR,
                );
            }
            throw new DatabaseError(
                "DATABASE_CONNECTION_ERROR",
                error as Record<string, unknown>,
                ErrorCodes.DATABASE_CONNECTION_ERROR,
            );
        }
    }
}

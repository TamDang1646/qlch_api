import { LoggerService } from "src/logger/custom.logger";
import { DeleteResult, InsertResult, QueryFailedError } from "typeorm";

import { BaseService } from "@base/base.service";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorCodes } from "@src/constants/error-code.const";
import { BillItems } from "@src/entities/BillItem.entity";
import { DatabaseError } from "@src/exceptions/errors/database.error";

import { BillItemRepository } from "./bill-item.repository";
import { ItemDto } from "@src/api-response/api-response.dto";
import { CreateBillItemDto } from "./dto/create-bill-item.dto";

@Injectable()
export class BillItemsService extends BaseService<
    BillItems,
    BillItemRepository
> {
    constructor(
        @InjectRepository(BillItems)
        protected readonly repository: BillItemRepository,
        protected readonly logger: LoggerService,
    ) {
        super(repository, logger);
    }
    async getAll(): Promise<BillItems[]> {
        // const query = this.repository.manager.createQueryBuilder<Auth>(Auth, "auth")
        //     .select("*")
        // console.log("query",query.getQuery(),await query.getMany());

        // return await query.getMany()
        return await this.repository.find();
    }
    async getBillItemById(billId): Promise<BillItems[]> {
        return await this.repository.find({
            where: [{ billId }],
        });
    }

    async getBillItemsId(id): Promise<BillItems> {
        return await this.repository.findOne({
            where: [{ id }],
        });
    }

    async deleteBillItemsById(id): Promise<boolean> {
        const isExist = await this.repository.findOne({
            where: {
                id,
            },
        });

        if (!isExist) {
            throw new DatabaseError(
                "BillItems_NOT_EXIST",
                "BillItems_NOT_EXIST",
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

    async addBillItems(addData: CreateBillItemDto[], billId: number) {
        let data = addData.map((item) => {
            const newItem = new BillItems({ ...item, billId: billId });
            delete newItem["id"];
            return newItem;
        });
        let result: InsertResult;
        try {
            result = await this.repository
                .createQueryBuilder()
                .insert()
                .values(data)
                .into(BillItems)
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
        return this.getBillItemById(billId);
    }

    async updateBillItemsById(id, data: unknown): Promise<any> {
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
    async deleteByBillId(id): Promise<any> {
        let result: DeleteResult;
        try {
            result = await this.repository
                .createQueryBuilder()
                .delete()
                .where("billId = :id", { id: id })
                .execute();
        } catch (error: unknown) {
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
        return result;
    }
}

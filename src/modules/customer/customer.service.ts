import { LoggerService } from "src/logger/custom.logger";
import {
    InsertResult,
    QueryFailedError,
} from "typeorm";

import { BaseService } from "@base/base.service";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorCodes } from "@src/constants/error-code.const";
import { Customer } from "@src/entities/Customer.entity";
import { DatabaseError } from "@src/exceptions/errors/database.error";

import { CustomerRepository } from "./Customer.repository";

@Injectable()
export class CustomerService extends BaseService<Customer, CustomerRepository> {
    constructor(
        @InjectRepository(Customer)
        protected readonly repository: CustomerRepository,
        protected readonly logger: LoggerService,
    ) {
        super(repository, logger)
    }
    async getAll(): Promise<Customer[]> {
        // const query = this.repository.manager.createQueryBuilder<Auth>(Auth, "auth")
        //     .select("*")
        // console.log("query",query.getQuery(),await query.getMany());

        // return await query.getMany()
        return await this.repository.find()

    }
    async getCustomerId(id): Promise<Customer> {
        return await this.repository.findOne(
            {
                where: [
                    { id }
                ]
            }
        )
    }

    async deleteCustomerById(id): Promise<boolean> {
        const isExist = await this.repository.findOne(
            {
                where: {
                    id
                }

            }
        )

        if (!isExist) {
            throw new DatabaseError(
                "Customer_NOT_EXIST",
                "Customer_NOT_EXIST",
                ErrorCodes.BILL_NOT_EXIST)
        }

        try {
            await this.repository.delete({ id: isExist.id })
            return true
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new DatabaseError("DELETE_ERROR",
                    error as unknown as Record<string, unknown>,
                    ErrorCodes.DELETE_ERROR)
            }
            throw new DatabaseError("DATABASE_CONNECTION_ERROR",
                error as Record<string, unknown>,
                ErrorCodes.DATABASE_CONNECTION_ERROR)
        }
    }


    async addCustomer(addData: any) {
        let result: InsertResult
        try {
            result = await this.repository.createQueryBuilder()
                .insert()
                .values(addData)
                .into(Customer)
                .execute()
        } catch (error: unknown) {
            if (error instanceof QueryFailedError) {
                throw new DatabaseError("INSERT_ERROR",
                    error as unknown as Record<string, unknown>,
                    ErrorCodes.INSERT_ERROR)
            }
            throw new DatabaseError("DATABASE_CONNECTION_ERROR",
                error as Record<string, unknown>,
                ErrorCodes.DATABASE_CONNECTION_ERROR)

        }

        return new Customer(result.generatedMaps[0])
    }


    async updateCustomerById(id, data: unknown): Promise<any> {
        try {
            //Update Record in User Table

            const res = await this.repository.createQueryBuilder()
                .update()
                .set(data)
                .where("id = :id", { id: id })
                .execute()


        } catch (error: unknown) {
            console.log("data", error);
            if (error instanceof QueryFailedError) {
                throw new DatabaseError(
                    "UPDATE_ERROR",
                    error as unknown as Record<string, unknown>,
                    ErrorCodes.UPDATE_ERROR)
            }
            throw new DatabaseError(
                "DATABASE_CONNECTION_ERROR",
                error as Record<string, unknown>,
                ErrorCodes.DATABASE_CONNECTION_ERROR)
        }

        return await this.repository.findOne({ where: { id: id } })
    }
}


import { LoggerService } from "src/logger/custom.logger";
import {
    InsertResult,
    QueryFailedError,
} from "typeorm";

import { BaseService } from "@base/base.service";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorCodes } from "@src/constants/error-code.const";
import { Product } from "@src/entities/Product.entity";
import { DatabaseError } from "@src/exceptions/errors/database.error";

import { CreateProductDto } from "./dto/create-product.dto";
import { ProductRepository } from "./product.repository";

@Injectable()
export class ProductService extends BaseService<Product, ProductRepository> {
    constructor(
        @InjectRepository(Product)
        protected readonly repository: ProductRepository,
        protected readonly logger: LoggerService,
    ) {
        super(repository, logger)
    }
    async getAll(): Promise<Product[]> {
        // const query = this.repository.manager.createQueryBuilder<Auth>(Auth, "auth")
        //     .select("*")
        // console.log("query",query.getQuery(),await query.getMany());

        // return await query.getMany()
        return await this.repository.find()

    }
    async getProductId(id): Promise<Product> {
        return await this.repository.findOne(
            {
                where: [
                    { id }
                ]
            }
        )
    }

    async deleteProductById(id): Promise<boolean> {
        const isExist = await this.repository.findOne(
            {
                where: {
                    id
                }

            }
        )

        if (!isExist) {
            throw new DatabaseError(
                "PRODUCT_NOT_EXIST",
                "PRODUCT_NOT_EXIST",
                ErrorCodes.PRODUCT_NOT_EXIST)
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


    async addProduct(addData: CreateProductDto) {

        let result: InsertResult
        try {
            result = await this.repository.createQueryBuilder()
                .insert()
                .values(addData)
                .into(Product)
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

        return new Product(result.generatedMaps[0])
    }


    async updateProductById(id, data: unknown): Promise<any> {
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


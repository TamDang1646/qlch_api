import { LoggerService } from "src/logger/custom.logger";
import { InsertResult, QueryFailedError } from "typeorm";

import { BaseService } from "@base/base.service";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorCodes } from "@src/constants/error-code.const";
import { Product } from "@src/entities/Product.entity";
import { DatabaseError } from "@src/exceptions/errors/database.error";

import { CreateProductDto } from "./dto/create-product.dto";
import { GetProductDto } from "./dto/get-product.dto";
import { ProductRepository } from "./product.repository";

@Injectable()
export class ProductService extends BaseService<Product, ProductRepository> {
    constructor(
        @InjectRepository(Product)
        protected readonly repository: ProductRepository,
        protected readonly logger: LoggerService,
    ) {
        super(repository, logger);
    }
    async getAll(): Promise<Product[]> {
        // const query = this.repository.manager.createQueryBuilder<Auth>(Auth, "auth")
        //     .select("*")
        // console.log("query",query.getQuery(),await query.getMany());

        // return await query.getMany()
        return await this.repository.find();
    }
    async getProductId(id): Promise<Product> {
        return await this.repository.findOne({
            where: [{ id }],
        });
    }
    async getProductIds(id): Promise<Product[]> {
        return await this.repository.findByIds(id);
    }

    async deleteProductById(id): Promise<boolean> {
        const isExist = await this.repository.findOne({
            where: {
                id,
            },
        });

        if (!isExist) {
            throw new DatabaseError(
                "PRODUCT_NOT_EXIST",
                "PRODUCT_NOT_EXIST",
                ErrorCodes.PRODUCT_NOT_EXIST,
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

    async addProduct(addData: CreateProductDto) {
        let result: InsertResult;
        try {
            result = await this.repository
                .createQueryBuilder()
                .insert()
                .values(addData)
                .into(Product)
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

        return new Product(result.generatedMaps[0]);
    }

    async updateProductById(id, data: unknown): Promise<any> {
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

    async find(params: GetProductDto) {
        const postTable = this.repository.metadata.tableName;
        const query = this.repository.manager.createQueryBuilder(
            Product,
            postTable,
        );
        // query.leftJoinAndMapMany("post.author", User, "user", "authorId = user.id")
        // query
        //     .innerJoin(
        //         "user",
        //         "user",
        //         "user.id = post.authorId",
        //     )
        // .addSelect("user", "author")
        if (params.id) {
            query.andWhere("id = :id", { id: params.id });
        }
        if (params.type) {
            query.andWhere("type = :type", { type: params.type });
        }
        if (params.name) {
            query.andWhere("name like :name", { name: `%${params.name}%` });
        }
        // if (params.postType && params.postType == 1) {
        //     if (params.minPrice) {
        //         query.andWhere("min_price >= :minPrice", { minPrice: params.minPrice })
        //     }
        //     if (params.maxPrice) {
        //         query.andWhere("max_price <= :maxPrice", { maxPrice: params.maxPrice })
        //     }
        // } else {
        //     if (params.minPrice) {
        //         query.andWhere("price >= :minPrice", { minPrice: params.minPrice })
        //     }
        //     if (params.maxPrice) {
        //         query.andWhere("price <= :maxPrice", { maxPrice: params.maxPrice })
        //     }
        // }
        if (params.size) {
            query.andWhere("size like :size", { size: `%${params.size}%` });
        }
        if (params.price) {
            query.andWhere("price like :price", { price: `%${params.price}%` });
        }
        // if (params.postType) {
        //     query.andWhere("postType = :postType", { postType: params.postType })
        // }
        // if (params.status) {
        //     query.andWhere("status = :status", { status: params.status })
        // }
        query.orderBy("id", "DESC");
        console.log("quey", await query.getQuery());

        // return await query.execute()
        return await query.getMany();
    }
}

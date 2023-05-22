import { DataSource } from "typeorm";

import { BaseController } from "@base/base.controller";
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
    ApiBearerAuth,
    ApiTags,
} from "@nestjs/swagger";
import { MessageComponent } from "@src/components/message.component";
import { ErrorCodes } from "@src/constants/error-code.const";
import { TokenDto } from "@src/dtos/token.dto";
import { Product } from "@src/entities/Product.entity";
import { DatabaseError } from "@src/exceptions/errors/database.error";

import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductService } from "./product.service";

@ApiBearerAuth()
@ApiTags('Product')
@Controller("product")
export class ProductController extends BaseController {
    constructor(
        private readonly productService: ProductService,
        private readonly configService: ConfigService,
        protected readonly dataSource: DataSource,
        // private readonly componentService: ComponentService,
        private i18n: MessageComponent,
    ) {
        super(i18n);
    }
    /**
     * 
     * @returns 
     */
    @Get("/all")
    async test(): Promise<Product[]> {
        // try {
        //     return await this.productService.getAll()
        // } catch (error) {
        //     this.throwErrorProcess(error)
        // }
        return
    }

    @Get("/:id")
    async getProductById(
        @Param("id") id: number,
    ): Promise<any> {
        try {
            let token = new TokenDto
            token.userId = id
            const res = await this.productService.getProductId(id)
            if (!res) {
                throw new DatabaseError(
                    "PRODUCT_NOT_EXIST",
                    "PRODUCT_NOT_EXIST",
                    ErrorCodes.PRODUCT_NOT_EXIST
                )
            }
            return res
            // return res.map((item) => ({ ...item, isSave: 1 }))
        } catch (error) {
            this.throwErrorProcess(error)
        }
    }


    @Post()
    async addProduct(
        @Body() addData: CreateProductDto
    ): Promise<Product> {
        console.log("postData", addData);
        try {

            const res = await this.productService.addProduct(addData)
            return res
        } catch (error) {
            this.throwErrorProcess(error)
        }
    }

    @Delete("/:id")
    async deleteSave(
        // @Query() param: SaveDto,
        @Param("id") id: number,
    ): Promise<any> {
        try {
            const res = await this.productService.deleteProductById(id)
            if (res) {
                return {
                    message: "Xoá thành công",
                }
            }
        }
        catch (error) {
            this.throwErrorProcess(error)
        }
    }

    @Patch("/:id")
    async updatePost(
        @Param("id") id: number,
        @Body() updateData: UpdateProductDto
    ): Promise<any> {
        try {
            return await this.productService.updateProductById(id, updateData as unknown as Record<string, unknown>)
        } catch (error) {
            this.throwErrorProcess(error)
        }
    }
}
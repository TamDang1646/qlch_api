import { ApiResponseService } from "src/api-response/api-response.service";
import ComponentService from "src/components/component";
import { MessageComponent } from "src/components/message.component";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Auth } from "@src/entities/Auth.entity";
import { BillItems } from "@src/entities/BillItem.entity";
import { Product } from "@src/entities/Product.entity";

import { AuthRepository } from "../auth/auth.repository";
import { AuthServices } from "../auth/auth.service";
import { BillItemsService } from "../bill-item/bill-item.service";
import { ProductController } from "./product.controller";
import { ProductRepository } from "./product.repository";
import { ProductService } from "./product.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, ProductRepository, Auth, BillItems]),
    ],
    providers: [
        ProductService,
        MessageComponent,
        ApiResponseService,
        ComponentService,
        AuthServices,
        AuthRepository,
        BillItemsService,
    ],
    exports: [TypeOrmModule, ProductService],
    controllers: [ProductController],
})
export class ProductModule {}

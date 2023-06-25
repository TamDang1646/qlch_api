import { ApiResponseService } from "src/api-response/api-response.service";
import ComponentService from "src/components/component";
import { MessageComponent } from "src/components/message.component";
import { Auth } from "src/entities/Auth.entity";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BillItems } from "@src/entities/BillItem.entity";
import { Customer } from "@src/entities/Customer.entity";
import { Product } from "@src/entities/Product.entity";

import { BillItemsService } from "../bill-item/bill-item.service";
import { ProductService } from "../product/product.service";
import { AuthController } from "./auth.controller";
import { AuthServices } from "./auth.service";

@Module({
    imports: [TypeOrmModule.forFeature([Auth, Customer, BillItems, Product])],
    providers: [
        AuthServices,
        MessageComponent,
        ApiResponseService,
        ComponentService,
        BillItemsService,
        ProductService,
    ],
    exports: [TypeOrmModule, AuthServices, AuthServices],
    controllers: [AuthController],
})
export class AuthModule {}

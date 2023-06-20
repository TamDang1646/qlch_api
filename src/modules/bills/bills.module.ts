import { ApiResponseService } from "src/api-response/api-response.service";
import ComponentService from "src/components/component";
import { MessageComponent } from "src/components/message.component";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Auth } from "@src/entities/Auth.entity";
import { Bills } from "@src/entities/Bill.entity";
import { BillItems } from "@src/entities/BillItem.entity";
import { Customer } from "@src/entities/Customer.entity";
import { Product } from "@src/entities/Product.entity";

import { AuthRepository } from "../auth/auth.repository";
import { AuthServices } from "../auth/auth.service";
import { BillItemsService } from "../bill-item/bill-item.service";
import { CustomerRepository } from "../customer/customer.repository";
import { CustomerService } from "../customer/customer.service";
import { ProductService } from "../product/product.service";
import { BillsController } from "./bills.controller";
import { BillsRepository } from "./bills.repository";
import { BillsService } from "./bills.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Bills,
            BillsRepository,
            Auth,
            Customer,
            BillItems,
            Product,
        ]),
    ],
    providers: [
        BillsService,
        MessageComponent,
        ApiResponseService,
        ComponentService,
        ProductService,
        AuthServices,
        AuthRepository,
        CustomerService,
        CustomerRepository,
        BillItemsService,
    ],
    exports: [TypeOrmModule, BillsService],
    controllers: [BillsController],
})
export class BillsModule {}

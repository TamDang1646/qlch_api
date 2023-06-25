import { ApiResponseService } from "src/api-response/api-response.service";
import ComponentService from "src/components/component";
import { MessageComponent } from "src/components/message.component";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Auth } from "@src/entities/Auth.entity";
import { BillItems } from "@src/entities/BillItem.entity";
import { Customer } from "@src/entities/Customer.entity";
import { Product } from "@src/entities/Product.entity";

import { AuthRepository } from "../auth/auth.repository";
import { AuthServices } from "../auth/auth.service";
import { BillItemsService } from "../bill-item/bill-item.service";
import { ProductService } from "../product/product.service";
import { CustomerController } from "./customer.controller";
import { CustomerRepository } from "./customer.repository";
import { CustomerService } from "./customer.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Customer,
            CustomerRepository,
            Auth,
            BillItems,
            Product,
        ]),
    ],
    providers: [
        CustomerService,
        MessageComponent,
        ApiResponseService,
        ComponentService,
        ProductService,
        AuthServices,
        AuthRepository,
        BillItemsService,
    ],
    exports: [TypeOrmModule, CustomerService],
    controllers: [CustomerController],
})
export class CustomerModule {}

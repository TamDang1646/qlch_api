import { ApiResponseService } from "src/api-response/api-response.service";
import ComponentService from "src/components/component";
import { MessageComponent } from "src/components/message.component";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Auth } from "@src/entities/Auth.entity";
import { Customer } from "@src/entities/Customer.entity";

import { AuthRepository } from "../auth/auth.repository";
import { AuthServices } from "../auth/auth.service";
import { CustomerController } from "./Customer.controller";
import { CustomerRepository } from "./Customer.repository";
import { CustomerService } from "./customer.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Customer, CustomerRepository, Auth]),
    ],
    providers: [CustomerService, MessageComponent, ApiResponseService, ComponentService, AuthServices, AuthRepository],
    exports: [TypeOrmModule, CustomerService],
    controllers: [CustomerController],
})

export class CustomerModule {

}
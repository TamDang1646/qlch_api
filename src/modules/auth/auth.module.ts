import { ApiResponseService } from "src/api-response/api-response.service";
import ComponentService from "src/components/component";
import { MessageComponent } from "src/components/message.component";
import { Auth } from "src/entities/Auth.entity";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Customer } from "@src/entities/Customer.entity";

import { AuthController } from "./auth.controller";
import { AuthServices } from "./auth.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Auth, Customer]),

    ],
    providers: [AuthServices, MessageComponent, ApiResponseService, ComponentService],
    exports: [TypeOrmModule, AuthServices, AuthServices],
    controllers: [AuthController],
})

export class AuthModule {

}
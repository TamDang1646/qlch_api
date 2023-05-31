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
import { Customer } from "@src/entities/Customer.entity";
import { DatabaseError } from "@src/exceptions/errors/database.error";
import { generateId } from "@src/utils/id-generator.util";

import { CustomerService } from "./customer.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";

@ApiBearerAuth()
@ApiTags('Customer')
@Controller("customer")
export class CustomerController extends BaseController {
    constructor(
        private readonly customerService: CustomerService,
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
    async test(): Promise<Customer[]> {
        try {
            return await this.customerService.getAll()
        } catch (error) {
            this.throwErrorProcess(error)
        }
    }

    @Get("/:id")
    async getCustomerById(
        @Param("id") id: string,
    ): Promise<any> {
        try {
            const res = await this.customerService.getCustomerId(id)
            if (!res) {
                throw new DatabaseError(
                    "CUSTOMER_NOT_EXIST",
                    "CUSTOMER_NOT_EXIST",
                    ErrorCodes.DATA_NOT_EXIST
                )
            }
            return res
            // return res.map((item) => ({ ...item, isSave: 1 }))
        } catch (error) {
            this.throwErrorProcess(error)
        }
    }


    @Post()
    async addCustomer(
        @Body() addData: CreateCustomerDto
    ): Promise<any> {
        try {
            console.log("data", addData);
            let findOne = await this.customerService.findOne({
                phoneNumber: addData.phoneNumber,
            });
            console.log("customr", findOne);
            if (!findOne) {
                const userTypeId = 1;
                const shard = 511;
                const sequenceId = Math.floor(Math.random() * 1024);
                const code = generateId(userTypeId, Date.now(), shard, sequenceId);
                let customer = { code, ...addData }
                const res = await this.customerService.addCustomer(customer);
                return res
            } else {
                throw new DatabaseError(
                    "CUSTOMER_ALREADY_EXIST",
                    "CUSTOMER_ALREADY_EXIST",
                    ErrorCodes.USER_PHONE_NUMBER_ALREADY_EXISTS
                )
            }
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
            const res = await this.customerService.deleteCustomerById(id)
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
        @Body() updateData: UpdateCustomerDto
    ): Promise<any> {
        try {
            return await this.customerService.updateCustomerById(id, updateData as unknown as Record<string, unknown>)
        } catch (error) {
            this.throwErrorProcess(error)
        }
    }
}
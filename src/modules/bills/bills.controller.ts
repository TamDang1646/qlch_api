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
import { Bills } from "@src/entities/Bill.entity";
import { DatabaseError } from "@src/exceptions/errors/database.error";

import { BillItemsService } from "../bill-item/bill-item.service";
import { CustomerService } from "../customer/customer.service";
import { BillsService } from "./bills.service";
import { CreateBillDto } from "./dto/create-bill.dto";
import { UpdateBillDto } from "./dto/update-bill.dto";

@ApiBearerAuth()
@ApiTags('Bills')
@Controller("bills")
export class BillsController extends BaseController {
    constructor(
        private readonly billsService: BillsService,
        private readonly customerService: CustomerService,
        private readonly configService: ConfigService,
        private readonly billItemService: BillItemsService,
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
    async test(): Promise<Bills[]> {
        try {
            return await this.billsService.getAll()
        } catch (error) {
            this.throwErrorProcess(error)
        }
    }

    @Get("/:id")
    async getBillsById(
        @Param("id") id: number,
    ): Promise<any> {
        try {
            let token = new TokenDto
            token.userId = id
            const res = await this.billsService.getBillsId(id)
            if (!res) {
                throw new DatabaseError(
                    "BILL_NOT_EXIST",
                    "BILL_NOT_EXIST",
                    ErrorCodes.BILL_NOT_EXIST
                )
            }
            return res
            // return res.map((item) => ({ ...item, isSave: 1 }))
        } catch (error) {
            this.throwErrorProcess(error)
        }
    }


    @Post()
    async addBills(
        @Body() addData: CreateBillDto
    ): Promise<any> {
        console.log("postData", addData);
        try {
            let cusRes
            if (addData.customer) {
                const { customer } = addData
                let findOne = await this.customerService.findOne({ phoneNumber: customer.phoneNumber })
                console.log("customr", findOne);
                if (!findOne) {

                    cusRes = await this.customerService.addCustomer(customer)
                } else cusRes = findOne
            }
            if (!cusRes) {
                throw new DatabaseError(
                    "CUSTOMER_DATA_ERROR",
                    "CUSTOMER_DATA_ERROR",
                    ErrorCodes.DATABASE_ERROR
                )
            }
            let totalPrice = addData.items.reduce(function (total, item) {
                return total + parseFloat(item.price) * item.quantity
            }, 0)
            let paid = parseFloat(addData.deposit) >= totalPrice ? 1 : 0;

            const data = {
                customerId: cusRes.id,
                start: addData.start,
                end: addData.end,
                address: addData.address,
                deposit: addData.deposit,
                totalPrice: totalPrice.toString(),
                paid
            }
            console.log("data", data);

            let bill = await this.billsService.addBills(data)
            console.log("bill", bill);

            if (!bill) {
                throw new DatabaseError(
                    "INSERT_BILL_ERROR",
                    "INSERT_BILL_ERROR",
                    ErrorCodes.INSERT_ERROR
                )
            }
            let billItem
            if (addData.items) {
                billItem = await this.billItemService.addBillItems(addData.items)
                // addData.items.forEach(async item => {
                //     let it = await this.billItemService.addBillItems({
                //         billId: bill.id,
                //         itemId: item.id,
                //         size: item.size,
                //         quantity: item.quantity
                //     })
                //     console.log("billitem", it);

                //     if (it) {
                //         billItem.push(it)
                //     }
                // });
            }
            console.log("billItem", billItem);

            if (billItem.length <= 0) {
                await this.billItemService.deleteByBillId(bill.id)
                await this.billsService.deleteBillsById(bill.id)
                await this.customerService.deleteCustomerById(cusRes.id)
                throw new DatabaseError(
                    "INSERT_BILL_ERROR",
                    "INSERT_BILL_ERROR",
                    ErrorCodes.INSERT_ERROR
                )
            }
            return { bill, items: billItem }
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
            const res = await this.billsService.deleteBillsById(id)
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
        @Body() updateData: UpdateBillDto
    ): Promise<any> {
        try {
            return await this.billsService.updateBillsById(id, updateData as unknown as Record<string, unknown>)
        } catch (error) {
            this.throwErrorProcess(error)
        }
    }
}
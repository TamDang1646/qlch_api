import { DataSource, In } from "typeorm";

import { BaseController } from "@base/base.controller";
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import ComponentService from "@src/components/component";
import { MessageComponent } from "@src/components/message.component";
import { ErrorCodes } from "@src/constants/error-code.const";
import { Bills } from "@src/entities/Bill.entity";
import { Product } from "@src/entities/Product.entity";
import { DatabaseError } from "@src/exceptions/errors/database.error";
import { generateId } from "@src/utils/id-generator.util";

import { BillItemsService } from "../bill-item/bill-item.service";
import { CustomerService } from "../customer/customer.service";
import { ProductService } from "../product/product.service";
import { BillsService } from "./bills.service";
import { CreateBillDto } from "./dto/create-bill.dto";
import { GetBillDto } from "./dto/get-bill.dto";
import { UpdateBillDto } from "./dto/update-bill.dto";
import { BillItems } from "@src/entities/BillItem.entity";
import { Customer } from "@src/entities/Customer.entity";

@ApiBearerAuth()
@ApiTags("Bills")
@Controller("bills")
export class BillsController extends BaseController {
    constructor(
        private readonly billsService: BillsService,
        private readonly productService: ProductService,
        private readonly customerService: CustomerService,
        private readonly configService: ConfigService,
        private readonly component: ComponentService,
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
    @Get()
    async test(@Query() search: GetBillDto): Promise<Bills[]> {
        try {
            const bills = await this.billsService.getAll(search);
            for (const rs of bills) {
                // Get more company address data
                await this.component.setExtraData(rs);
            }
            return bills;
        } catch (error) {
            this.throwErrorProcess(error);
        }
    }
    /**
     *
     * @returns
     */
    @Get("/info")
    async getInfo(): Promise<any> {
        try {
            const totalDeposit = await this.billsService.getDeposit();
            console.log(totalDeposit);

            const totalProduct = await this.productService.count();
            const totalCustomer = await this.customerService.count();
            return {
                ...totalDeposit,
                totalCustomer,
                totalProduct,
            };
        } catch (error) {
            this.throwErrorProcess(error);
        }
    }

    @Get("/:id")
    async getBillsById(@Param("id") id: number): Promise<any> {
        try {
            console.log("id", id);

            const res = await this.billsService.getBillId(id);
            if (!res) {
                throw new DatabaseError(
                    "BILL_NOT_EXIST",
                    "BILL_NOT_EXIST",
                    ErrorCodes.BILL_NOT_EXIST,
                );
            }
            await this.component.setExtraData(res);
            return res;
            // return res.map((item) => ({ ...item, isSave: 1 }))
        } catch (error) {
            this.throwErrorProcess(error);
        }
    }

    @Post()
    async addBills(@Body() addData: CreateBillDto): Promise<any> {
        console.log("postData", addData);
        try {
            let cusRes;
            if (addData.customer) {
                const { customer } = addData;
                let findOne = await this.customerService.findOne({
                    phoneNumber: customer.phoneNumber,
                });
                console.log("customr", findOne);
                if (!findOne) {
                    const userTypeId = 1;
                    const shard = 511;
                    const sequenceId = Math.floor(Math.random() * 1024);
                    const code = generateId(
                        userTypeId,
                        Date.now(),
                        shard,
                        sequenceId,
                    );
                    (customer as any).code = code;
                    cusRes = await this.customerService.addCustomer(customer);
                } else cusRes = findOne;
            }
            if (!cusRes) {
                throw new DatabaseError(
                    "CUSTOMER_DATA_ERROR",
                    "CUSTOMER_DATA_ERROR",
                    ErrorCodes.DATABASE_ERROR,
                );
            }

            const data = {
                customerId: cusRes.id,
                start: new Date(parseInt(`${addData.start}`)),
                end: new Date(parseInt(`${addData.end}`)),
                address: addData.address,
                deposit: addData.deposit,
                totalPrice: "0",
                paid: 0,
            };

            let bill = await this.billsService.addBills(data as any);
            console.log("bill", bill);

            if (!bill) {
                throw new DatabaseError(
                    "INSERT_BILL_ERROR",
                    "INSERT_BILL_ERROR",
                    ErrorCodes.INSERT_ERROR,
                );
            }
            let billItem: BillItems[];
            if (addData.items) {
                billItem = await this.billItemService.addBillItems(
                    addData.items,
                    bill.id,
                );
                const billItemIds = billItem.map((item) => item.itemId);
                console.log("billItemIds", billItemIds);
                await Promise.all(
                    billItem.map((i) => {
                        return this.dataSource.getRepository(Product).update(
                            { id: i.itemId },
                            {
                                quantity: () => `quantity - ${i.quantity}`,
                            },
                        );
                    }),
                );
                const billItems = await this.dataSource
                    .getRepository(Product)
                    .find({ where: { id: In(billItemIds) } });

                console.log(billItems);

                let totalPrice = billItems.reduce(function (total, item) {
                    return (
                        total +
                        parseFloat(item.price) *
                            billItem.find((x) => x.itemId == item.id).quantity
                    );
                }, 0);
                let paid = parseFloat(addData.deposit) >= totalPrice ? 1 : 0;
                await this.dataSource
                    .getRepository(Bills)
                    .update(
                        { id: bill.id },
                        { totalPrice: totalPrice.toString(), paid: paid },
                    );
                bill = await this.dataSource
                    .getRepository(Bills)
                    .findOne({ where: { id: bill.id } });
            }

            console.log("billItem", billItem);

            if (billItem.length <= 0) {
                await this.billItemService.deleteByBillId(bill.id);
                await this.billsService.deleteBillsById(bill.id);
                await this.customerService.deleteCustomerById(cusRes.id);
                throw new DatabaseError(
                    "INSERT_BILL_ERROR",
                    "INSERT_BILL_ERROR",
                    ErrorCodes.INSERT_ERROR,
                );
            }
            return { bill, items: billItem };
        } catch (error) {
            this.throwErrorProcess(error);
        }
    }

    @Delete("/:id")
    async deleteSave(
        // @Query() param: SaveDto,
        @Param("id") id: number,
    ): Promise<any> {
        try {
            const res = await this.billsService.deleteBillsById(id);
            if (res) {
                return {
                    message: "Xoá thành công",
                };
            }
        } catch (error) {
            this.throwErrorProcess(error);
        }
    }

    @Patch("/:id")
    async updatePost(
        @Param("id") id: number,
        @Body() updateData: UpdateBillDto,
    ): Promise<any> {
        try {
            const bill = await this.billsService.updateBillsById(
                id,
                // updateData as unknown as Record<string, unknown>,
                new Bills({
                    start: new Date(parseInt(`${updateData.start}`)),
                    end: new Date(parseInt(`${updateData.end}`)),
                    address: updateData.address,
                    deposit: updateData.deposit,
                }),
            );
            if (updateData.customer?.id) {
                await this.dataSource
                    .getRepository(Customer)
                    .update(updateData.customer.id, { ...updateData.customer });
            }
            if (
                Array.isArray(updateData.deleteBillItemIds) &&
                updateData.deleteBillItemIds.length > 0
            ) {
                await this.dataSource
                    .getRepository(BillItems)
                    .delete({ id: In(updateData.deleteBillItemIds) });
            }

            const exits = updateData.items?.filter((i) => i.id != undefined);
            const exitsIds = exits?.map((i) => i.id);
            const oldBillItems = await this.dataSource
                .getRepository(BillItems)
                .findBy({ id: In(exitsIds) });
            await Promise.all(
                oldBillItems.map((i) => {
                    const item = updateData.items?.find((up) => up.id == i.id);
                    return this.dataSource.getRepository(Product).update(
                        { id: i.itemId },
                        {
                            quantity: () =>
                                `quantity - ${item.quantity - i.quantity}`,
                        },
                    );
                }),
            );
            await Promise.all(
                oldBillItems.map((i) => {
                    const item = updateData.items?.find((up) => up.id == i.id);
                    return this.dataSource.getRepository(BillItems).update(
                        { id: i.id },
                        {
                            ...item,
                        },
                    );
                }),
            );
            await Promise.all(
                updateData.items.map((i) => {
                    if (!i.id) {
                        return this.dataSource
                            .getRepository(BillItems)
                            .save({ ...i, billId: id });
                    }
                }),
            );

            const billItems = await this.dataSource
                .getRepository(BillItems)
                .findBy({ billId: id });
            const PrdbillItems = await this.dataSource
                .getRepository(Product)
                .find({ where: { id: In(billItems.map((i) => i.itemId)) } });

            let totalPrice = PrdbillItems.reduce(function (total, item) {
                return (
                    total +
                    parseFloat(item.price) *
                        billItems.find((x) => x.itemId == item.id).quantity
                );
            }, 0);
            let paid = parseFloat(updateData.deposit) >= totalPrice ? 1 : 0;
            await this.dataSource
                .getRepository(Bills)
                .update(
                    { id: bill.id },
                    { totalPrice: totalPrice.toString(), paid },
                );
            const newBill = await this.dataSource
                .getRepository(Bills)
                .findOneBy({ id: id });
            return { bill: newBill, items: billItems };
        } catch (error) {
            console.log(error.stack);

            this.throwErrorProcess(error);
        }
    }
}

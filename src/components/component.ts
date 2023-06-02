import { AuthServices } from "src/modules/auth/auth.service";

import { Injectable } from "@nestjs/common";
import { BillItemsService } from "@src/modules/bill-item/bill-item.service";
import { ProductService } from "@src/modules/product/product.service";

import { MessageComponent } from "./message.component";

@Injectable()
export default class ComponentService {

    constructor(
        private readonly authService: AuthServices,
        private readonly billItemService: BillItemsService,
        private readonly productService: ProductService,
        private i18n: MessageComponent,
    ) { }

    async checkPhoneExist(phoneNumber: string) {
        return this.authService.getAuthByPhone(phoneNumber)
    }

    async setExtraData(data) {

        const billItem = await this.billItemService.getBillItemById(data.id)
        const itemIds = billItem.map((it) => it.itemId)
        const itemDetail = await this.productService.getProductIds(itemIds)

        const its = itemIds.map((id) => {
            let bItem = billItem.find((it) => it.itemId == id);
            // console.log("id", id, bItem,);
            let iDetail = itemDetail.find((it) => it.id == id);
            // console.log("id", id, iDetail,);
            return {
                id: id,
                name: iDetail.name,
                quantity: bItem.quantity,
                price: iDetail.price
            }
        })
        // item.items = its
        data.items = its

    }

}
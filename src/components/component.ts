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
    ) {}

    async checkPhoneExist(phoneNumber: string) {
        return this.authService.getAuthByPhone(phoneNumber);
    }

    async setExtraData(data) {
        const billItem = await this.billItemService.getBillItemById(data.id);
        const itemIds = billItem.map((it) => it.itemId);
        const itemDetail = await this.productService.getProductIds(itemIds);

        const its = billItem.map((item) => {
            // console.log("id", id, bItem,);
            let iDetail = itemDetail.find((it) => it.id == item.itemId);
            // console.log("id", id, iDetail,);
            return {
                id: item.id,
                ...item,
                name: iDetail.name,
                price: iDetail.price,
                size: item.size,
            };
        });
        // item.items = its
        data.items = its;
    }
}

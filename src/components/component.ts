import { TokenDto } from "src/dtos/token.dto";
import { AuthServices } from "src/modules/auth/auth.service";

import { Injectable } from "@nestjs/common";

import { MessageComponent } from "./message.component";

@Injectable()
export default class ComponentService {

    constructor(
        private readonly authService: AuthServices,
        private i18n: MessageComponent,
    ) { }

    async checkPhoneExist(phoneNumber: string) {
        return this.authService.getAuthByPhone(phoneNumber)
    }

    async setExtraData(data, token: TokenDto) {

    }
}
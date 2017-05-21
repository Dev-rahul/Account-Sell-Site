import rp = require('request-promise');
import {Order} from "../models/Order";
import {ISiteConfig, SiteConfigs} from "../models/SiteConfig";

export class Telegram {

    private static data : ITelegramData;

    static async initialize() {
        const data = await SiteConfigs.findOne({key : 'telegramBotData'}).lean().exec() as ISiteConfig;
        if(data == null) {
            console.log("Failed to set telegram bot data.");
            return;
        }
        Telegram.data = data.value as ITelegramData;
    }

    static async log(message: string, room? : string) {
        if(this.data == null) {
            console.log("Unable to log, telegram bot data not set.");
            return;
        }
        await rp(`https://api.telegram.org/bot${Telegram.data.botToken}/sendMessage?chat_id=${room == null ? Telegram.data.logRoomNumber : room}&text=${message}`)
    }

    static async logPurchase(order : Order) {
        const parsed = `Total: $${order.total}, Accounts: ${order.totalAccounts}, Buyer Email: ${order.buyerEmail}, Name: ${order.buyer.firstName} ${order.buyer.lastName}`;
        return Telegram.log(parsed, Telegram.data.logOrderNumber);
    }

}

export interface ITelegramData {
    logRoomNumber : string;
    logOrderNumber : string;
    botToken : string;
}
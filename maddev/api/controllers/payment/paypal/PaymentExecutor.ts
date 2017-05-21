import {IAccount} from "../../../models/Account";
import {AccountController} from "../../account/AccountController";
import {IUnprocessedPaypal, UnprocessedPaypals} from "../../../models/UnprocessedPaypal";

export class PaymentExecutor {

    private paymentId: string;
    private payerId: string;

    constructor(paymentId: string, payerId: string) {
        this.paymentId = paymentId;
        this.payerId = payerId;
    }

    /**
     * Checks to see if we have enough stock to
     * fulfill their total quantity.
     *
     * This method should only be called when we are about to execute their
     * payment, as in they've already paid and redirected back to our site.
     * @returns {Promise<void>}
     */
    private async tryExecute(): Promise<IAccount[]> {
        const controller = new AccountController();
        const details = await this.getUnprocessedOrder();
        if (details == null) {
            return [];
        }
        const purchase = await controller.setPurchased(details.quantity);
        /**
         * If the amount of accounts we set purchased does not match the quantity
         * then we are out of stock, and we cannot fulfill their entire order.
         * set all the accounts as unpurchased and return false.
         */
        if (purchase.length < details.quantity) {
            await controller.setUnpurchased(purchase);
            return [];
        }
        /**
         * If we reach here, then that means we have enough accounts to fulfill the order.
         */
        return purchase;
    }


    async execute(): Promise<IAccount[]> {
        return await this.tryExecute();
    }

    private async getUnprocessedOrder(): Promise<IUnprocessedPaypal> {
        const order = await UnprocessedPaypals.findOne({paymentId: this.paymentId}).lean().exec();
        return order as IUnprocessedPaypal;
    }
}
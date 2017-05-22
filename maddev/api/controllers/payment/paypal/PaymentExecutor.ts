import {AccountController} from "../../account/AccountController";
import {IUnprocessedPaypal, UnprocessedPaypals} from "../../../models/UnprocessedPaypal";
import {PaypalSettings} from "./internal/PaypalSettings";
import {Paypal} from "./Paypal";
import rp = require('request-promise');
import {IApiError} from "../../../impl/IApiError";
import {ProcessedPaypalOrder} from "../../../models/ProcessedOrder";
import {Telegram} from "../../../util/Telegram";

export class PaymentExecutor {

    private paymentId: string;
    private payerId: string;
    private settings : PaypalSettings;

    constructor(paymentId: string, payerId: string, settings : PaypalSettings) {
        this.paymentId = paymentId;
        this.payerId = payerId;
        this.settings = settings;
    }

    /**
     * Checks to see if we have enough stock to
     * fulfill their total quantity.
     *
     * This method should only be called when we are about to execute their
     * payment, as in they've already paid and redirected back to our site.
     * @returns {Promise<void>}
     */
    private async tryExecute(): Promise<ProcessedPaypalOrder | IApiError> {
        const controller = new AccountController();
        const details = await this.getUnprocessedOrder();
        if (details == null) {
            return {error : 'Unable to lookup order. Failed to complete payment.'};
        }
        const purchase = await controller.setPurchased(details.quantity);
        /**
         * If the amount of accounts we set purchased does not match the quantity
         * then we are out of stock, and we cannot fulfill their entire order.
         * set all the accounts as unpurchased and return false.
         */
        if (purchase.length < details.quantity) {
            await controller.setUnpurchased(purchase);
            return {error : 'Out of stock, unable to process order. You have not been charged.', meta : 'outOfStock'};
        }
        /**
         * If we reach here, then that means we have enough accounts to fulfill the order.
         */
        /**
         * Try to complete the payment before returning the accounts,
         * if the payment fails to complete, un-purchase the accounts.
         */
        const complete = await this.completePayment();
        if(complete['error'] != null) {
            await controller.setUnpurchased(purchase);
            return complete as IApiError;
        }
        /**
         * If no errors, we can assume it completed successfully,
         * but the state may not be approved yet.
         * @type {IExecutedPaymentResult}
         */
        const processed = complete as IExecutedPaymentResult;
        /**
         * Check to see if its actually paid yet,
         * if not, we can't return the accounts.
         */
        if(processed.state !== 'approved') {
            console.log(`Recieved order but not approved yet. ${processed.id}`);
            Telegram.log(`Recieved order but not approved yet. ${processed.id}`);
            return {error : 'Your order has not approved yet, please stay on the page. You will be redirected when finished.'}
        }
        return {
            buyer : {
                status : processed.payer.status,
                email : processed.payer.payer_info.email,
                firstName : processed.payer.payer_info.first_name,
                lastName : processed.payer.payer_info.last_name,
                payerId : processed.payer.payer_info.payer_id,
            },
            accounts : purchase
        }
    }

    /**
     * Attempts to complete the Paypal payment and charge them.
     * @returns {Promise<boolean>} If it completes successfully or not.
     */
    private async completePayment() : Promise<IExecutedPaymentResult | IApiError> {
        const paypal = new Paypal(this.settings);
        const key = await paypal.getAccessToken();
        if(key == null) {
            return {error : 'Failed to get Paypal access token.'};
        }
        const request = {
            method : 'POST',
            url : `${this.settings.apiUrl}payments/payment/${this.paymentId}/execute`,
            headers : {
                'content-type' : 'application/json',
                'authorization' : `Bearer ${key}`,
            },
            json : {
                'payer_id' : this.payerId
            }
        };
        let res;
        try {
            res = await rp(request);
            console.log(res);
        } catch(err) {
            console.log(err);
            return {error : 'Failed to execute paypal payment.'};
        }
        return res;
    }

    async execute(): Promise<ProcessedPaypalOrder | IApiError> {
        return await this.tryExecute();
    }

    private async getUnprocessedOrder(): Promise<IUnprocessedPaypal> {
        const order = await UnprocessedPaypals.findOne({paymentId: this.paymentId}).lean().exec();
        return order as IUnprocessedPaypal;
    }
}

interface IExecutedPaymentResult {
    id : string,
    intent : string;
    state : string;
    cart : string;
    payer : {
        payment_method : string;
        status : string;
        payer_info : {
            email : string;
            first_name : string;
            last_name : string;
            payer_id : string;
        }
    }
}
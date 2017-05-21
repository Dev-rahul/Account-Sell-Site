import {Document, model, Schema} from "mongoose";
import {PaymentMethod} from "./Payment";
import {PaypalBuyer} from "./PaypalBuyer";

export class Order {

    public readonly total: number;
    public readonly buyerIP: string;
    public readonly buyerEmail: string;
    public readonly totalAccounts: number;
    public readonly paymentMethod: PaymentMethod;
    public readonly accountEmails : string[];
    public readonly buyer : PaypalBuyer;

    constructor(total: number, buyerIP: string, buyerEmail: string,
                paymentMethod: PaymentMethod,
                accountEmails : string[], buyer : PaypalBuyer) {

        this.total = total;
        this.buyerIP = buyerIP;
        this.buyerEmail = buyerEmail;
        this.totalAccounts = accountEmails.length;
        this.paymentMethod = paymentMethod;
        this.accountEmails = accountEmails;
        this.buyer = buyer;
    }
}

const schema = new Schema({
    total: {required: true, type: Number},
    buyerIP: {required: true, type: String},
    buyerEmail: {required: true, type: String},
    totalAccounts: {required: true, type: Number},
    paymentMethod: {required: true, type: Number},
    accountEmails : {require : true, type : [String]},
    buyer : {required : false, type : Schema.Types.Mixed}
});

export interface IOrder extends Order, Document {}

export const Orders = model<IOrder>("Orders", schema);


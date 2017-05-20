import {Document, model, Schema} from "mongoose";
import {PaymentMethod} from "./Payment";

export class Order
{
    public readonly total : number;
    public readonly buyerIP : string;
    public readonly buyerEmail : string;
    public readonly totalAccounts : number;
    public readonly paymentMethod : PaymentMethod;

    constructor(total: number, buyerIP: string, buyerEmail: string, totalAccounts: number, paymentMethod : PaymentMethod)
    {
        this.total = total;
        this.buyerIP = buyerIP;
        this.buyerEmail = buyerEmail;
        this.totalAccounts = totalAccounts;
        this.paymentMethod = paymentMethod;
    }
}

const schema = new Schema(
    {
        total : {required : true, type : Number},
        buyerIP : {required : true, type : String},
        buyerEmail : {required : true, type : String},
        totalAccounts : {required : true, type : Number},
        paymentMethod : {required : true, type : Number}
    });

export interface IAccount extends Account, Document {}

export const Accounts = model<IAccount>("Accounts", schema);
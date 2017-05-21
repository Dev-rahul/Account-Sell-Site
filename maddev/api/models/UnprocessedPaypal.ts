import {Document, model, Schema} from "mongoose";

export class UnprocessedPaypal {

    public readonly paymentId : string;
    public readonly total: number;
    public readonly quantity : number;
    public readonly meta : string;

    constructor(paymentId: string, total: number, quantity: number, meta? : string) {
        this.paymentId = paymentId;
        this.total = total;
        this.quantity = quantity;
        this.meta = meta;
    }
}

const schema = new Schema({
    paymentId: {required: true, type: String},
    total: {required: true, type: Number},
    quantity: {required: true, type: Number},
    meta: {required: false, type: String},
});

export interface IUnprocessedPaypal extends UnprocessedPaypal, Document {}

export const UnprocessedPaypals = model<IUnprocessedPaypal>("UnprocessedPaypal", schema);
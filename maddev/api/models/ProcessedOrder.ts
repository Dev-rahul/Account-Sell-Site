import {PaypalBuyer} from "./PaypalBuyer";
import {IAccount} from "./Account";

export class ProcessedPaypalOrder {

    public readonly buyer : PaypalBuyer;
    public readonly accounts : IAccount[];

    constructor(buyer: PaypalBuyer, accounts: IAccount[]) {
        this.buyer = buyer;
        this.accounts = accounts;
    }

}
import express = require('@types/express');
import {Accounts, IAccount} from "../../models/Account";

export class AccountController {

    async getTotalAccounts(): Promise<number> {
        return await Accounts.find({purchased: false}).count();
    }

    /**
     * Grabs a certain quantity of accounts and sets them as purchased, then returns them.
     * This method assures that each account is unique.
     */
    async setPurchased(count: number): Promise<IAccount[]> {
        const accounts = [];
        for (let i = 0; i < count; i++) {
            /**
             * Use findOneAndUpdate to lock the document while it is being updated,
             * so another query from another purchase etc, cannot read this document
             * and return the same accounts.
             */
            const res = Accounts.findOneAndUpdate({purchased: false}, {purchased: true});
            if(res != null) {
                accounts.push(res);
            }
        }
        return accounts;
    }

    async setUnpurchased(accounts : IAccount[]) : Promise<void> {
        for(let account of accounts) {
            account.purchased = false;
            const res = await account.update(account);
            if(res['nModified'] != 1) {
                console.log(`Failed to unpurchase an account... ${res}`)
            }
        }
    }
}

export class AccountControllerRoutes {
    private static readonly controller: AccountController = new AccountController();

    async getTotalAccounts(req: express.Request, res: express.Response) {
        const controller = AccountControllerRoutes.controller;
        return res.json({'count': await controller.getTotalAccounts()});
    }
}
import express = require('@types/express');
import {Accounts, IAccount} from "../../models/Account";
import {ISiteConfig, SiteConfigs} from "../../models/SiteConfig";
import {Telegram} from "../../util/Telegram";

export class AccountController {

    async getTotalAccounts(): Promise<number> {
        return await Accounts.find({purchased: false}).count();
    }

    async getPrice(): Promise<number> {
        const config = await SiteConfigs.findOne({key : 'accountPrice'}).lean().exec() as ISiteConfig;
        if(config == null) {
            await Telegram.log("Failed to get account price, not found in site configs.");
            return -1;
        }
        return config.value as number;
    }

    async getMaxAllowedToBuy() : Promise<number> {
        const config = await SiteConfigs.findOne({key : 'accountMaxAllowed'}).lean().exec() as ISiteConfig;
        if(config == null) {
            await Telegram.log("Failed to get account max allowed, not found in site configs.");
            return -1;
        }
        return config.value as number;
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
            const res = await Accounts.findOneAndUpdate(
                {purchased: false}, {purchased: true}, {new : true});

            if(res == null) {
                continue;
            }

            accounts.push(res);
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
        const price = await controller.getPrice();
        const total = await controller.getTotalAccounts();
        const max = await controller.getMaxAllowedToBuy();
        return res.json({'count': total, 'price' : price, 'max' : max});
    }
}
import express = require('@types/express');

export class AccountController
{


    constructor()
    {
    }

    getTotalAccounts() : number
    {
        return 200;
    }
}

export class AccountControllerRoutes
{
    private static readonly controller : AccountController = new AccountController();

    getTotalAccounts(req : express.Request, res : express.Response)
    {
        const controller = AccountControllerRoutes.controller;
        return res.json({'count': controller.getTotalAccounts()});
    }

}
import {ApiRouteManager, IRouteType} from "../ApiRouteManager";
import {AccountControllerRoutes} from "../../controllers/account/AccountController";
import {ApiRouteController, IRouteManager} from "../impl/IRouteManager";

export class ApiAccountRoutes extends ApiRouteController
{
    private controller : AccountControllerRoutes;

    constructor(prefix : string, manager: ApiRouteManager)
    {
        super(prefix, manager);
        this.controller = new AccountControllerRoutes();
    }

    initialize(): void
    {
        this
            .manager
            .addHandler(
                IRouteType.GET, this.route("total"),
                this.controller.getTotalAccounts)
    }

}
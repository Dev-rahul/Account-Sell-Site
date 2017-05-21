import {ApiRouteController} from "../impl/IRouteManager";
import {ApiRouteManager, IRouteType} from "../ApiRouteManager";
import {OrderControllerRoutes} from "../../controllers/account/OrderController";

export class ApiOrderRoutes extends ApiRouteController {

    private controller: OrderControllerRoutes;

    constructor(prefix: string, manager: ApiRouteManager) {
        super(prefix, manager);
        this.controller = new OrderControllerRoutes();
    }

    initialize(): void {
        this
            .manager
            .addHandler(
                IRouteType.POST, this.route("checkout"),
                this.controller.createOrder)
            .addHandler(
                IRouteType.POST, this.route("process"),
                this.controller.completeOrder)
    }

}
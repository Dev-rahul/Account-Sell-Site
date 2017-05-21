import {ApiRouteManager} from "../ApiRouteManager";

export interface IRouteManager {
    initialize(): void

}

export abstract class ApiRouteController {
    protected prefix: string;
    public route = (path: string) => `${this.prefix}/${path}`;
    protected manager: ApiRouteManager;

    constructor(prefix: string, manager: ApiRouteManager) {
        this.prefix = prefix;
        this.manager = manager;
    }

    abstract initialize();
}
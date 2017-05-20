import {ApiRouteManager} from "../ApiRouteManager";

export interface IRouteManager
{
    initialize() : void

}

export abstract class ApiRouteController
{
    protected prefix : string;
    protected manager : ApiRouteManager;

    constructor(prefix : string, manager: ApiRouteManager)
    {
        this.prefix = prefix;
        this.manager = manager;
    }

    public route = (path : string) => `${this.prefix}/${path}`;

    abstract initialize();
}
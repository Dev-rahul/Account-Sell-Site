import express = require('@types/express');
import {IRouteManager} from "./impl/IRouteManager";

export class ApiRouteManager implements IRouteManager
{
    private router : express.Application;
    private apiPrefix : string;
    private routes : ApiRoute[];

    constructor(apiPrefix : string, router: express.Application)
    {
        this.router = router;
        this.apiPrefix = apiPrefix;
        this.routes = [];
    }

    addHandler(type : IRouteType, path : string,
               controller : (req : express.Request, res : express.Response) => void) : ApiRouteManager
    {
        this.routes.push(new ApiRoute(type, path, controller));
        return this;
    }

    initialize(): void
    {
       this.routes.forEach(r =>
       {
           switch(r.type)
           {
               case IRouteType.GET:
                   return this.router.get(`${this.apiPrefix}${r.path}`, r.controller);
               case IRouteType.POST:
                   return this.router.post(`${this.apiPrefix}${r.path}`, r.controller);
               case IRouteType.PUT:
                   return this.router.put(`${this.apiPrefix}${r.path}`, r.controller);
               case IRouteType.DELETE:
                   return this.router.delete(`${this.apiPrefix}${r.path}`, r.controller);
           }
       });
       console.log("API Routes have been initialized");
    }
}

export class ApiRoute
{
    public readonly path : string;
    public readonly controller : (req : express.Request, res : express.Response) => void;
    public readonly type : IRouteType;

    constructor(type: IRouteType, path: string, controller: (req: express.Request, res: express.Response) => void)
    {
        this.path = path;
        this.controller = controller;
        this.type = type;
    }
}

export enum IRouteType
{
    GET, POST, PUT, DELETE
}

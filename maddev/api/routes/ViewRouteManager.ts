import {IRouteManager} from "./impl/IRouteManager";
import express = require('@types/express');

export class ViewRouteManager implements IRouteManager
{
    private router : express.Application;
    private views : IViewRoutes[];

    constructor(router: express.Application)
    {
        this.router = router;
        this.views = [];
    }

    addView(path : string, name : string) : ViewRouteManager
    {
        this.views.push({path : path, name : name});
        return this;
    }

    initialize(): void
    {
        console.log("View routes have been initialized.");
        const stack = this.router._router.stack;
        const paths = [];
        /**
         * Add all the current routes to the array
         * so we can check if the router is already
         * registered with the path, to prevent duplicates.
         */
        stack.forEach(s => {
            if(s == null) return;
            paths.push(s);
        });
        this.views.forEach(v => {
            const exists = paths.indexOf(v.path) != -1;
            if(exists) return;
            this.router.get(v.path, (req, res) => res.render(v.name));
        })
    }
}

class IViewRoutes
{
    path : string;
    name : string;
}

import path = require('path');
import {WebServer} from "./WebServer";
import {ViewRouteManager} from "./routes/ViewRouteManager";
import {ApiRouteManager, IRouteType} from "./routes/ApiRouteManager";
import express = require('@types/express');
import {ApiAccountRoutes} from "./routes/children/ApiAccountRoutes";

class App
{
    constructor()
    {
        const server = new WebServer(
        {
            port : 3000,
            staticPath : path.join(__dirname, '../', 'client', 'public'),
            viewPath : path.join(__dirname, '../', 'client', 'views')
        });
        server.listen();


        const apiManager = new ApiRouteManager("/api", server.app);
        const accountRoutes = new ApiAccountRoutes("/accounts", apiManager);

        accountRoutes.initialize();
        apiManager.initialize();


        new ViewRouteManager(server.app)
            .addView("/", "app")
            .initialize();
    }

}
new App();
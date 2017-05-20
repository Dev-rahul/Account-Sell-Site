
import path = require('path');
import {WebServer} from "./WebServer";

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
    }
}
new App();
import express = require('express');

export class WebServer {
    public readonly app: express.Application;
    private readonly settings: IWebServerSettings;

    constructor(settings: IWebServerSettings) {
        this.app = express();
        this.settings = settings;
        if (this.settings != null) {
            this.applySettings();
        }
    }

    listen() {
        let port = this.settings == null || this.settings.port == null ? 80 : this.settings.port;
        this.app.listen(port, () => {
            /**
             * If no settings or callback was passed, just print out the port its listening on.
             */
            if (this.settings == null || this.settings.listenCallback == null) {
                return console.log(`Listening on port ${port}`)
            }
            /**
             * Was passed, so execute the callback.
             */
            this.settings.listenCallback();
        })
    }

    applySettings() {
        /**
         * If we are rendering views, set the view path so express can find the files.
         */
        if (this.settings.viewPath != null) {
            this.app.engine('html', require('ejs').renderFile);
            this.app.set('view engine', 'html');
            this.app.set('views', this.settings.viewPath);
        }
        /**
         * If we are going to serve static files, such as js, css, etc, set the path here.
         */
        if (this.settings.staticPath != null) {
            this.app.use(express.static(this.settings.staticPath));
        }
    }
}

export interface IWebServerSettings {
    port: number;
    viewPath?: string;
    staticPath?: string;
    listenCallback?: Function
}
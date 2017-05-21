import {ApiType} from "../impl/PaypalApiType";
import {ISiteConfig, SiteConfig, SiteConfigs} from "../../../../models/SiteConfig";

export class PaypalSettings {

    public readonly type: ApiType;
    public readonly websiteUrl: string;
    public readonly apiUrl: string;

    private constructor(type: ApiType, websiteUrl: string, apiUrl: string) {
        this.type = type;
        this.websiteUrl = websiteUrl;
        this.apiUrl = apiUrl;
    }

    static async generate(type?: ApiType) {
        /**
         * If we do not pass in which api to use, try to guess by checking if we are in dev mode.
         */
        if(type == null) {
            const setting = await SiteConfigs.findOne({key : 'isDevMode'}).lean().exec() as ISiteConfig;
            if(setting != null) {
                const isDev : boolean = setting.value;
                type = isDev ? ApiType.SANDBOX : ApiType.LIVE;
            }
        }
        let websiteUrl = null;
        let apiUrl = null;
        if (type == ApiType.SANDBOX) {
            websiteUrl = await SiteConfig.get("siteUrlSandbox");
            apiUrl = 'https://api.sandbox.paypal.com/v1/';
        }
        else {
            websiteUrl = await SiteConfig.get("siteUrl");
            apiUrl = 'https://api.paypal.com/v1/';
        }
        if (websiteUrl == null) {
            throw new Error("Failed to get website url, please set siteUrl in site config.");
        }
        return new PaypalSettings(type, websiteUrl, apiUrl);
    }

}
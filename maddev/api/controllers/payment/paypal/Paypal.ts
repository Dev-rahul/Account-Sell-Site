import {ISiteConfig, SiteConfigs} from "../../../models/SiteConfig";
import rp = require('request-promise');
import {ApiType} from "./impl/PaypalApiType";
import {PaypalSettings} from "./internal/PaypalSettings";

export class Paypal
{
    private settings : PaypalSettings;

    constructor(settings : PaypalSettings)
    {
        this.settings = settings;
    }

    async createPayment(quantity: number)
    {
        /**
         * Lookup the account price that we currently have set
         * so we can generate the total based on the quantity.
         */
        const res = await SiteConfigs.findOne({key: 'accountPrice'}).lean().exec() as ISiteConfig;
        if (res == null)
        {
            throw new Error("Failed to create payment, Please set accountPrice in site configs.");
        }
        /**
         * We must verify the account price is a real number and not less than 0.
         * Otherwise the total will not work.
         */
        const price = res.value as number;
        if (typeof price !== 'number' || isNaN(price) || price < 0)
        {
            throw new Error("Invalid price set for accounts. Please check site configs.");
        }
        /**
         * The order data of the actual paypal order, sent to the Paypal API to create us an order.
         */
        const orderData =
        {
                intent: 'order',
                payer:
                {
                    "payment_method": "paypal"
                },
                transactions:
                [{
                    amount:
                    {
                        currency: 'USD',
                        total: (quantity * price).toFixed(2),
                    },
                    description: 'Runescape Accounts'
                }],
                redirect_urls:
                {
                    "return_url": `${this.settings.websiteUrl}/return`,
                    "cancel_url": `${this.settings.websiteUrl}/cancel`
                }
        };
        /**
         * Get the authorization token so we can pass it with the api call.
         */
        const key = await this.getAccessToken();
        if (key == null)
        {
            throw new Error("Failed to get access key to create order.");
        }
        /**
         * The request data, includes the authorization token, and the order
         * data as json.
         */
        const data =
            {
                method: 'POST',
                headers:
                {
                   authorization: `Bearer ${key}`,
                   'content-type': 'application/json',
                },
                url: this.settings.apiUrl + 'payments/payment',
                json: orderData
            };
        /**
         * Once we create the order, we need to verify there were no errors.
         * If there is an array of links, then we can assume the order was
         * created, so we need to return the checkout url, which
         * is the 2nd link in the array.
         */
        try
        {
            const res = await rp(data);
            if (res.links == null || res.links.length <= 2)
            {
                throw new Error(`Failed to create paypal order. ${res}`)
            }
            return res.links[1].href;
        }
        catch (err)
        {
            throw new Error(err);
        }
    }

    /**
     * Returns the access token to utilize the Paypal API.
     * @returns {Promise<any>}
     */
    async getAccessToken(): Promise<string>
    {
        const res = await SiteConfigs.findOne(
            {
                key: `paypalAuthHeader${this.settings.type == ApiType.SANDBOX ? 'Sandbox' : ''}`
            });
        if (res == null)
        {
            throw new Error("Please set Paypal auth header in site config.");
        }
        const header = res.value as string;
        const options =
            {
                method: 'POST',
                url: this.settings.apiUrl + 'oauth2/token',
                headers:
                {
                    authorization: `Basic ${header}`,
                },
                form:
                {
                    grant_type: 'client_credentials'
                }
            };
        try
        {
            const key = await rp(options);
            return JSON.parse(key).access_token;
        }
        catch (err)
        {
            console.log(err);
        }
        return null;
    }
}
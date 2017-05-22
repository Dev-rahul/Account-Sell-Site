import {IOrder} from "../../models/Order";
import {Telegram} from "../../util/Telegram";
import {AccountClient} from "../../models/Account";
import {ISiteConfig, SiteConfigs} from "../../models/SiteConfig";
const Mailgun = require('mailgun-js');

export class Emailer {

    public readonly order : IOrder;
    public readonly accounts : AccountClient[];

    constructor(order: IOrder, accounts : AccountClient[]) {
        this.order = order;
        this.accounts = accounts;
    }

    private async getConfig() : Promise<IEmailerConfig> {
        const email = await SiteConfigs.findOne({key : 'mailerConfig'}).lean().exec() as ISiteConfig;
        console.log(email);
        if(email == null) {
            console.log("Failed to get email config.");
            await Telegram.log("Failed to get email config.");
            return null;
        }
        return email.value as IEmailerConfig;
    }

    async sendEmail() {
        if(this.order.buyerEmail == null) {
            return;
        }
        const config = await this.getConfig();
        if(config == null) {
            return;
        }

        const mailgun = new Mailgun({apiKey: config.apiKey, domain: config.domain});
        let text = '<p>Thank you for your purchase from <strong>MadAccounts</strong>, your accounts are below in JSON format or TXT Format.</p>';
        text += '<p>Please note: the ":" is not apart of the account information.</p>'
        text += `<p>Total Accounts: <strong>${this.accounts.length}.</strong></p><br>`;
        text += `<p>${JSON.stringify(this.accounts)}</p>`;
        text += '<br>';
        this.accounts.forEach(a => {
            text += `<p>${a.username}:${a.email}:${a.password}</p>`
        });
        const postData = {
            from: `MadAccounts <${config.from}>`,
            to: this.order.buyerEmail,
            subject: `Your ${this.accounts.length} accounts are ready.`,
            html: text
        }
        const o = this.order;
        mailgun.messages().send(postData, function (err, body) {
            if (err) {
                Telegram.log(`Failed to send email...${err} ${o.buyerEmail} ${o._id}`);
                console.log("got an error: ", err);
            }
        });

    }

}

interface IEmailerConfig {
    apiKey : string;
    domain : string;
    from : string;

}
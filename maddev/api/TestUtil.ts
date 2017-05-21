import {Accounts} from "./models/Account";

export class TestUtil
{
    async resetAccounts() : Promise<boolean> {
        const accs = await Accounts.find({}).exec();
        for (let a of accs) {
            a.purchased = false;
            await a.update(a);
        }
        return;
    }

}
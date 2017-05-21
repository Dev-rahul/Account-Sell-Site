import {Document, model, Schema} from "mongoose";

export class SiteConfig
{
    public key : string;
    public value : any;

    constructor(key: string, value: any)
    {
        this.key = key;
        this.value = value;
    }

    static async get(key : string) : Promise<any>
    {
        const res = await SiteConfigs.findOne({key: key}).lean().exec() as ISiteConfig;
        if(res == null) return null;
        return res.value;
    }
}

const schema = new Schema(
    {
        key : {required : true, type : String},
        value : {required : true, type : Schema.Types.Mixed}
    });

export interface ISiteConfig extends SiteConfig, Document {}

export const SiteConfigs = model<ISiteConfig>("SiteConfigs", schema);
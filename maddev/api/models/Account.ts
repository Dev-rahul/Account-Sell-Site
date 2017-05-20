import {Document, model, Schema} from "mongoose";

export class Account
{
    public readonly username : string;
    public readonly email : string;
    public readonly password : string;
    public readonly purchased : boolean;
    public readonly buyerEmail : string;

    constructor(username: string, email: string, password: string)
    {
        this.username = username;
        this.email = email;
        this.password = password;
        this.purchased = false;
    }
}

const schema = new Schema(
{
    username : {required : true, type : String},
    email : {required : true, type : String},
    password : {required : true, type : String},
    purchased : {required : true, type : Boolean},
    buyerEmail : {required : false, type : String}
});

export interface IAccount extends Account, Document {}

export const Accounts = model<IAccount>("Accounts", schema);
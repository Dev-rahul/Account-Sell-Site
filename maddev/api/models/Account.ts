import {Document, model, Schema} from "mongoose";

export class Account
{
    public readonly username : string;
    public readonly email : string;
    public readonly password : string;

    constructor(username: string, email: string, password: string)
    {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}

const schema = new Schema(
{
    username : {required : true, type : String},
    email : {required : true, type : String},
    password : {required : true, type : String},
});

export interface IAccount extends Account, Document {};

export const Accounts = model<IAccount>("Accounts", schema);
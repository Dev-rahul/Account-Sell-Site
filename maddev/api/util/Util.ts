import express = require('@types/express');

export class Util
{
    static getIP(req : express.Request) {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        return ip == '::1' ? 'localhost' : ip;
    }

    static timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static isEmail(email : string) {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    }
}
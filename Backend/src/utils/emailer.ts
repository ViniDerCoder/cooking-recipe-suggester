import nodemailer from 'nodemailer';
import { config } from 'dotenv'

config();

if(!process.env['EMAILER_SERVICE'] || !process.env['EMAILER_USER_ADDRESS'] || !process.env['EMAILER_USER_PASSWORD']) throw new Error('Please provide the Emailer Service, User Address, and User Password in the .env file');

const transporter = nodemailer.createTransport({
    service: process.env.EMAILER_SERVICE, 
    auth: {
      user: process.env.EMAILER_USER_ADDRESS, 
      pass: process.env.EMAILER_USER_PASSWORD
    }
});

export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

export function sendMail(to: Array<string>, subject: string, text: string, html?: string) {
    return new Promise((resolve, reject) => {
        if(!to.some((email) => email.match(emailRegex))) return resolve("Invalid email");
        
        transporter.sendMail({ from: process.env["EMAILER_USER_ADDRESS"], to: to, subject: subject, text: text, html: html}, function(error, info){
            if (error) {
                console.log(error);
                return resolve("Failed to send email");
            } else {
                return resolve(undefined);
            }
        });
    });
}

export async function sendVerificationEmail(email: string, verificationCode: string) {}


transporter.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take our messages");
        sendMail(["4ygpvpgktb@privaterelay.appleid.com"], "Test", "Test").then(console.log).catch(console.log);
    }
});
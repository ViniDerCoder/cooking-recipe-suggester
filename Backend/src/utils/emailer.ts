import nodemailer from 'nodemailer';
import { config } from 'dotenv'
import nodeMailjet from 'node-mailjet'

config();

if (!process.env['MAILJET_API_KEY'] || !process.env['MAILJET_API_SECRET'] || !process.env["EMAILER_USER_ADDRESS"]) throw new Error('Please provide the Emailer API key and secret in the .env file');

const mailjet = new nodeMailjet({
    apiKey: process.env.MAILJET_API_KEY,
    apiSecret: process.env.MAILJET_API_SECRET
})


export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

export async function sendMail(to: Array<string>, subject: string, text: string, html?: string) {
    return new Promise(async (resolve, reject) => {
        if (!to.some((email) => email.match(emailRegex))) return resolve("Invalid email");

        try {
            const request = await mailjet.post('send', { version: 'v3.1' }).request({
                Messages: [
                    {
                        From: {
                            Email: process.env.EMAILER_USER_ADDRESS,
                            Name: 'Cooking Recipe Suggester'
                        },
                        To: to.map((email) => ({ Email: email })),
                        Subject: subject,
                        TextPart: text,
                        HTMLPart: html
                    }
                ]
            })
            resolve(request.body)
        } catch (e) {
            return reject(e)
        }
    })
}

export async function sendVerificationEmail(email: string, verificationCode: string) { }
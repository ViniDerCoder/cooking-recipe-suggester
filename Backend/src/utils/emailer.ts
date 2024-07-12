import { config } from 'dotenv'
import { Recipient, EmailParams, MailerSend, Sender } from 'mailersend';

config();

if (!process.env['MAILERSEND_API_KEY'] || !process.env["MAILERSEND_ADDRESS"]) throw new Error('Please provide the Emailer API key and address in the .env file');

const mailer = new MailerSend({
    apiKey: process.env['MAILERSEND_API_KEY']
});

export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

export async function sendMail(to: Array<string>, subject: string, text: string, html?: string) {
    return new Promise(async (resolve, reject) => {
        if (!to.some((email) => email.match(emailRegex))) return resolve("Invalid email");

        try {
            const recipients = to.map((email) => new Recipient(email));
            const emailParams = new EmailParams()
                .setFrom({ email: process.env["MAILERSEND_ADDRESS"] || "", name: "Cooking Recipe Suggester" })
                .setTo(recipients)
                .setSubject(subject)
                .setText(text)
            if(html) emailParams.setHtml(html)

            const request = await mailer.email.send(emailParams)

            resolve(request)
        } catch (e) {
            return reject(e)
        }
    })
}

export async function sendVerificationEmail(email: string, verificationCode: string) { }
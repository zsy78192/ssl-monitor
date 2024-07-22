// POP3 发送邮件库
var nodemailer = require('nodemailer');
// env
require('dotenv').config();

class Mail {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendMail(to, subject, html) {
        let info = await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject,
            html
        });
        console.log('Message sent: %s', info.messageId);
    }

    // 发送网站ssl过期邮件
    async sendWebsiteMail(website) {
        let info = await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.SMTP_USER,
            subject: `[Important Reminder] Website ${website.name} SSL Certificate is About to Expire`,
            html: `The SSL certificate for the website ${website.host} is about to expire. Please update it in time. The certificate expiration date is ${website.ssl}, and there are ${Math.floor((website.ssl - new Date()) / 1000 / 60 / 60 / 24)} days left until expiration.`
        });
        console.log('Message sent: %s', info.messageId);
    }
}

exports.Mail = Mail;

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
            subject: `[重要提示] 网站 ${website.name} ssl 证书即将过期`,
            html: `网站 ${website.host} ssl 证书即将过期, 请及时更新, 证书过期时间 ${website.ssl}，距离过期还有 ${Math.floor((website.ssl - new Date()) / 1000 / 60 / 60 / 24)} 天`
        });
        console.log('Message sent: %s', info.messageId);
    }
}

exports.Mail = Mail;

// test
// const mail = new Mail();
// mail.sendMail('413892424@qq.com',
//     'test',
//     '<a href="https://www.baidu.com">test</a>'
// );



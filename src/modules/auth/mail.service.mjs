import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

class MailService {
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

    /**
     * отправка ссылки на активацию email
     * @param {string} to 
     * @param {string} link 
     */
    async sendActivationMail(to, link) {
        let result = await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.PROJECT_DEBUG ? process.env.SMTP_USER : to,
            subject: `Активация аккаунта на ${process.env.API_URL}`,
            text: '',
            html:
                `
                    <div>
                        <h1>Для активации перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        });
    }
}

const classObject = new MailService();
export { MailService, classObject }
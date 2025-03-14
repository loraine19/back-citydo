import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ActionType } from './constant';
import { MailSubscriptions, Profile } from '@prisma/client';
import { Notification } from 'src/notifications/entities/notification.entity';

@Injectable()
export class MailerService {
    private transporter: nodemailer.Transporter;

    constructor() { this.transporter = this.createTransporter() }

    private createTransporter() {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === 'true',
            auth: { user: process.env.SMTP_USERNAME, pass: process.env.SMTP_PASSWORD },
        });
    }

    private async sendEmail(to: string, subject: string, html: any) {
        const mailOptions = {
            from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM}>`,
            to,
            bcc: [process.env.SMTP_BCC],
            subject,
            html,
            attachments: [
                {
                    filename: 'logo.png',
                    path: 'middleware/logo.png',
                    cid: 'collectif@images.com'
                }
            ],
        };
        const copyOptions = {
            ...mailOptions,
            to: process.env.SMTP_BBC, html: `Copy de mail envoyé à ${to}<br><br>${html}`,
            subject: `Copy: ${subject}`
        };
        try {
            await this.transporter.sendMail(mailOptions);
            await this.transporter.sendMail(copyOptions);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public async sendResetPasswordEmail(to: string, token: string) {
        const subject = 'Initialisation de votre mot de passe';
        const html = this.generateEmailHtml('Vous avez demande une initialisation de votre mot de passe veuillez cliquer sur le lien ci-dessous (le lien est valable pendant 1 heure):',
            `<a href="${process.env.FRONT_URL}/motdepasse_oublie/reset?email=${to}&token=${token}">Initialiser mon mot de passe</a>`);
        await this.sendEmail(to, subject, html);
    }


    public async sendVerificationEmail(to: string, token: string) {
        const subject = 'Activation de votre compte Collectif';
        const html = this.generateEmailHtml('Bienvenue sur Collectif, cliquez sur le lien ci-dessous pour activer votre compte :',
            `<a href="${process.env.FRONT_URL}/signin?email=${to}&token=${token}">Activer mon compte</a>`);
        await this.sendEmail(to, subject, html);
    }

    public async sendDeleteAccountEmail(to: string, token: string) {
        const subject = 'Suppression de votre compte Collectif';
        const html = this.generateEmailHtml('Bonjour, vous avez demande de supprimer votre compte. cliquez sur le lien ci-dessous pour supprimer votre compte, vous ne pouvez plus revenir en arriere :',
            `<a href="${process.env.FRONT_URL}/delete_account?email=${to}&token=${token}">Supprimer mon compte</a>`);
        await this.sendEmail(to, subject, html);
    }


    public async sendNotificationEmail(to: string[], Notification: Notification) {
        const subject = `Notification de Collectif : ${Notification.title}`;
        const html = this.generateEmailHtml(`${Notification.title} <br>,
            ${Notification.description ?? 'veuillez consulter l\'application pour plus de détails.'}`,
            Notification.link && `<a href="${process.env.FRONT_URL}/${Notification.link}">Voir ${Notification.type}</a>`);
        to.map(async (email) => {
            await this.sendEmail(email, subject, html)
        })
    }


    private generateEmailHtml(text: string, link: string) {
        return `
        <html>
        <head>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;700&display=swap');
                body {
                    font-family: 'Comfortaa', Arial, sans-serif;
                    line-height: 1.6;
                    color: #00000080;
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    border-radius: 0.8rem;
                    box-shadow: 0 10px 10px #000000;
                    background-color: #f9f9f9;
                    border: 1px solid #ccc;
                }
                .header {
                    margin-bottom: 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    gap: 50px;
                }
                .header img {
                    width: 50px;
                    height: 50px;
                    padding: 10px;
                }
                .content {
                    margin-bottom: 20px;
                }
                .content a {
                    display: inline-block;
                    padding: 5px 10px;
                    color: #fff !important;
                    background-color: #06B6D4;
                    border-radius: 25px;
                    text-decoration: none;
                    text-align: center;
                }
                .footer {
                    font-size: 12px;
                    color: #777;
                }
                    .footer a {
                    color: #9A3412;
                    }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Collectif</h1> <img src="cid:collectif@images.com" alt="Image">
                </div>
                <div class="content">
                    <p>Bonjour,</p>
                    <p>${text}</p>
                    ${link}
                </div>
                <div class="footer">
                    <p>&copy; 2025 Collect'if. Tous droits réservés.</p>
                    <a href="${process.env.FRONT_URL}/myprofile">Changer mes préférences de notification</a>
                </div>
            </div>
        </body>
        </html>`;
    }


    public level = (profile: Profile): number => {
        const level = profile && profile.mailSub || 0;
        console.log(profile)
        switch (level) {
            case MailSubscriptions.SUB_1:
                return 1;
            case MailSubscriptions.SUB_2:
                return 2;
            case MailSubscriptions.SUB_3:
                return 3;
            case MailSubscriptions.SUB_4:
                return 4;
            default:
                return 1;
        }

    }
}
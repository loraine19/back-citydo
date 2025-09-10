import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailSubscriptions, Profile } from '@prisma/client';
import { Notification } from 'src/notifications/entities/notification.entity';
import * as fs from 'fs';

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
                    cid: 'citydo@images.com'
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

    public async sendDevelopmentEmail(to: string, subject: string, html: string) {
        const devEmail = process.env.DEV_EMAIL;
        if (!devEmail) {
            console.error('DEV_EMAIL is not defined');
            return;
        }
        const subjectWithPrefix = `[DEV] ${subject}`;
        await this.sendEmail(devEmail, subjectWithPrefix, html);
    }

    public async sendResetPasswordEmail(to: string, token: string) {
        const subject = 'Initialisation de votre mot de passe';
        const html = this.generateEmailHtml('Vous avez demande une initialisation de votre mot de passe veuillez cliquer sur le lien ci-dessous (le lien est valable pendant 1 heure):',
            `<a style="text-decoration: none; color: #fff" href="${process.env.FRONT_URL}/motdepasse_oublie/reset?email=${to}&token=${token}">Initialiser mon mot de passe</a>`);
        await this.sendEmail(to, subject, html);
    }


    public async sendVerificationEmail(to: string, token: string) {
        const subject = 'Activation de votre compte City\'Do';
        const html = this.generateEmailHtml('Bienvenue sur City\'Do, cliquez sur le lien ci-dessous pour activer votre compte :',
            `<a style="text-decoration: none; color: #fff" id="activation-link" href="${process.env.FRONT_URL}/signin?email=${to}&token=${token}">Activer mon compte</a>`);
        await this.sendEmail(to, subject, html);
    }

    public async sendDeleteAccountEmail(to: string, token: string) {
        const subject = 'Suppression de votre compte City\'Do';
        const html = this.generateEmailHtml('Bonjour, vous avez demande de supprimer votre compte. cliquez sur le lien ci-dessous pour supprimer votre compte, vous ne pouvez plus revenir en arriere :',
            `<a style="text-decoration: none; color: #fff"  href="${process.env.FRONT_URL}/delete_account?email=${to}&token=${token}">Supprimer mon compte</a>`);
        await this.sendEmail(to, subject, html);
    }


    public async sendNotificationEmail(to: string[], Notification: Notification) {
        const subject = `Notification de City\'Zen : ${Notification.title}`;
        const html = this.generateEmailHtml(`${Notification.title} ,<br>
            ${Notification.description ?? 'veuillez consulter l\'application pour plus de détails.'}`,
            Notification.link && `<a style="text-decoration: none; color: #fff"  href="${process.env.FRONT_URL}/${Notification.link}">Ouvrir dans l'application</a>`);
        to.map(async (email) => {
            await this.sendEmail(email, subject, html)
        })
    }


    private generateEmailHtml(text: string, link: string) {
        const templatePath = process.env.NODE_ENV === 'prod' ? './middleware/email-template.html' : './middleware/email-template.html';
        let htmlContent = fs.readFileSync(templatePath, 'utf8');

        htmlContent = htmlContent.replace('{{TEXT}}', text);
        htmlContent = htmlContent.replace('{{LINK}}', link ?? '');
        htmlContent = htmlContent.replace('{{FRONT_URL}}', process.env.FRONT_URL);

        return htmlContent;
    }

    public level = (profile: Profile): number => {
        const level = profile && profile.mailSub || 0;
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
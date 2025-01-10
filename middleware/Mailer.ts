import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: process.env.SMTP_USERNAME, pass: process.env.SMTP_PASSWORD },

    });
};

const sendEmail = async (to: string, subject: string, html: any) => {
    const transporter = createTransporter();
    const mailOptions = {
        from: process.env.SMTP_FROM, to, subject, html, attachments: [
            {
                filename: 'logo.png',
                path: 'middleware/logo.png',
                cid: 'unique@example.com' // The same value as in the img src
            }
        ]
    };
    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const sendResetPasswordEmail = async (to: string, token: string) => {
    const subject = 'Initialisation de votre mot de passe';
    const html = generateVerificationEmailHtml('Vous avez demande une initialisation de votre mot de passe :',
        `<a href=" ${process.env.STORAGE}/motdepasse_oublie/reset?email=${to}&token=${token}">Initialiser mon mot de passe</a>`);
    await sendEmail(to, subject, html);
};

export const sendVerificationEmail = async (to: string, token: string) => {
    const subject = 'Activation de votre compte Collectif';
    const html = generateVerificationEmailHtml('Bienvenue sur Collectif, cliquez sur le lien ci-dessous pour activer votre compte :',
        `<a href="${process.env.FRONT_URL}/signin?email=${to}&token=${token}">Activer mon compte</a>`);
    await sendEmail(to, subject, html);
};

const generateVerificationEmailHtml = (text: string, link: string) => {


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
            a {
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
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Collectif</h1> <img src="cid:unique@example.com" alt="Image">
            </div>
            <div class="content">
                <p>Bonjour,</p>
                <p>${text}</p>
                ${link}
            </div>
            <div class="footer">
                <p>&copy; 2025 Imagindev. Tous droits réservés.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};
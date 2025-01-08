import * as nodemailer from 'nodemailer';

export async function sendResetPasswordEmail(to: string, token: string) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject: 'Initialisation de votre mot de passe',
        text: `Bonjour, \n
      Vous avez demande une initialisation de votre mot de passe : \n
      https://imagindev-app.fr/motdepasse_oublie/reset?token=${token} \n
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
    }
}
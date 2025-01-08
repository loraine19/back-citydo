import * as nodemailer from 'nodemailer';
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    });
};

const sendEmail = async (to: string, subject: string, text: string) => {
    const transporter = createTransporter();
    const mailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject,
        text,
    };
    try {
        await transporter.sendMail(mailOptions)
        return true
    }
    catch (error) {
        console.log(error)
        return false
    }
};

export const sendResetPasswordEmail = async (to: string, token: string) => {
    const subject = 'Initialisation de votre mot de passe';
    const text = `Bonjour, \n
      Vous avez demande une initialisation de votre mot de passe : \n
      https://imagindev-app.fr/motdepasse_oublie/reset?email=${to}&token=${token} \n
    `;
    await sendEmail(to, subject, text);
};

export const sendVerificationEmail = async (to: string, token: string) => {
    console.log(to, token)
    const subject = 'Activation de votre compte Collectif';
    const text = `Bonjour, \n
     Pouvez-vous activer votre compte en cliquant sur le lien suivant : \n
      https://imagindev-app.fr/signin?email=${to}&token=${token} \n
    `;
    await sendEmail(to, subject, text);
};

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
    async sendMail(to: string, subject: string, text: string) { }

}

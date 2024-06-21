import {  Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as nodemailer from 'nodemailer'
import { from } from 'rxjs';


@Injectable()
export class MailService {

    constructor(private readonly mailerService: MailerService) {}

    public mailSendActivateLink( userMail, activationLink): void {

        this.mailerService.sendMail({
            to: userMail,
            from: process.env.SMTP_USER,
            subject: 'Активация аккаунта на' + process.env.API_URL, // Subject line
            text: '', // plaintext body
            html: `
                <div>
                    <h1>Для активации перейдите по ссылке</h1>
                    <a href="${activationLink}">${process.env.API_URL}/auth/activate/${activationLink}</a>
                </div>
        `
        })  
      }
}

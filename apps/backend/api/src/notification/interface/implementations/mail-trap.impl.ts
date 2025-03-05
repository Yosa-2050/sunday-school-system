import { Injectable } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { IEmailService } from '../email-service.interface';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailTrapImpl implements IEmailService {
    private transport;

    constructor() {
        this.transport = nodemailer.createTransport({
            host: 'live.smtp.mailtrap.io',
            port: 587,
            auth: {
                user: 'api',
                pass: 'bf2996302293f4553177b25c6fb0855a',
            },
        });
    }

    async sendEmail(
        from: string,
        to: string,
        subject: string,
        content: string,
    ) {
        const result = await this.transport.sendMail({
            from: from,
            to: to,
            subject: subject,
            text: content,
        });
    }
}

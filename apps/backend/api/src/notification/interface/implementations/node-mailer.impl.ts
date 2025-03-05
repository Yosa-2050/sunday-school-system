import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
// biome-ignore lint/style/useImportType: <explanation>
import { IEmailService } from '../email-service.interface';

@Injectable()
export class NodeMailImpl implements IEmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', // Example: 'smtp.gmail.com'
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'eyoelfikadu801@gmail.com', // your email
                pass: 'vyimcizhmzfinueh', // your email password or application-specific password
            },
        });
    }
    async sendEmail(
        from: string,
        to: string,
        subject: string,
        content: string,
    ) {
        const result = await this.transporter.sendMail({
            from: from,
            to: to,
            subject: subject,
            text: content,
        });
    }
}

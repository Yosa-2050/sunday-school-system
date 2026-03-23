import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
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
    sendBulkEmail(
        from: string,
        bulk: { to: string; subject: string; content: string }[],
    ) {
        throw new Error('Method not implemented.');
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

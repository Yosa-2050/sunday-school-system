import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { IEmailService } from '../email-service.interface';

@Injectable()
export class ResendImpl implements IEmailService {
    private resend: Resend;

    constructor() {
        this.resend = new Resend('re_7WLTtY6Q_DXktYkyLzgoHT3KT8bP9naD8');
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
        const resp = await this.resend.emails.send({
            from: 'Noreply@heranitech.com',
            to,
            subject,
            html: content,
        });
        if (resp?.data?.id) {
            return true;
        }
        return false;
    }
}

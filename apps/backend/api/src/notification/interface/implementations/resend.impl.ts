import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
// biome-ignore lint/style/useImportType: <explanation>
import { IEmailService } from '../email-service.interface';

@Injectable()
export class ResendImpl implements IEmailService {
    private resend: Resend;

    constructor() {
        this.resend = new Resend('re_7WLTtY6Q_DXktYkyLzgoHT3KT8bP9naD8');
    }

    async sendEmail(
        from: string,
        to: string,
        subject: string,
        content: string,
    ) {
        const resp = await this.resend.emails.send({
            from: 'noreplay@heranitech.com',
            to,
            subject,
            html: content,
        });
        if (resp?.data.id) {
            return true;
        }
        return false;
    }
}

export const IEmailServiceInterface = Symbol('IEmailService');

export interface IEmailService {
    sendEmail(from: string, to: string, subject: string, content: string);
    sendBulkEmail(
        from: string,
        bulk: { to: string; subject: string; content: string }[],
    );
}

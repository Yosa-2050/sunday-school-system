export const ISmsServiceInterface = Symbol('ISmsService');

export interface ISmsService {
    sendSms(to: string, content: string);
    sendBulkSms(bulk: { to: string; content: string }[]);
}

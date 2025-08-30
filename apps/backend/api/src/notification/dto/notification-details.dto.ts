export class NotificationDetailsDto {
    templateName: string;
    referenceId: string;
    toEmailAddress?: string[];
    toPhoneNumber?: string[];
    metaData?: Record<string, string>;
}

import { NotificationChannel } from '../enums/notification-channel.enum';
import { getForgotPwdEmailTemplate } from './templates/forgotPwdEmailTemplate';
import { getJobApplicationEmailTemplate } from './templates/jobApplicationEmailTemplate';
import { getSignupEmailTemplate } from './templates/signupEmailTemplate';

export const NotificationTemplatesSeedData = [
    {
        channelType: NotificationChannel.Email,
        templateName: 'signupEmailTemplate',
        subject: 'Welcome to Shega Jobs! Your Account is Created',
        content: getCleanedHtmlString(getSignupEmailTemplate()),
    },
    {
        channelType: NotificationChannel.Email,
        templateName: 'forgotPwdEmailTemplate',
        subject: 'Password Reset Request',
        content: getCleanedHtmlString(getForgotPwdEmailTemplate()),
    },
    {
        channelType: NotificationChannel.Email,
        templateName: 'jobApplicationEmailTemplate',
        subject:
            'Confirmation of Your Job Application for {{jobTitle}} at {{companyName}}',
        content: getCleanedHtmlString(getJobApplicationEmailTemplate()),
    },
];

function getCleanedHtmlString(htmlStringWithNewlines: string) {
    const cleanedHtmlString = htmlStringWithNewlines.replace(/\n/g, '');
    return cleanedHtmlString;
}

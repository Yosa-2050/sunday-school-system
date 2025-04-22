import { NotificationChannel } from '../enums/notification-channel.enum';
import { getForgotPwdEmailTemplate } from './templates/forgotPwdEmailTemplate';
import { getJobApplicationEmailTemplate } from './templates/jobApplicationEmailTemplate';
import { getJobPostApprovedEmailTemplate } from './templates/jobPostApprovedEmailTemplate';
import { getJobPostDeclinedEmailTemplate } from './templates/jobPostDeclinedEmailTemplate';
import { getOrgRegistrationApprovedEmailTemplate } from './templates/orgRegistrationApprovedEmailTemplate';
import { getOrgRegistrationDeclinedEmailTemplate } from './templates/orgRegistrationDeclinedEmailTemplate';
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
    {
        channelType: NotificationChannel.Email,
        templateName: 'jobPostApprovedEmailTemplate',
        subject: 'Job Posting Approved - {{jobTitle}}',
        content: getCleanedHtmlString(getJobPostApprovedEmailTemplate()),
    },
    {
        channelType: NotificationChannel.Email,
        templateName: 'jobPostDeclinedEmailTemplate',
        subject: 'Job Posting Declined - {{jobTitle}}',
        content: getCleanedHtmlString(getJobPostDeclinedEmailTemplate()),
    },
    {
        channelType: NotificationChannel.Email,
        templateName: 'orgRegistrationApprovedEmailTemplate',
        subject: 'Organization Registration Approved - {{Organization Name}}',
        content: getCleanedHtmlString(
            getOrgRegistrationApprovedEmailTemplate(),
        ),
    },
    {
        channelType: NotificationChannel.Email,
        templateName: 'orgRegistrationDeclinedEmailTemplate',
        subject: 'Organization Registration Declined - {{Organization Name}}',
        content: getCleanedHtmlString(
            getOrgRegistrationDeclinedEmailTemplate(),
        ),
    },
];

function getCleanedHtmlString(htmlStringWithNewlines: string) {
    const cleanedHtmlString = htmlStringWithNewlines.replace(/\n/g, '');
    return cleanedHtmlString;
}

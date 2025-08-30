import { NotificationChannel } from '../enums/notification-channel.enum';
import { getForgotPwdEmailTemplate } from './templates/forgotPwdEmailTemplate';
import { getJobApplicationEmailTemplate } from './templates/jobApplicationEmailTemplate';
import { getJobPostApprovedEmailTemplate } from './templates/jobPostApprovedEmailTemplate';
import { getJobPostDeclinedEmailTemplate } from './templates/jobPostDeclinedEmailTemplate';
import { getMentorshipPostApprovedEmailTemplate } from './templates/mentorshipPostApprovedEmailTemplate';
import { getMentorshipPostDeclinedEmailTemplate } from './templates/mentorshipPostDeclinedEmailTemplate';
import { getOrgActivateEmailTemplate } from './templates/orgActivateEmailTemplate';
import { getOrgDeactivateEmailTemplate } from './templates/orgDeactivateEmailTemplate';
import { getOrgRegistrationApprovedEmailTemplate } from './templates/orgRegistrationApprovedEmailTemplate';
import { getOrgRegistrationDeclinedEmailTemplate } from './templates/orgRegistrationDeclinedEmailTemplate';
import { getOrgReturnForAdjustmentEmailTemplate } from './templates/orgReturnForAdjustmentEmailTemplate';
import { getSignupEmailTemplate } from './templates/signupEmailTemplate';
import { getUserActivateEmailTemplate } from './templates/userActivateEmailTemplate';
import { getUserDeactivateEmailTemplate } from './templates/userDeactivateEmailTemplate';

export const NotificationTemplatesSeedData = [
    {
        channelType: NotificationChannel.Email,
        templateName: 'signupEmailTemplate',
        subject: 'Welcome to Finote Tiguhan! Your Account is Created',
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
        subject: 'Organization Registration Approved - {{organizationName}}',
        content: getCleanedHtmlString(
            getOrgRegistrationApprovedEmailTemplate(),
        ),
    },
    {
        channelType: NotificationChannel.Email,
        templateName: 'orgRegistrationDeclinedEmailTemplate',
        subject: 'Organization Registration Declined - {{organizationName}}',
        content: getCleanedHtmlString(
            getOrgRegistrationDeclinedEmailTemplate(),
        ),
    },

    {
        channelType: NotificationChannel.Email,
        templateName: 'userActivateEmailTemplate',
        subject: 'Account Activation - {{fullName}}',
        content: getCleanedHtmlString(getUserActivateEmailTemplate()),
    },
    {
        channelType: NotificationChannel.Email,
        templateName: 'userDeactivateEmailTemplate',
        subject: 'Account Deactivation - {{fullName}}',
        content: getCleanedHtmlString(getUserDeactivateEmailTemplate()),
    },

    {
        channelType: NotificationChannel.Email,
        templateName: 'orgActivateEmailTemplate',
        subject: ' Account Activation - {{organizationName}}',
        content: getCleanedHtmlString(getOrgActivateEmailTemplate()),
    },
    {
        channelType: NotificationChannel.Email,
        templateName: 'orgDeactivateEmailTemplate',
        subject: ' Account Deactivation - {{organizationName}}',
        content: getCleanedHtmlString(getOrgDeactivateEmailTemplate()),
    },
    {
        channelType: NotificationChannel.Email,
        templateName: 'mentorshipPostApprovedEmailTemplate',
        subject: 'Mentorship Program Posting Approved - {{mentorshipTitle}}',
        content: getCleanedHtmlString(getMentorshipPostApprovedEmailTemplate()),
    },
    {
        channelType: NotificationChannel.Email,
        templateName: 'mentorshipPostDeclinedEmailTemplate',
        subject: 'Mentorship Program Posting Declined - {{mentorshipTitle}}',
        content: getCleanedHtmlString(getMentorshipPostDeclinedEmailTemplate()),
    },
    {
        channelType: NotificationChannel.Email,
        templateName: 'orgReturnForAdjustmentEmailTemplate',
        subject:
            'Action Required: Updates Needed for Your Organization Details on Shega Jobs',
        content: getCleanedHtmlString(getOrgReturnForAdjustmentEmailTemplate()),
    },
];

function getCleanedHtmlString(htmlStringWithNewlines: string) {
    const cleanedHtmlString = htmlStringWithNewlines.replace(/\n/g, '');
    return cleanedHtmlString;
}

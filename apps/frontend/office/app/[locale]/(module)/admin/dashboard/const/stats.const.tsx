import {
    IconBriefcase,
    IconHierarchy,
    IconShieldCheck,
    IconUser,
    IconUserSearch,
    IconUserSquare,
    IconUsersGroup,
} from '@tabler/icons-react';

const stats = {
    totalRegisteredUsers: {
        title: 'Total Registered Users',
        icon: <IconUsersGroup size={20} />,
    },
    totalRegisteredMentors: {
        title: 'Total Registered Mentors',
        icon: <IconUserSquare size={20} />,
    },
    totalRegisteredEmployer: {
        title: 'Total Registered Employers',
        icon: <IconUser size={20} />,
    },
    totalRegisteredJobSeekers: {
        title: 'Total Registered Job Seekers',
        icon: <IconUserSearch size={20} />,
    },
    totalRegisteredAdmin: {
        title: 'Total Registered Admins',
        icon: <IconShieldCheck size={20} />,
    },
    totalPostedJobs: {
        title: 'Total Posted Jobs',
        icon: <IconBriefcase size={20} />,
    },
    totalMentorshipProgram: {
        title: 'Total Mentorship Program',
        icon: <IconHierarchy size={20} />,
    },
} as const;

type StatKeys = keyof typeof stats;

export { stats, type StatKeys };

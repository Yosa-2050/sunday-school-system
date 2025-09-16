import { IconMail, IconPhone, IconWorld } from '@tabler/icons-react';

const getContactIcon = (contactType: string) => {
    switch (contactType) {
        case 'Phone':
            return <IconPhone size={16} />;
        case 'Email':
            return <IconMail size={16} />;
        default:
            return <IconWorld size={16} />;
    }
};

export { getContactIcon };

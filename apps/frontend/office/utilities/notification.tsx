import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';

export const showError = (message: string) => {
    notifications.show({
        title: 'Failed',
        message:
            message ??
            'Unable to perform an action please contact your Administrator',
        color: 'red',
        icon: <IconX size={16} />,
    });
};

export const showSuccess = (message: string) => {
    notifications.show({
        title: 'Success',
        message,
        color: 'green',
        icon: <IconCheck size="1.1rem" />,
    });
};

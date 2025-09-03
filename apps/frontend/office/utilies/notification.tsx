import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';

export const showError = (message: string) => {
    notifications.show({
        title: 'Success',
        message: 'Category updated successfully',
        color: 'green',
        icon: <IconCheck size={16} />,
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

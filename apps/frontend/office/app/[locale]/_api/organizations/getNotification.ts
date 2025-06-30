import { fetcher } from '@shega/shared';

export interface NotificationResponse {
    id: string;
    status: string;
    content: string;
    createdAt: string;
    deliveryStatus: string;
}

export const getNotificationById = async (id: string) => {
    const response = await fetcher(
        `/notification/getUserInAppNotifications/${id}`,
        {
            method: 'GET',
        },
    );
    return response as NotificationResponse[];
};

export const updateNotificationById = async (id: string) => {
    const response = await fetcher(
        `/notification/markNotificationAsRead/${id}`,
        {
            method: 'PATCH',
        },
    );

    return response as { name: string };
};

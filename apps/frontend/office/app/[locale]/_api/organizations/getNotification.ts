import { fetcher } from '@shega/shared';

export interface NotificationResponse {
    id: string;
    status: string;
    content: string;
    createdAt: string;
    deliveryStatus: string;
}

export const getNotificationById = async (q: string) => {
    const response = await fetcher('/notification/getAllInAppNotifications', {
        method: 'POST',
        body: JSON.stringify({ q }),
    });
    return response as {
        data: NotificationResponse[];
        total: number;
        totalPages: number;
    };
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

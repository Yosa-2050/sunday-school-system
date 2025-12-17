import { fetcher } from '@shega/shared';
import type { NotificationResponse } from './type';

export const sendNotificationApi = async (
    text: string,
): Promise<NotificationResponse> => {
    const response: NotificationResponse = await fetcher(
        '/student/sendNotification',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        },
    );

    return response;
};

export const sendNotificationForClassApi = async (
    text: string,
    classId: string,
): Promise<NotificationResponse> => {
    const response: NotificationResponse = await fetcher(
        `/student/sendNotification/${classId}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        },
    );

    return response;
};

export const SendNotificationForSelectedStudentApi = async (
    text: string,
    students: string[],
): Promise<NotificationResponse> => {
    const response: NotificationResponse = await fetcher(
        '/student/sendNotificationForStudent',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, list: students }),
        },
    );

    return response;
};

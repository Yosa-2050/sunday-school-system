import { notifications } from '@mantine/notifications';
import { QueryClient, useMutation } from '@tanstack/react-query';
import {
    approveOrganization,
    declineOrganization,
} from 'app/[locale]/_api/organizations/approve-organization';
import router from 'next/router';

const useOrganizationDetail = ({ id }: { id: string }) => {
    const queryClient = new QueryClient();
    const {
        mutate: approveOrganizationMutation,
        isPending: isApprovingOrganization,
    } = useMutation({
        // mutationFn: async () => await approveJob(jobId),
        mutationFn: async () => {
            if (id) {
                throw new Error('Program ID is not available.');
            }
            return await approveOrganization(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['organization', id],
            });
            router.push('/admin/jobs');
            notifications.show({
                title: 'Organization Approved',
                message: 'The organization has been successfully approved',
                color: 'green',
            });
        },
        onError: (error) => {
            notifications.show({
                title: 'Error Approving Job',
                message: error.message,
                color: 'red',
            });
        },
    });

    const {
        mutate: declineOrganizationMutation,
        isPending: isDecliningOrganization,
    } = useMutation({
        // mutationFn: async () => await approveJob(jobId),
        mutationFn: async (note: string) => {
            if (id) {
                throw new Error('Program ID is not available.');
            }
            return await declineOrganization(id, note);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['organization', id],
            });
            router.push('/admin/jobs');
            notifications.show({
                title: 'Organization Declined',
                message: 'The organization has been successfully declined',
                color: 'green',
            });
        },
        onError: (error) => {
            notifications.show({
                title: 'Error Declining Job',
                message: error.message,
                color: 'red',
            });
        },
    });
    return {
        approveOrganizationMutation,
        isApprovingOrganization,
        declineOrganizationMutation,
        isDecliningOrganization,
    };
};

export { useOrganizationDetail };

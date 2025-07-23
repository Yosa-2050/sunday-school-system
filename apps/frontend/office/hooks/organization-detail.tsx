import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    approveOrganization,
    declineOrganization,
} from 'app/[locale]/_api/organizations/approve-organization';

const useOrganizationDetail = ({ id }: { id: string }) => {
    const queryClient = useQueryClient();
    const {
        mutate: approveOrganizationMutation,
        isPending: isApprovingOrganization,
    } = useMutation({
        mutationFn: async () => {
            return await approveOrganization(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['organization', id],
            });
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
        mutationFn: async (note: string) => {
            return await declineOrganization(id, note);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['organization', id],
            });
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

import { notifications } from '@mantine/notifications';
import { fetcher } from '@shega/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const activateMentors = async (id: string) => {
    return await fetcher(`/mentorship/activate/${id}/true`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
    });
};

const deactivateMentors = async (id: string, reason: string) => {
    return await fetcher(`/mentorship/deactivate/${id}/true`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: reason }),
    });
};


const approveMentors = async (id: string) => {
    return await fetcher(`/mentorship/approve/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
    });
}

const declineMentors = async (id: string,note: string) => {
    return await fetcher(`/mentorship/decline/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({note}),
    })
}


const useActivateMentors = ({id}: {id: string}) => {
    const queryClient = useQueryClient();
    const activateMentorsMutation = useMutation({
        mutationFn: async () => {
            return await activateMentors(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mentors'] });
            notifications.show({
                title: 'Success',
                message: 'Mentor has been successfully activated',
                color: 'green',
            })
        },
        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'An error occurred while activating the mentor',
                color: 'red',
            })
        }
    })
    return activateMentorsMutation;
}

const useDeactivateMutation = ({id, reason}: {id: string,reason:string}) => {
    const queryClient = useQueryClient();
    const deactivateMentorsMutation = useMutation({
        mutationFn: async () => {
            return await deactivateMentors(id, reason);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mentors'] });
            notifications.show({
                title: 'Success',
                message: 'Mentor has been successfully deactivated',
                color: 'green',
            })
        },
        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'An error occurred while deactivating the mentor',
                color: 'red',
            })
        }
    })
    return deactivateMentorsMutation;
}


const useApproveMentors = ({id}: {id: string}) => {
    const queryClient = useQueryClient();
    const approveMentorsMutation = useMutation({
        mutationFn: async () => {
            return await approveMentors(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mentors'] });
            notifications.show({
                title: 'Success',
                message: 'Mentor has been successfully approved',
                color: 'green',
            })
        },
        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'An error occurred while approving the mentor',
                color: 'red',
            })
        }
    })
    return approveMentorsMutation;
}


const useDeclineMentors = ({id,note}: {id: string; note: string}) => {
    const queryClient = useQueryClient();
    const declineMentorsMutation = useMutation({
        mutationFn: async () => {
            return await declineMentors(id,note);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mentors'] });
            notifications.show({
                title: 'Success',
                message: 'Mentor has been successfully declined',
                color: 'green',
            })
        },
        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'An error occurred while declining the mentor',
                color: 'red',
            })
        }
    })
    return declineMentorsMutation;
}


export {
    useActivateMentors,
    useDeactivateMutation,
    useApproveMentors,
    useDeclineMentors
}
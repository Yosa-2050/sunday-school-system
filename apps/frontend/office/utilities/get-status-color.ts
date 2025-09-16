const getStatusColor = (status: string) => {
    switch (status) {
        case 'APPROVED':
            return 'green';
        case 'PENDING':
            return 'yellow';
        case 'REJECTED':
            return 'red';
        case 'RETURNED':
            return 'orange';
        case 'New':
            return 'blue';
        default:
            return 'gray';
    }
};

export { getStatusColor };

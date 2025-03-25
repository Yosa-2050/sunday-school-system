import { Button, Group, Textarea } from '@mantine/core';
import { useState } from 'react';

interface DeclineModalProps {
    close: () => void;
    declineJobMutate: () => void;
}

function DeclineModal({ close, declineJobMutate }: DeclineModalProps) {
    const [declineReason, setDeclineReason] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleProceed = async () => {
        if (!declineReason.trim()) {
            setError('Decline Reason is required.');
            return;
        }
        if (declineReason.length < 10) {
            setError('Decline Reason must be at least 10 characters long.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            const response = await fetch(
                '/api/job-portal/JobPortalController_declineJob',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        declineReason,
                    }),
                },
            );

            if (response.ok) {
                declineJobMutate();
                close();
            } else {
                setError('Failed to decline job. Please try again.');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Textarea
                placeholder="Enter reason for decline"
                value={declineReason}
                onChange={(event) =>
                    setDeclineReason(event.currentTarget.value)
                }
                required
                error={error}
            />
            <Group mt="md" justify="end">
                <Button variant="default" onClick={close} disabled={loading}>
                    Cancel
                </Button>
                <Button color="red" onClick={handleProceed} loading={loading}>
                    Decline
                </Button>
            </Group>
        </div>
    );
}

export default DeclineModal;

'use client';

import { Badge, Box } from '@mantine/core';
import { useNetwork } from '@mantine/hooks';
import { useEffect, useState } from 'react';

export function OnlineStatusHeader() {
    const networkStatus = useNetwork();
    const [showRestored, setShowRestored] = useState(false);
    const isOnline = networkStatus.online;

    useEffect(() => {
        if (isOnline) {
            setShowRestored(true);
            const timer = setTimeout(() => setShowRestored(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [isOnline]);

    if (isOnline && !showRestored) {
        return null;
    }

    return (
        <Box
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'center',
                padding: '8px',
                backgroundColor: isOnline
                    ? 'var(--mantine-color-green-0)'
                    : 'var(--mantine-color-red-0)',
            }}
        >
            <Badge color={isOnline ? 'green' : 'red'} variant="light" size="lg">
                {isOnline ? 'Connection Restored' : 'Offline'}
            </Badge>
        </Box>
    );
}

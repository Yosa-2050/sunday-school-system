import { Box, LoadingOverlay } from '@mantine/core';
import { cn } from 'utilies/cn';

export function EntityPageLoading({ className }: { className?: string }) {
    return (
        <Box
            pos="relative"
            className={cn(
                'flex h-full max-h-screen min-h-[100px] w-full items-center justify-center rounded-lg border border-gray-200 z-10',
                className,
            )}
        >
            <LoadingOverlay visible overlayProps={{ radius: 'lg', blur: 2 }} />
        </Box>
    );
}

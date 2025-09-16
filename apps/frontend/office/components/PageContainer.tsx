import { Box, Stack, Title, Tooltip } from '@mantine/core';
import { cn } from 'utilities/cn';
import { GoBack } from './GoBack';

const PageContainer = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return <Stack className={cn('pb-4', className)}>{children}</Stack>;
};

const PageSubTitle = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <span className={cn('text-gray text-sm', className)}>{children}</span>
    );
};

const PageBody = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return <Stack className={cn(' ', className)}>{children}</Stack>;
};

const PageTitle = ({
    icon,
    children,
    className,
    back,
    action,
    ...props
}: {
    icon?: React.ReactNode;
    back?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}): React.ReactNode => {
    return (
        <Box
            className={cn(
                'flex min-h-12 items-center gap-2 border-b text-primary-text',
                className,
            )}
            {...props}
        >
            {back && (
                <Tooltip label="Go Back" withArrow>
                    <GoBack />
                </Tooltip>
            )}
            {icon}
            <Box className="flex grow items-center justify-between">
                <Title size="h3" className="font-medium">
                    {children}
                </Title>
                {action}
            </Box>
        </Box>
    );
};

export { PageBody, PageContainer, PageSubTitle, PageTitle };

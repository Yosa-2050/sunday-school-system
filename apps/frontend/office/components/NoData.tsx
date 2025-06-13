import { Box, Text } from '@mantine/core';
import { IconFoldersFilled } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { cn } from 'utilies/cn';

export default function NoData({
    entity,
    header,
    subHeader,
    children,
    className,
}: {
    entity?: string;
    header?: React.ReactNode;
    subHeader?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
}) {
    const t = useTranslations('ui');
    return (
        <Box
            className={cn(
                'flex flex-col max-h-screen min-h-[250px] items-center justify-center',
                className,
            )}
        >
            <div className="mb-4 flex justify-center">
                <IconFoldersFilled
                    size={60}
                    color="var(--primary-color-2)"
                    stroke={1.5}
                />
            </div>
            <div className="flex flex-col items-center justify-center text-center">
                <div className="text-2xl font-semibold text-gray-600">
                    {header ? header : <Text size="xs">No Data Available</Text>}
                </div>
                <div className="text-gray-500 text-center">
                    {subHeader ? (
                        subHeader
                    ) : (
                        <span className="space-x-2">
                            <Text size="xs">There is no data available</Text>
                        </span>
                    )}
                </div>
            </div>
            <div className="mt-4">{children}</div>
        </Box>
    );
}

import { Box, Card, Group, Text, ThemeIcon } from '@mantine/core';
import type { IconProps } from '@tabler/icons-react';
import type React from 'react';

interface JobPostsCardProps {
    count: number;
    color: string;
    title: string;
    Icon: React.FC<IconProps>;
}

const ReportCard: React.FC<JobPostsCardProps> = ({
    count,
    color,
    title,
    Icon,
}) => {
    return (
        <Card
            shadow="md"
            p="lg"
            radius="lg"
            withBorder
            style={{ width: '20rem', position: 'relative', overflow: 'hidden' }}
        >
            <Box
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    backgroundColor: color,
                    borderRadius: '0 0 8px 8px',
                }}
            />
            <Group justify="space-between" align="center">
                <div>
                    <Text size="xl" fw={700} style={{ color: color }} mb={4}>
                        {count}
                    </Text>
                    <Text size="sm" c="gray">
                        {title}
                    </Text>
                </div>
                <ThemeIcon
                    variant="light"
                    size="xl"
                    radius="lg"
                    style={{ backgroundColor: `${color}20` }}
                >
                    <Icon size={28} color={color} />
                </ThemeIcon>
            </Group>
        </Card>
    );
};

export default ReportCard;

'use client';

import { Box, Card, Stack, Text } from '@mantine/core';
import { IconBriefcase, IconSearch } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

type NoDataProps = {
    resetFilters: () => void;
};

const NoData = ({ resetFilters }: NoDataProps) => {
    const t = useTranslations('jobListing');

    return (
        <Card shadow="sm" padding="xl" radius="md" withBorder>
            <Stack align="center" gap="lg">
                <Box
                    style={{
                        position: 'relative',
                        padding: '2rem',
                        borderRadius: '50%',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        transition: 'transform 0.3s ease',
                    }}
                    className="hover:scale-105"
                >
                    <IconBriefcase
                        size={56}
                        style={{
                            color: 'var(--mantine-primary-color)',
                            animation: 'bounce 2s infinite',
                        }}
                    />
                    <Box
                        style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            backgroundColor:
                                'var(--mantine-primary-color-light)',
                            borderRadius: '50%',
                            padding: '8px',
                        }}
                    >
                        <IconSearch
                            size={16}
                            style={{ color: 'var(--mantine-primary-color)' }}
                        />
                    </Box>
                </Box>

                <Text size="xl" fw={700} ta="center" c="gray.8">
                    {t('noJobsFound')}
                </Text>
            </Stack>

            <style jsx>{`
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0, 0, 0);
          }
          40%, 43% {
            transform: translate3d(0, -15px, 0);
          }
          70% {
            transform: translate3d(0, -7px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }
      `}</style>
        </Card>
    );
};

export default NoData;

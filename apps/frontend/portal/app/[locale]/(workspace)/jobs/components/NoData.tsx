import { Card, Divider, Button, Text } from '@mantine/core';
import { IconBriefcase, IconSearch, IconFilter } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';


type NoDataProps = {
    resetFilters: () => void;
};

const NoData = ({ resetFilters }: NoDataProps) => {
    const t = useTranslations('jobListing');
  return (
    <Card shadow="sm">
                                        <div className=" p-8 rounded-full mb-8 shadow-lg transform hover:scale-105 transition-transform duration-300">
                                            <div className="relative">
                                                <IconBriefcase
                                                    size={56}
                                                    className="text-primary animate-bounce-slow"
                                                />
                                                <div className="absolute -top-2 -right-2 bg-primary/10 rounded-full p-2">
                                                    <IconSearch
                                                        size={16}
                                                        className="text-primary"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <Text
                                            size="2xl"
                                            fw={700}
                                            mb={'lg'}
                                            className="text-gray-800 text-center mb-4"
                                        >
                                            {t('noJobsFound')}
                                        </Text>
                                        <Divider my={'md'} />
                                        <div className="flex gap-4">
                                            <Button
                                                variant="filled"
                                                color="primary"
                                                radius="xl"
                                                size="md"
                                                leftSection={
                                                    <IconFilter size={16} />
                                                }
                                                onClick={resetFilters}
                                                className="hover:scale-105 transition-transform duration-200"
                                            >
                                                {t('resetFilters')}
                                            </Button>
                                            <Button
                                                variant="light"
                                                color="primary"
                                                radius="xl"
                                                size="md"
                                                leftSection={
                                                    <IconSearch size={16} />
                                                }
                                                onClick={() => {
                                                    // Focus on search input
                                                    const searchInput =
                                                        document.querySelector(
                                                            'input[type="text"]',
                                                        );
                                                    if (searchInput) {
                                                        (
                                                            searchInput as HTMLElement
                                                        ).focus();
                                                    }
                                                }}
                                                className="hover:scale-105 transition-transform duration-200"
                                            >
                                                {t('searchAgain')}
                                            </Button>
                                        </div>
                                    </Card>
  )
}

export default NoData
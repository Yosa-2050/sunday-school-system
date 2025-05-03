'use client';

import type { Skill } from '@/lib/types';
import {
    ActionIcon,
    Badge,
    Box,
    Card,
    Divider,
    Flex,
    Group,
    Modal,
    Pill,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import SkillsForm from './forms/skills-form';

export default function SkillsSection({ skills }: { skills: Skill[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddSkills = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            <Card shadow="sm" withBorder>
                <Stack gap="md">
                    <Group justify="space-between">
                        <Title order={4}>
                            Skills <Badge>{skills.length}</Badge>
                        </Title>
                        <ActionIcon
                            variant="light"
                            color="blue"
                            size="lg"
                            radius="xl"
                            onClick={handleAddSkills}
                            aria-label="Add Skills"
                        >
                            <IconPlus size={18} />
                        </ActionIcon>
                    </Group>

                    <Divider />

                    {skills.length === 0 ? (
                        <Text c="dimmed" fs="italic">
                            No skills added yet.
                        </Text>
                    ) : (
                        <Box>
                            <Flex gap="xs" wrap={'wrap'}>
                                {skills.slice(0, 5).map((skill) => (
                                    <Pill key={skill.id} size="lg" radius="xl">
                                        {skill.skill}
                                    </Pill>
                                ))}
                                {skills.length > 5 && (
                                    <Pill
                                        size="lg"
                                        radius="xl"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        +{skills.length - 5} more
                                    </Pill>
                                )}
                            </Flex>
                        </Box>
                    )}
                </Stack>
            </Card>

            <Modal
                opened={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Manage Skills"
                size="md"
            >
                <SkillsForm
                    initialSkills={skills.map((skill) => skill.skill)}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </>
    );
}

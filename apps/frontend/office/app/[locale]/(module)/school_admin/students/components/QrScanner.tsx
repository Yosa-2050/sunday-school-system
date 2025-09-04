'use client';

import {
    ActionIcon,
    Button,
    Group,
    Modal,
    Paper,
    Radio,
    Select,
    Stack,
    Text,
} from '@mantine/core';
import { IconArrowLeft, IconScan } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { showError, showSuccess } from 'utilies/notification';
import { saveIndividualAttendanceApi } from '../../attendance/schemas/api';
import { AttendanceStatus } from '../../attendance/schemas/types';
import { fetchClassesApi } from '../../classes/create/components/schema/fetchClassesDetail';
import QRScannerModal from './QrScanModal';

interface QRScannerProps {
    onAttendanceRecorded: () => void;
}

interface Class {
    id: string;
    name: string;
}

export default function QRScanner({ onAttendanceRecorded }: QRScannerProps) {
    const [opened, setOpened] = useState(false);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>(
        AttendanceStatus.PRESENT,
    );

    // Fetch classes for selection
    const { data: classes = [], isLoading: loadingClasses } = useQuery<Class[]>(
        {
            queryKey: ['classes'],
            queryFn: fetchClassesApi,
        },
    );

    const handleStudentScanned = async (studentId: string) => {
        try {
            if (!selectedClass) {
                return;
            }
            const reponse = saveIndividualAttendanceApi(selectedClass, {
                studentId,
                status: attendanceStatus,
            });
            const response = await fetch('/api/attendance/record', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId,
                    classId: selectedClass,
                    status: attendanceStatus,
                    timestamp: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || 'Failed to record attendance',
                );
            }

            showSuccess(`Attendance recorded for student ${studentId}`);
            onAttendanceRecorded();
        } catch (error) {
            showError(
                error instanceof Error
                    ? error.message
                    : 'Failed to record attendance',
            );
        }
    };

    const openScanner = () => setOpened(true);
    const closeScanner = () => {
        setOpened(false);
        setSelectedClass(null);
    };
    const resetScanner = () => setSelectedClass(null);

    return (
        <>
            <Button
                leftSection={<IconScan size={20} />}
                onClick={openScanner}
                variant="light"
                color="blue"
                size="md"
            >
                Scan QR Code
            </Button>

            <Modal
                opened={opened}
                onClose={closeScanner}
                title={
                    <Group>
                        {selectedClass && (
                            <ActionIcon
                                variant="subtle"
                                onClick={resetScanner}
                                size="sm"
                            >
                                <IconArrowLeft size={16} />
                            </ActionIcon>
                        )}
                        <span>
                            {selectedClass
                                ? `Scanning - ${classes.find((c) => c.id === selectedClass)?.name}`
                                : 'Setup Attendance Scanner'}
                        </span>
                    </Group>
                }
                size="lg"
                centered
                closeOnClickOutside={false}
            >
                <Paper p="md" withBorder>
                    {/* biome-ignore lint/style/noNegationElse: <explanation> */}
                    {!selectedClass ? (
                        // Class selection step
                        <Stack>
                            <Text size="sm" c="dimmed" mb="md">
                                Configure attendance settings before scanning
                            </Text>

                            <Select
                                label="Select Class"
                                placeholder="Choose a class"
                                data={classes.map((cls) => ({
                                    value: cls.id,
                                    label: cls.name,
                                }))}
                                value={selectedClass}
                                onChange={setSelectedClass}
                                disabled={loadingClasses}
                                required
                            />

                            <Radio.Group
                                label="Default Attendance Status"
                                value={attendanceStatus}
                                onChange={(value) =>
                                    setAttendanceStatus(
                                        value as
                                            | AttendanceStatus.PRESENT
                                            | AttendanceStatus.LATE,
                                    )
                                }
                                description="You can change this for individual students later"
                            >
                                <Group mt="xs">
                                    <Radio value="PRESENT" label="Present" />
                                    <Radio value="LATE" label="Late" />
                                </Group>
                            </Radio.Group>

                            <Button
                                onClick={() => setSelectedClass(selectedClass)}
                                disabled={!selectedClass}
                                fullWidth
                                mt="md"
                            >
                                Start Scanning
                            </Button>
                        </Stack>
                    ) : (
                        // Scanner modal component
                        <QRScannerModal
                            onStudentScanned={handleStudentScanned}
                            attendanceStatus={attendanceStatus}
                        />
                    )}
                </Paper>
            </Modal>
        </>
    );
}

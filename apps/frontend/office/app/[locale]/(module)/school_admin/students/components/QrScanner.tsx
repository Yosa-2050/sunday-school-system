'use client';

import {
    ActionIcon,
    Button,
    Group,
    Modal,
    Notification,
    Paper,
    Radio,
    Select,
    Stack,
    Text,
} from '@mantine/core';
import { IconArrowLeft, IconCheck, IconScan } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { showError } from 'utilities/notification';
import { saveIndividualAttendanceApi } from '../../attendance/schemas/api';
import { AttendanceStatus } from '../../attendance/schemas/types';
import {
    type GetClass,
    fetchClassesApi,
} from '../../classes/create/components/schema/fetchClassesDetail';
import QRScannerModal from './QrScanModal';

interface QRScannerProps {
    onAttendanceRecorded: () => void;
    disable: boolean;
}

export default function QRScanner({
    onAttendanceRecorded,
    disable,
}: QRScannerProps) {
    const [opened, setOpened] = useState(false);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>(
        AttendanceStatus.PRESENT,
    );
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [scanKey, setScanKey] = useState(0); // Key to force re-render scanner without resetting

    // Fetch classes for selection
    const { data: classes = [], isLoading: loadingClasses } = useQuery<
        GetClass[]
    >({
        queryKey: ['classes'],
        queryFn: fetchClassesApi,
    });

    // Get the selected class object
    const selectedClassObj = classes.find((c) => c.id === selectedClass);

    // Check if scanning is allowed (class selected + section selected if required)
    const canStartScanning =
        selectedClass &&
        (!selectedClassObj?.sections?.length || selectedSection);

    // Use useCallback to prevent unnecessary re-renders of QRScannerModal
    const handleStudentScanned = useCallback(
        async (studentId: string) => {
            try {
                if (!selectedClass) {
                    return;
                }

                // Determine the actual class ID to use (section ID if selected, otherwise class ID)
                const targetClassId = selectedSection || selectedClass;

                // Use your existing API function
                const response = await saveIndividualAttendanceApi(
                    targetClassId,
                    {
                        studentId,
                        status: attendanceStatus,
                    },
                );

                // Show success notification
                //setSuccessMessage(`Attendance recorded for student ${studentId}`);
                setSuccessMessage('Attendance recorded for student');
                setShowSuccess(true);

                // Auto-hide success message after 2 seconds
                setTimeout(() => {
                    setShowSuccess(false);
                }, 2000);

                // Increment scan key to refresh scanner without resetting the modal
                setScanKey((prev) => prev + 1);

                // Call the callback to refresh parent component if needed
                onAttendanceRecorded();
            } catch (error) {
                showError(
                    error instanceof Error
                        ? error.message
                        : 'Failed to record attendance',
                );
            }
        },
        [
            selectedClass,
            selectedSection,
            attendanceStatus,
            onAttendanceRecorded,
        ],
    );

    const openScanner = () => setOpened(true);
    const closeScanner = () => {
        setOpened(false);
        setSelectedClass(null);
        setSelectedSection(null);
        setShowSuccess(false);
    };

    const resetScanner = () => {
        setSelectedClass(null);
        setSelectedSection(null);
        setShowSuccess(false);
    };

    const handleClassChange = (classId: string | null) => {
        setSelectedClass(classId);
        setSelectedSection(null); // Reset section when class changes
    };

    // Get available sections for the selected class
    const availableSections = selectedClassObj?.sections || [];

    return (
        <>
            <Button
                leftSection={<IconScan size={20} />}
                onClick={openScanner}
                variant="light"
                color="blue"
                size="md"
                disabled={disable}
            >
                Scan QR Code
            </Button>

            <Modal
                opened={opened}
                onClose={closeScanner}
                title={
                    <Group>
                        {(selectedClass || selectedSection) && (
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
                                ? `Scanning - ${selectedClassObj?.name}${selectedSection ? ` - ${availableSections.find((s) => s.id === selectedSection)?.name}` : ''}`
                                : 'Setup Attendance Scanner'}
                        </span>
                    </Group>
                }
                size="lg"
                centered
                closeOnClickOutside={false}
            >
                <Paper p="md" withBorder>
                    {/* Class selection step - shown when no class is selected */}
                    {/* biome-ignore lint/style/noNegationElse: <explanation> */}
                    {!selectedClass ? (
                        <Stack>
                            <Text size="sm" c="dimmed" mb="md">
                                Configure attendance settings before scanning
                            </Text>

                            <Select
                                label="Select Class"
                                placeholder="Choose a class"
                                data={classes.map((cls) => ({
                                    value: cls.id,
                                    label: `${cls.name} ${cls.hasSection ? '(Has Sections)' : ''}`,
                                }))}
                                value={selectedClass}
                                onChange={handleClassChange}
                                disabled={loadingClasses}
                                required
                            />

                            <Radio.Group
                                label="Default Attendance Status"
                                value={attendanceStatus}
                                onChange={(value) =>
                                    setAttendanceStatus(
                                        value as AttendanceStatus,
                                    )
                                }
                                description="You can change this for individual students later"
                            >
                                <Group mt="xs">
                                    <Radio
                                        value={AttendanceStatus.PRESENT}
                                        label="Present"
                                    />
                                    <Radio
                                        value={AttendanceStatus.LATE}
                                        label="Late"
                                    />
                                </Group>
                            </Radio.Group>

                            <Button
                                // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
                                onClick={() => {}}
                                disabled={!selectedClass}
                                fullWidth
                                mt="md"
                            >
                                Continue
                            </Button>
                        </Stack>
                    ) : (
                        // Section selection or scanner step - shown when class is selected
                        <Stack>
                            {/* Section selection - shown for classes with sections when no section is selected */}
                            {selectedClassObj?.hasSection &&
                            !selectedSection ? (
                                <>
                                    <Text size="sm" c="dimmed" mb="md">
                                        This class has sections. Please select a
                                        section to continue.
                                    </Text>

                                    <Select
                                        label="Select Section"
                                        placeholder="Choose a section"
                                        data={availableSections.map(
                                            (section) => ({
                                                value: section.id,
                                                label: section.name,
                                            }),
                                        )}
                                        value={selectedSection}
                                        onChange={setSelectedSection}
                                        required
                                    />

                                    <Button
                                        // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
                                        onClick={() => {}}
                                        disabled={!selectedSection}
                                        fullWidth
                                        mt="md"
                                    >
                                        Start Scanning
                                    </Button>
                                </>
                            ) : (
                                // Scanner component with success overlay - shown when ready to scan
                                <div style={{ position: 'relative' }}>
                                    {/* QR Scanner Modal with key to force re-render without resetting entire modal */}
                                    <QRScannerModal
                                        key={scanKey} // Key forces re-render when scanKey changes
                                        onStudentScanned={handleStudentScanned}
                                        attendanceStatus={attendanceStatus}
                                    />

                                    {/* Success Notification Overlay - appears after successful scan */}
                                    {showSuccess && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '20px',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                zIndex: 1000,
                                                width: '90%',
                                            }}
                                        >
                                            <Notification
                                                icon={
                                                    <IconCheck size="1.1rem" />
                                                }
                                                color="teal"
                                                title="Success"
                                                onClose={() =>
                                                    setShowSuccess(false)
                                                }
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {successMessage}
                                            </Notification>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Stack>
                    )}
                </Paper>
            </Modal>
        </>
    );
}

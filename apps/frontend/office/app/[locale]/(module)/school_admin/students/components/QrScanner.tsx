// components/QRScanner.tsx (with react-qr-reader, no ref)
'use client';

import {
    Badge,
    Button,
    Group,
    Loader,
    Modal,
    Paper,
    Text,
} from '@mantine/core';
import { IconCamera, IconScan, IconX } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { showError, showSuccess } from 'utilies/notification';

interface QRScannerProps {
    attendanceDataId: string;
    classId: string;
    onAttendanceRecorded: () => void;
}

export default function QRScanner({
    attendanceDataId,
    classId,
    onAttendanceRecorded,
}: QRScannerProps) {
    const [opened, setOpened] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [lastScanned, setLastScanned] = useState<string | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);

    const recordAttendanceMutation = useMutation({
        mutationFn: async (studentId: string) => {
            const response = await fetch('/api/attendance/record', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId,
                    attendanceDataId,
                    classId,
                    timestamp: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to record attendance');
            }

            return response.json();
        },
        onSuccess: () => {
            showSuccess('Attendance recorded successfully!');
            onAttendanceRecorded();
            setScanning(false);
        },
        onError: (error) => {
            showError(
                error instanceof Error
                    ? error.message
                    : 'Failed to record attendance',
            );
            setScanning(false);
        },
    });

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const handleScan = (result: any) => {
        if (result && !scanning) {
            const studentId = result.text;

            // Prevent duplicate scans within 2 seconds
            if (
                lastScanned === studentId &&
                Date.now() -
                    Number.parseInt(
                        localStorage.getItem('lastScanTime') || '0',
                    ) <
                    2000
            ) {
                return;
            }

            setScanning(true);
            setLastScanned(studentId);
            localStorage.setItem('lastScanTime', Date.now().toString());

            recordAttendanceMutation.mutate(studentId);
        }
    };

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const handleError = (error: any) => {
        //console.error('QR Scanner error:', error);
        setCameraError(error.message);

        if (error.name === 'NotAllowedError') {
            showError('Camera permission denied. Please allow camera access.');
        } else if (error.name === 'NotFoundError') {
            showError('No camera found on this device.');
        } else {
            showError(`Camera error: ${error.message}`);
        }
    };

    const openScanner = () => {
        setOpened(true);
        setScanning(false);
        setLastScanned(null);
        setCameraError(null);
    };

    const closeScanner = () => {
        setOpened(false);
        setScanning(false);
        setCameraError(null);
    };

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
                title="Scan Student QR Code"
                size="lg"
                centered
            >
                <Paper p="md" withBorder>
                    <Text size="sm" c="dimmed" mb="md" ta="center">
                        Position the QR code in front of the camera
                    </Text>

                    {cameraError ? (
                        <div
                            style={{
                                height: '300px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#f8f9fa',
                                borderRadius: '8px',
                            }}
                        >
                            <IconCamera size={48} color="#868e96" />
                            <Text ta="center" c="dimmed" mt="md">
                                {cameraError}
                            </Text>
                            <Button
                                variant="light"
                                mt="md"
                                onClick={openScanner}
                            >
                                Try Again
                            </Button>
                        </div>
                    ) : (
                        <div
                            style={{
                                position: 'relative',
                                width: '100%',
                                height: '300px',
                                overflow: 'hidden',
                            }}
                        >
                            <QrReader
                                onResult={handleScan}
                                //onError={handleError}
                                constraints={{ facingMode: 'environment' }}
                                scanDelay={300}
                                //style={{ width: '100%', height: '100%' }}
                            />

                            {scanning && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        background: 'rgba(0, 0, 0, 0.7)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 10,
                                    }}
                                >
                                    <Loader size="lg" color="white" />
                                    <Text c="white" ml="md">
                                        Processing...
                                    </Text>
                                </div>
                            )}

                            {/* Scanner overlay frame */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '200px',
                                    height: '200px',
                                    border: '4px solid #228be6',
                                    borderRadius: '12px',
                                    pointerEvents: 'none',
                                    zIndex: 5,
                                }}
                            />
                        </div>
                    )}

                    <Group justify="center" mt="md">
                        <Badge
                            color={
                                scanning
                                    ? 'blue'
                                    : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                      cameraError
                                      ? 'red'
                                      : 'green'
                            }
                            variant="light"
                        >
                            {cameraError
                                ? 'Camera Error'
                                : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                  scanning
                                  ? 'Processing...'
                                  : 'Ready to scan'}
                        </Badge>
                    </Group>

                    <Group justify="center" mt="lg">
                        <Button
                            variant="outline"
                            onClick={closeScanner}
                            leftSection={<IconX size={16} />}
                        >
                            Close Scanner
                        </Button>
                    </Group>
                </Paper>
            </Modal>
        </>
    );
}

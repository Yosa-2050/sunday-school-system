'use client';

import {
    Avatar,
    Box,
    Button,
    Divider,
    Group,
    Modal,
    Paper,
    Stack,
    Text,
} from '@mantine/core';
import {
    IconEmergencyBed,
    IconId,
    IconPhone,
    IconPrinter,
    IconSchool,
    IconUser,
} from '@tabler/icons-react';
import { QRCodeSVG } from 'qrcode.react';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export interface StudentForPrint {
    id: string;
    idNumber: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    className?: string;
    photoUrl?: string;
}

interface PrintIdModalProps {
    opened: boolean;
    onClose: () => void;
    students: StudentForPrint[];
}

export function PrintIdModal({ opened, onClose, students }: PrintIdModalProps) {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        pageStyle: `
            @page {
                size: A4;
                margin: 0.15in;
            }
            body {
                margin: 0;
                padding: 0;
                width: 100%;
                -webkit-print-color-adjust: exact;
            }
            .print-container {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                grid-template-rows: repeat(5, 1.8in); /* 5 rows per page */
                gap: 0.1in;
                width: 100%;
                height: 100%;
                page-break-after: always;
            }
            .id-card {
                width: 3.7in;
                height: 1.8in;
                padding: 0.08in;
                border: 1px solid #000;
                box-sizing: border-box;
            }
        `,
        documentTitle: `Student ID Cards - ${students.length} students`,
    });

    // Generate QR code data for a student
    const generateQRData = (student: StudentForPrint) => {
        return JSON.stringify({
            studentId: student.id,
            idNumber: student.idNumber,
            classId: student.className,
            timestamp: new Date().toISOString(),
        });
    };

    // Render a single ID card
    const renderIdCard = (student: StudentForPrint) => (
        <Box
            key={student.id}
            className="id-card"
            style={{
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                backgroundColor: 'white',
                padding: '8px',
                height: '1.9in',
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0, // Important for grid layout
            }}
        >
            <Group
                align="flex-start"
                gap={4}
                wrap="nowrap"
                style={{ flex: 1, minWidth: 0 }}
            >
                {/* Left Side - Photo and Basic Info */}
                <Box style={{ flex: 1, minWidth: 0 }}>
                    <Group gap={4} mb={4}>
                        <Avatar
                            size={35}
                            src={student.photoUrl}
                            style={{
                                border: '1px solid #dee2e6',
                                flexShrink: 0,
                            }}
                        >
                            <IconUser size={16} />
                        </Avatar>
                        <Box style={{ minWidth: 0 }}>
                            <Text
                                fw={700}
                                size="xs"
                                style={{ lineHeight: 1.1 }}
                            >
                                {student.firstName} {student.lastName}
                            </Text>
                            <Text size="10px" c="dimmed">
                                ID: {student.idNumber}
                            </Text>
                        </Box>
                    </Group>

                    <Stack gap={1}>
                        {student.phoneNumber && (
                            <Group gap={2}>
                                <IconPhone size={10} />
                                <Text size="9px" truncate>
                                    {student.phoneNumber}
                                </Text>
                            </Group>
                        )}

                        {student.className && (
                            <Group gap={2}>
                                <IconSchool size={10} />
                                <Text size="9px" truncate>
                                    {student.className}
                                </Text>
                            </Group>
                        )}

                        {student.emergencyContact && (
                            <Group gap={2}>
                                <IconEmergencyBed size={10} />
                                <Box style={{ minWidth: 0 }}>
                                    <Text size="9px" truncate>
                                        {student.emergencyContact}
                                    </Text>
                                    {student.emergencyPhone && (
                                        <Text size="9px" c="dimmed" truncate>
                                            {student.emergencyPhone}
                                        </Text>
                                    )}
                                </Box>
                            </Group>
                        )}
                    </Stack>
                </Box>

                {/* Right Side - QR Code */}
                <Box style={{ textAlign: 'center', flexShrink: 0 }}>
                    <QRCodeSVG
                        value={generateQRData(student)}
                        size={50}
                        level="H"
                        includeMargin
                    />
                    <Text size="7px" c="dimmed" mt={1}>
                        Scan for details
                    </Text>
                </Box>
            </Group>

            {/* Footer */}
            <Divider my={2} />
            <Group justify="space-between">
                <Text size="7px" c="dimmed">
                    {new Date().toLocaleDateString()}
                </Text>
                <IconId size={10} />
            </Group>
        </Box>
    );

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={`Print Student ID Cards (${students.length} students)`}
            size="xl"
            centered
        >
            <Box>
                {/* Preview */}
                <Paper withBorder p="md" mb="xl">
                    <Box ref={printRef} style={{ width: '100%' }}>
                        <Box
                            className="print-container"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '12px',
                                width: '100%',
                                maxWidth: '8.3in', // A4 width
                                margin: '0 auto',
                            }}
                        >
                            {students.map(renderIdCard)}
                        </Box>
                    </Box>
                </Paper>

                {/* Action Buttons */}
                <Group justify="center">
                    <Button
                        leftSection={<IconPrinter size={16} />}
                        onClick={handlePrint}
                        variant="filled"
                    >
                        Print {students.length} ID Cards
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </Group>
            </Box>
        </Modal>
    );
}

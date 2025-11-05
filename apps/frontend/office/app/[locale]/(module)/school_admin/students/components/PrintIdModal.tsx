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
import printJS from 'print-js';
import { QRCodeSVG } from 'qrcode.react';
import { useRef } from 'react';

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
    const printAreaRef = useRef<HTMLDivElement>(null);

    // Generate QR data
    const generateQRData = (student: StudentForPrint) =>
        JSON.stringify({
            studentId: student.id,
            idNumber: student.idNumber,
            classId: student.className,
            timestamp: new Date().toISOString(),
        });

    // Print handler
    const handlePrint = () => {
        if (!printAreaRef.current) {
            return;
        }
        printJS({
            printable: 'print-id-container',
            type: 'html',
            targetStyles: ['*'],
            style: `
                @page { 
                    size: A4; 
                    margin: 0.5in;
                }
                body { 
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    margin: 0;
                    padding: 0;
                }
                .print-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 0.3in;
                    width: 100%;
                    padding: 0.1in;
                }
                .id-card {
                    border: 2px solid #e0e0e0;
                    border-radius: 12px;
                    padding: 0.15in;
                    background: white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    height: 3.2in;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    overflow: hidden;
                }
                .id-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                .id-main-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
                .id-header {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    margin-bottom: 12px;
                }
                .student-info {
                    flex: 1;
                    min-width: 0;
                }
                .student-details {
                    margin-top: 8px;
                }
                .id-footer {
                    margin-top: auto;
                    padding-top: 8px;
                }
                .cutting-guide {
                    border: 1px dashed #ccc;
                    margin: 0.1in;
                    height: calc(100% - 0.2in);
                    border-radius: 8px;
                    pointer-events: none;
                }
            `,
        });
    };

    // Render single ID card
    const renderCard = (student: StudentForPrint) => (
        <Box key={student.id} className="id-card">
            {/* Cutting guide overlay */}
            <Box
                className="cutting-guide"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
            />

            <Box className="id-main-content">
                {/* Header with Avatar and QR Code */}
                <Group
                    justify="space-between"
                    align="flex-start"
                    className="id-header"
                >
                    <Group align="flex-start" gap="md" style={{ flex: 1 }}>
                        <Avatar
                            size={70}
                            src={student.photoUrl}
                            style={{
                                border: '3px solid #f0f0f0',
                                borderRadius: '8px',
                            }}
                        >
                            <IconUser size={30} />
                        </Avatar>
                        <Box className="student-info">
                            <Text
                                fw={500}
                                size="sm"
                                style={{ lineHeight: 1.2 }}
                            >
                                {student.firstName} {student.lastName}
                            </Text>
                            <Text size="xs" c="dimmed" mt={2}>
                                {student.idNumber}
                            </Text>
                            {student.className && (
                                <Group gap={6} mt={6}>
                                    <IconSchool size={14} />
                                    <Text size="sm" fw={500}>
                                        {student.className}
                                    </Text>
                                </Group>
                            )}
                        </Box>
                    </Group>

                    {/* QR Code */}
                    <Box style={{ textAlign: 'center', flexShrink: 0 }}>
                        <QRCodeSVG
                            value={generateQRData(student)}
                            size={80}
                            level="H"
                            includeMargin
                        />
                        <Text size="xs" c="dimmed" mt={4}>
                            Scan here
                        </Text>
                    </Box>
                </Group>

                {/* Student Details */}
                <Box className="student-details">
                    <Stack gap={6}>
                        {student.phoneNumber && (
                            <Group gap={8}>
                                <IconPhone size={16} color="#666" />
                                <Text size="sm">{student.phoneNumber}</Text>
                            </Group>
                        )}

                        {student.emergencyContact && (
                            <Box>
                                <Group gap={8} mb={2}>
                                    <IconEmergencyBed size={16} color="#666" />
                                    <Text size="sm" fw={500}>
                                        Emergency Contact
                                    </Text>
                                </Group>
                                <Box pl={24}>
                                    <Text size="sm">
                                        {student.emergencyContact}
                                    </Text>
                                    {student.emergencyPhone && (
                                        <Text size="sm" c="dimmed">
                                            {student.emergencyPhone}
                                        </Text>
                                    )}
                                </Box>
                            </Box>
                        )}
                    </Stack>
                </Box>
            </Box>

            {/* Footer */}
            <Box className="id-footer">
                <Divider mb={8} />
                <Group justify="space-between">
                    <Text size="xs" c="dimmed">
                        Issued: {new Date().toLocaleDateString()}
                    </Text>
                    <Group gap={4}>
                        <IconId size={14} />
                        <Text size="xs" fw={500}>
                            Student ID Card
                        </Text>
                    </Group>
                </Group>
            </Box>
        </Box>
    );

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={`Print Student ID Cards (${students.length})`}
            size="xl"
            centered
        >
            <Paper withBorder p="md" mb="xl">
                {/* Printable Area */}
                <Box
                    id="print-id-container"
                    ref={printAreaRef}
                    className="print-grid"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '20px',
                        padding: '20px',
                        maxWidth: '8.3in',
                        margin: '0 auto',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                    }}
                >
                    {students.map(renderCard)}
                </Box>
            </Paper>

            {/* Actions */}
            <Group justify="center" mt="md">
                <Button
                    leftSection={<IconPrinter size={16} />}
                    onClick={handlePrint}
                    variant="filled"
                    size="md"
                >
                    Print {students.length} ID Cards
                </Button>
                <Button variant="outline" onClick={onClose} size="md">
                    Close
                </Button>
            </Group>

            {/* Print Instructions */}
            <Text size="sm" c="dimmed" ta="center" mt="md">
                Each ID card has cutting guides for easy separation
            </Text>
        </Modal>
    );
}

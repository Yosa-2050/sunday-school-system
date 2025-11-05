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
                    margin: 0.4in;
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
                    gap: 0.25in;
                    width: 100%;
                    padding: 0.1in;
                }
                .id-card {
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    padding: 0.12in;
                    background: white;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    min-height: 2.8in;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    overflow: hidden;
                    page-break-inside: avoid;
                }
                .id-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                .id-main-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .id-header {
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    margin-bottom: 4px;
                }
                .student-info {
                    flex: 1;
                    min-width: 0;
                }
                .student-name {
                    font-weight: 700;
                    font-size: 14px;
                    line-height: 1.2;
                    margin-bottom: 2px;
                }
                .student-id {
                    font-size: 11px;
                    color: #666;
                    margin-bottom: 4px;
                }
                .student-details {
                    margin-top: 4px;
                }
                .id-footer {
                    margin-top: auto;
                    padding-top: 6px;
                }
                .cutting-guide {
                    border: 1px dashed #ddd;
                    margin: 0.08in;
                    height: calc(100% - 0.16in);
                    border-radius: 6px;
                    pointer-events: none;
                }
                .detail-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 6px;
                    margin-bottom: 4px;
                }
                .detail-text {
                    font-size: 11px;
                    line-height: 1.3;
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
                    <Group align="flex-start" gap="sm" style={{ flex: 1 }}>
                        <Avatar
                            size={50}
                            src={student.photoUrl}
                            style={{
                                border: '2px solid #f0f0f0',
                                borderRadius: '6px',
                                flexShrink: 0,
                            }}
                        >
                            <IconUser size={20} />
                        </Avatar>
                        <Box className="student-info">
                            <Text className="student-name" truncate>
                                {student.firstName} {student.lastName}
                            </Text>
                            <Text className="student-id">
                                {student.idNumber}
                            </Text>
                            {student.className && (
                                <Group gap={4} mt={2}>
                                    <IconSchool size={12} />
                                    <Text size="11px" truncate>
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
                            size={60}
                            level="H"
                            includeMargin
                        />
                        <Text size="10px" c="dimmed" mt={2}>
                            Scan Me
                        </Text>
                    </Box>
                </Group>

                {/* Student Details */}
                <Box className="student-details">
                    <Stack gap={4}>
                        {student.phoneNumber && (
                            <Box className="detail-item">
                                <IconPhone
                                    size={12}
                                    color="#666"
                                    style={{ marginTop: '1px', flexShrink: 0 }}
                                />
                                <Text className="detail-text" truncate>
                                    {student.phoneNumber}
                                </Text>
                            </Box>
                        )}

                        {student.emergencyContact && (
                            <Box>
                                <Box className="detail-item">
                                    <IconEmergencyBed
                                        size={12}
                                        color="#666"
                                        style={{
                                            marginTop: '1px',
                                            flexShrink: 0,
                                        }}
                                    />
                                    <Text className="detail-text" fw={500}>
                                        Emergency Contact
                                    </Text>
                                </Box>
                                <Box style={{ marginLeft: '18px' }}>
                                    <Text className="detail-text" truncate>
                                        {student.emergencyContact}
                                    </Text>
                                    {student.emergencyPhone && (
                                        <Text
                                            className="detail-text"
                                            c="dimmed"
                                            truncate
                                        >
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
                <Divider mb={4} />
                <Group justify="space-between">
                    <Text size="5x" c="dimmed">
                        ID Card
                    </Text>
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
                        gap: '16px',
                        padding: '16px',
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
                Each ID card has cutting guides and is optimized for printing
            </Text>
        </Modal>
    );
}

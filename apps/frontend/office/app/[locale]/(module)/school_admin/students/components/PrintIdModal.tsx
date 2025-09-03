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
    student: StudentForPrint;
}

export function PrintIdModal({ opened, onClose, student }: PrintIdModalProps) {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef, // Changed from 'content' to 'contentRef'
        pageStyle: `
            @page { 
                size: 3.375in 2.125in;
                margin: 0; 
            }
            @media print {
                body { 
                    -webkit-print-color-adjust: exact;
                    margin: 0;
                    padding: 0;
                }
                .print-container { 
                    width: 3.375in; 
                    height: 2.125in; 
                    margin: 0; 
                    padding: 0.125in; 
                    box-sizing: border-box;
                }
            }
        `,
        documentTitle: `Student ID - ${student.firstName} ${student.lastName}`,
        // removeAfterPrint: true,
    });

    // Generate QR code data
    const qrData = JSON.stringify({
        studentId: student.id,
        idNumber: student.idNumber,
        classId: student.className,
        timestamp: new Date().toISOString(),
    });

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Print Student ID Card"
            size="lg"
            centered
        >
            <Box>
                {/* Preview */}
                <Paper withBorder p="md" mb="xl">
                    <Box ref={printRef} style={{ width: '100%' }}>
                        <Box
                            className="print-container"
                            style={{
                                width: '100%',
                                minHeight: '200px',
                                padding: '16px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                backgroundColor: 'white',
                            }}
                        >
                            <Group align="flex-start" gap="sm" wrap="nowrap">
                                {/* Left Side - Photo and Basic Info */}
                                <Box style={{ flex: 1 }}>
                                    <Group gap="sm" mb="md">
                                        <Avatar
                                            size={60}
                                            src={student.photoUrl}
                                            style={{
                                                border: '2px solid #dee2e6',
                                            }}
                                        >
                                            <IconUser size={30} />
                                        </Avatar>
                                        <Box>
                                            <Text
                                                fw={700}
                                                size="lg"
                                                style={{ lineHeight: 1.1 }}
                                            >
                                                {student.firstName}{' '}
                                                {student.lastName}
                                            </Text>
                                            <Text size="sm" c="dimmed">
                                                ID: {student.idNumber}
                                            </Text>
                                        </Box>
                                    </Group>

                                    <Stack gap="xs">
                                        {student.phoneNumber && (
                                            <Group gap="xs">
                                                <IconPhone size={14} />
                                                <Text size="xs">
                                                    {student.phoneNumber}
                                                </Text>
                                            </Group>
                                        )}

                                        {student.className && (
                                            <Group gap="xs">
                                                <IconSchool size={14} />
                                                <Text size="xs">
                                                    {student.className}
                                                </Text>
                                            </Group>
                                        )}

                                        {student.emergencyContact && (
                                            <Group gap="xs">
                                                <IconEmergencyBed size={14} />
                                                <Box>
                                                    <Text size="xs">
                                                        {
                                                            student.emergencyContact
                                                        }
                                                    </Text>
                                                    {student.emergencyPhone && (
                                                        <Text
                                                            size="xs"
                                                            c="dimmed"
                                                        >
                                                            {
                                                                student.emergencyPhone
                                                            }
                                                        </Text>
                                                    )}
                                                </Box>
                                            </Group>
                                        )}
                                    </Stack>
                                </Box>

                                {/* Right Side - QR Code */}
                                <Box style={{ textAlign: 'center' }}>
                                    <QRCodeSVG
                                        value={qrData}
                                        size={150}
                                        level="H"
                                        includeMargin
                                    />
                                    <Text size="xs" c="dimmed" mt={5}>
                                        Scan for details
                                    </Text>
                                </Box>
                            </Group>

                            {/* Footer */}
                            <Divider my="sm" />
                            <Group justify="space-between">
                                <Text size="xs" c="dimmed">
                                    {new Date().toLocaleDateString()}
                                </Text>
                                <IconId size={16} />
                            </Group>
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
                        Print ID Card
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </Group>
            </Box>
        </Modal>
    );
}

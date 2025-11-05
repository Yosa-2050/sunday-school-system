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
            targetStyles: ['*'], // include all Mantine styles
            style: `
        @page { size: A4; margin: 0.3in; }
        body { -webkit-print-color-adjust: exact; }
        .print-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-auto-rows: 1.8in;
          gap: 0.2in;
          width: 100%;
        }
        .id-card {
          border: 1px solid #ccc;
          border-radius: 6px;
          padding: 0.1in;
          background: white;
          box-shadow: 0 0 2px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 1.8in;
        }
        .id-header {
          display: flex;
          align-items: flex-start;
          gap: 6px;
        }
        .id-footer {
          font-size: 8px;
          color: #555;
          display: flex;
          justify-content: space-between;
        }
      `,
        });
    };

    // Render single ID card
    const renderCard = (student: StudentForPrint) => (
        <Box key={student.id} className="id-card">
            <Box className="id-header">
                <Avatar
                    size={40}
                    src={student.photoUrl}
                    style={{ border: '1px solid #eee' }}
                >
                    <IconUser size={16} />
                </Avatar>
                <Box style={{ flex: 1, minWidth: 0 }}>
                    <Text fw={700} size="xs">
                        {student.firstName} {student.lastName}
                    </Text>
                    <Text size="10px" c="dimmed">
                        ID: {student.idNumber}
                    </Text>
                    {student.className && (
                        <Group gap={4} mt={2}>
                            <IconSchool size={10} />
                            <Text size="9px">{student.className}</Text>
                        </Group>
                    )}
                </Box>
                <Box style={{ textAlign: 'center' }}>
                    <QRCodeSVG
                        value={generateQRData(student)}
                        size={45}
                        level="H"
                    />
                </Box>
            </Box>

            <Stack gap={1} mt={4}>
                {student.phoneNumber && (
                    <Group gap={3}>
                        <IconPhone size={10} />
                        <Text size="9px">{student.phoneNumber}</Text>
                    </Group>
                )}
                {student.emergencyContact && (
                    <Group gap={3}>
                        <IconEmergencyBed size={10} />
                        <Box>
                            <Text size="9px">{student.emergencyContact}</Text>
                            {student.emergencyPhone && (
                                <Text size="9px" c="dimmed">
                                    {student.emergencyPhone}
                                </Text>
                            )}
                        </Box>
                    </Group>
                )}
            </Stack>

            <Divider my={3} />
            <Group justify="space-between" className="id-footer">
                <Text>{new Date().toLocaleDateString()}</Text>
                <IconId size={10} />
            </Group>
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
                        gap: '12px',
                        maxWidth: '8.3in',
                        margin: '0 auto',
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
                >
                    Print {students.length} ID Cards
                </Button>
                <Button variant="outline" onClick={onClose}>
                    Close
                </Button>
            </Group>
        </Modal>
    );
}

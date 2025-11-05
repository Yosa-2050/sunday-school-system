'use client';

import { Box, Button, Divider, Group, Modal, Paper, Text } from '@mantine/core';
import { IconPrinter } from '@tabler/icons-react';
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
                margin: 0.4in; // Increased margins for safety
            }
            body {
                margin: 0;
                padding: 0;
            }
            .print-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                grid-template-rows: repeat(3, 3.2in);
                gap: 10px;
                padding: 10px;
                height: 10.5in; // Reduced to fit within margins
                page-break-after: always;
            }
            .id-card {
                height: 3.2in;
                page-break-inside: avoid;
                break-inside: avoid;
                overflow: hidden; // Prevent content from overflowing
            }
            .id-main-content {
                padding: 5px; // Add some internal padding
            }
        `,
        });
    };
    // Render single ID card
    const renderCard = (student: StudentForPrint) => (
        <Box key={student.id} className="id-card">
            {/* Header */}
            <Box className="id-card-header">
                <Divider my={10} />
            </Box>

            <Box className="id-main-content">
                {/* Student Info */}
                <Group justify="space-between" align="flex-end" wrap="nowrap">
                    {/* Left Side - Name and ID */}
                    <Box style={{ flex: 4, minWidth: 0 }}>
                        <Box mb="xs">
                            <Text fw={600} size="16px" truncate>
                                {student.firstName} {student.lastName}
                            </Text>
                            <Divider my={10} />
                            <Text size="14px" c="dimmed" truncate>
                                ID: {student.idNumber}
                            </Text>
                        </Box>
                    </Box>

                    {/* Right Side - QR Code */}
                    <Box
                        style={{
                            textAlign: 'center',
                            width: '150px', // Increased width
                            height: '150px', // Increased height
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'bottom',
                            justifyContent: 'center',
                        }}
                    >
                        <QRCodeSVG
                            value={generateQRData(student)}
                            size={140}
                            level="H"
                        />
                    </Box>
                </Group>
            </Box>

            {/* Footer */}
            <Box className="id-footer">
                <Divider />
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

            <Paper withBorder p="md" mb="xl">
                {/* Printable Area */}
                <Box
                    id="print-id-container"
                    ref={printAreaRef}
                    className="print-grid"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gridTemplateRows: 'repeat(3, 3.2in)',
                        gap: '10px',
                        padding: '10px', // More outer space
                        maxWidth: '9.5in',
                        height: '11.7in',
                        margin: '0 auto',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px',
                        // Add container borders
                        border: '1px dashed #ccc',
                    }}
                >
                    {students.map((student, index) => (
                        <Box
                            key={student.id}
                            style={{
                                pageBreakInside: 'avoid',
                                breakInside: 'avoid',
                                height: '3.2in',
                                // Add vertical line between columns
                                borderRight:
                                    index % 2 === 0
                                        ? '2px solid #e0e0e0'
                                        : 'none',
                                // Add horizontal line between rows
                                borderBottom:
                                    index < students.length - 2
                                        ? '1px dashed #e0e0e0'
                                        : 'none',
                                padding: '1px',
                                ...(index > 0 && index % 6 === 0
                                    ? {
                                          pageBreakBefore: 'always',
                                          breakBefore: 'page',
                                      }
                                    : {}),
                            }}
                        >
                            {renderCard(student)}
                        </Box>
                    ))}
                </Box>
            </Paper>
        </Modal>
    );
}

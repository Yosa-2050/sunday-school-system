// components/QRScannerModal.tsx
'use client';

import { Stack, Text } from '@mantine/core';
import { type IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';
import { AttendanceStatus } from '../../attendance/schemas/types';

interface QRScannerModalProps {
    onStudentScanned: (studentId: string) => void;
    attendanceStatus: AttendanceStatus;
}

interface ScanResult {
    boundingBox: DOMRectReadOnly;
    rawValue: string;
    format: string;
    cornerPoints: { x: number; y: number }[];
}

interface QRCodeData {
    studentId: string;
    idNumber: string;
    classId: string;
    timestamp: string;
}

export default function QRScannerModal({
    onStudentScanned,
    attendanceStatus,
}: QRScannerModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    // Use the correct type from the library: IDetectedBarcode[]
    const handleScan = (detectedCodes: IDetectedBarcode[]) => {
        try {
            if (isProcessing || !detectedCodes || detectedCodes.length === 0) {
                return;
            }

            const firstResult = detectedCodes[0];
            if (firstResult) {
                // The library provides the raw value directly, no need to parse rawValue property
                const qrData: QRCodeData = JSON.parse(firstResult.rawValue);

                if (qrData.studentId) {
                    setIsProcessing(true);
                    onStudentScanned(qrData.studentId);

                    // Reset processing state after a short delay
                    setTimeout(() => setIsProcessing(false), 1000);
                }
            }
        } catch (error) {
            //console.error('Error processing QR code:', error);
        }
    };

    const handleScannerError = (error: unknown) => {
        if (error instanceof Error) {
            //console.error('Scanner error:', error.message);
        }
    };

    return (
        <Stack>
            <Text size="sm" c="dimmed">
                Scan student QR code to record attendance as{' '}
                {attendanceStatus.toLowerCase()}
            </Text>

            <Scanner
                onScan={handleScan}
                onError={handleScannerError}
                constraints={{
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                }}
                styles={{
                    container: {
                        width: '100%',
                        height: '300px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                    },
                }}
            />

            {isProcessing && (
                <Text size="sm" c="blue" ta="center">
                    Processing QR code...
                </Text>
            )}
        </Stack>
    );
}

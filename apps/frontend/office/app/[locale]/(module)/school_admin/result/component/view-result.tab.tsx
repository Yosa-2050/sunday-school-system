'use client';

import {
    Box,
    Button,
    Flex,
    Group,
    ScrollArea,
    Select,
    Table,
    Text,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchSubjectsAssignmentApi } from '../../assign_subject/schemas/api';
import type { GetClass } from '../../classes/create/components/schema/fetchClassesDetail';
import { FetchTestBySubjectIdApi } from '../../test/schema/api';
import {} from '../../test/schema/type';
import { getResultViewApi } from '../schema/api';
import type { ResultViewResponse } from '../schema/type';

interface ResultViewProps {
    programId: string | null;
    classes: GetClass[];
    selectedClass: string | null;
    setSelectedClass: (classId: string | null) => void;
    selectedSection: string | null;
    setSelectedSection: (sectionId: string | null) => void;
}

export default function ResultView({
    programId,
    classes,
    selectedClass,
    setSelectedClass,
    selectedSection,
    setSelectedSection,
}: ResultViewProps) {
    const [resultViewData, setResultViewData] = useState<ResultViewResponse[]>(
        [],
    );
    const [loadingView, setLoadingView] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [selectedTest, setSelectedTest] = useState<string | null>(null);

    // fetch subjects when class/section changes
    const { data: subjects = [], isLoading: loadingSubjects } = useQuery({
        queryKey: ['subjects', selectedClass, selectedSection],
        queryFn: () =>
            fetchSubjectsAssignmentApi(selectedSection ?? selectedClass ?? ''),
        enabled: !!selectedClass,
        staleTime: 5 * 60 * 1000,
    });

    // fetch tests when subject changes
    const { data: tests = [], isLoading: loadingTests } = useQuery({
        queryKey: ['tests', selectedSubject],
        queryFn: () => FetchTestBySubjectIdApi(selectedSubject ?? ''),
        enabled: !!selectedSubject,
        staleTime: 5 * 60 * 1000,
    });

    const { refetch: fetchResultView } = useQuery({
        queryKey: ['resultView', selectedClass, selectedSection, selectedTest],
        queryFn: async () => {
            setLoadingView(true);
            try {
                const data = await getResultViewApi(
                    selectedClass ?? '',
                    selectedSubject ?? '',
                    selectedTest ?? '',
                );
                setResultViewData(data);
                return data;
            } finally {
                setLoadingView(false);
            }
        },
        enabled: false,
    });

    return (
        <Box pt="md">
            <Group mb="md" wrap="wrap">
                {/* Class */}
                <Box>
                    <Text size="sm" fw={500} mb={5}>
                        Select Class:
                    </Text>
                    <Select
                        placeholder="Choose class"
                        value={selectedClass}
                        onChange={setSelectedClass}
                        data={classes.map((c) => ({
                            value: c.id,
                            label: c.name,
                        }))}
                        style={{ width: 200 }}
                    />
                </Box>

                {selectedClass &&
                classes.find((c) => c.id === selectedClass)?.sections
                    ?.length ? (
                    <Box>
                        <Text size="sm" fw={500} mb={5}>
                            Select Section:
                        </Text>
                        <Select
                            placeholder="Choose section"
                            value={selectedSection}
                            onChange={setSelectedSection}
                            data={
                                classes
                                    .find((c) => c.id === selectedClass)
                                    ?.sections?.map((s) => ({
                                        value: s.id,
                                        label: s.name,
                                    })) ?? []
                            }
                            style={{ width: 200 }}
                        />
                    </Box>
                ) : null}

                <Box>
                    <Text size="sm" fw={500} mb={5}>
                        Select Subject:
                    </Text>
                    <Select
                        placeholder={
                            loadingSubjects ? 'Loading...' : 'Choose subject'
                        }
                        value={selectedSubject}
                        onChange={setSelectedSubject}
                        data={subjects.map((s) => ({
                            value: s.id,
                            label: s.subjectTitle,
                        }))}
                        style={{ width: 200 }}
                    />
                </Box>

                <Box>
                    <Text size="sm" fw={500} mb={5}>
                        Select Test:
                    </Text>
                    <Select
                        placeholder={
                            loadingSubjects ? 'Loading...' : 'Choose test'
                        }
                        value={selectedTest}
                        onChange={setSelectedTest}
                        data={tests.map((t) => ({
                            value: t.id,
                            label: t.name,
                        }))}
                        style={{ width: 200 }}
                    />
                </Box>

                <Box style={{ alignSelf: 'flex-end' }}>
                    <Button
                        onClick={() => fetchResultView()}
                        disabled={!selectedClass}
                        loading={loadingView}
                        style={{ marginTop: 25 }}
                    >
                        Load Result
                    </Button>
                </Box>
            </Group>

            {resultViewData.length > 0 && (
                <Box>
                    <Flex gap="md" align="flex-start">
                        {/* Student Info Table */}
                        <Box style={{ flex: '0 0 auto' }}>
                            <Table withColumnBorders withRowBorders striped>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th className="text-center">
                                            No
                                        </Table.Th>
                                        <Table.Th className="text-center">
                                            ID Number
                                        </Table.Th>
                                        <Table.Th className="text-center">
                                            Student
                                        </Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {resultViewData.map((result, index) => (
                                        <Table.Tr
                                            key={result.id}
                                            style={{ height: '53px' }}
                                        >
                                            <Table.Td className="text-center">
                                                {index + 1}
                                            </Table.Td>
                                            <Table.Td className="text-center">
                                                {result.idNumber}
                                            </Table.Td>
                                            <Table.Td className="text-center">
                                                {result.fullName}
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </Box>

                        {/* Scores Scrollable Table */}
                        <ScrollArea
                            scrollbars="x"
                            style={{ flex: '1', maxWidth: '70%' }}
                        >
                            <Table withColumnBorders withRowBorders striped>
                                <Table.Thead>
                                    <Table.Tr>
                                        {Object.keys(
                                            resultViewData[0]?.results || {},
                                        ).map((subject) => (
                                            <Table.Th
                                                key={subject}
                                                className="text-center"
                                                style={{ minWidth: '80px' }}
                                            >
                                                {subject}
                                            </Table.Th>
                                        ))}
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {resultViewData.map((student) => (
                                        <Table.Tr
                                            key={student.studentId}
                                            style={{ height: '53px' }}
                                        >
                                            {Object.entries(
                                                student.results ?? [],
                                            )?.map(([subject, score]) => (
                                                <Table.Td
                                                    key={subject}
                                                    className="text-center"
                                                    style={{
                                                        textAlign: 'center',
                                                        padding: '8px',
                                                        minWidth: '70px',
                                                    }}
                                                >
                                                    {score}
                                                </Table.Td>
                                            ))}
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </ScrollArea>

                        {/* Totals Table */}
                        <Box style={{ flex: '0 0 auto' }}>
                            <Table withColumnBorders withRowBorders striped>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th className="text-center">
                                            Total
                                        </Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {resultViewData.map((result) => (
                                        <Table.Tr
                                            key={result.id}
                                            style={{ height: '53px' }}
                                        >
                                            <Table.Td className="text-center">
                                                {result.totals}
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </Box>
                        <Box>
                            {!(resultViewData.length || loadingView) &&
                                selectedClass && (
                                    <Text ta="center" c="dimmed" mt="xl">
                                        No result records found for the selected
                                        class.
                                    </Text>
                                )}
                        </Box>
                    </Flex>
                </Box>
            )}
        </Box>
    );
}

'use client';

import {
    Box,
    Button,
    Group,
    Loader,
    Select,
    Table,
    Text,
    TextInput,
} from '@mantine/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchSubjectsAssignmentApi } from 'app/[locale]/(module)/school_admin/assign_subject/schemas/api';
import type { GetClass } from 'app/[locale]/(module)/school_admin/classes/create/components/schema/fetchClassesDetail';
import type { StudentResponse } from 'app/[locale]/(module)/school_admin/students/schemas/type';
import { useState } from 'react';
import { showError, showSuccess } from 'utilities/notification';
import { FetchTestBySubjectIdApi } from '../../test/schema/api';
import { saveResultApi } from '../schema/api';
import type { ResultRecord, ResultRequest } from '../schema/type';

interface ResultCreateProps {
    programId: string | null;
    classes: GetClass[];
    selectedClass: string | null;
    setSelectedClass: (classId: string | null) => void;
    selectedSection: string | null;
    setSelectedSection: (sectionId: string | null) => void;
    students: StudentResponse[];
    loadingStudents: boolean;
    handleFetchStudents: () => void;
}

export default function ResultCreate({
    programId,
    classes,
    selectedClass,
    setSelectedClass,
    selectedSection,
    setSelectedSection,
    students,
    loadingStudents,
    handleFetchStudents,
}: ResultCreateProps) {
    const [scores, setScores] = useState<Record<string, string>>({});
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [selectedTest, setSelectedTest] = useState<string | null>(null);

    // fetch subjects when class/section changes
    const { data: subjects = [], isLoading: loadingSubjects } = useQuery({
        queryKey: ['subjects', selectedClass, selectedSection],
        queryFn: () =>
            fetchSubjectsAssignmentApi(selectedSection ?? selectedClass ?? ''),
        enabled: !!selectedClass, // only fetch when a class is selected
        staleTime: 5 * 60 * 1000, // cache for 5 minutes
    });

    // fetch tests when subject changes
    const { data: tests = [], isLoading: loadingTests } = useQuery({
        queryKey: ['tests', selectedSubject],
        queryFn: () => FetchTestBySubjectIdApi(selectedSubject ?? ''),
        enabled: !!selectedSubject, // only fetch when a subject is selected
        staleTime: 5 * 60 * 1000, // cache for 5 minutes
    });

    const saveResult = useMutation({
        mutationFn: async () => {
            if (!selectedTest) {
                throw new Error('Test is required');
            }
            //change it for result
            const resultRecords: ResultRecord[] = students.map((student) => ({
                studentId: student.id,
                score: Number(scores[student.id] || 0),
            }));

            const resultData: ResultRequest = {
                testId: selectedTest,
                result: resultRecords,
                selectedTest,
            };

            return saveResultApi(resultData);
        },
        onSuccess: () => {
            showSuccess('Result saved successfully');
            setScores({});
            setSelectedSubject(null); // reset subject after save
        },
        onError: (error) => {
            showError(error.message);
        },
    });

    const handleScoreChange = (studentId: string, value: string) => {
        setScores((prev) => ({
            ...prev,
            [studentId]: value,
        }));
    };

    const rows = students.map((student, index) => {
        return (
            <Table.Tr key={student.id}>
                <Table.Td className="text-center">{index + 1}</Table.Td>
                <Table.Td className="text-center hidden sm:table-cell">
                    {student.idNumber}
                </Table.Td>
                <Table.Td className="text-center w-40">
                    {student.firstName} {student.lastName}
                </Table.Td>
                <Table.Td className="hidden md:table-cell">
                    <TextInput
                        size="xs"
                        placeholder="score"
                        type="number"
                        value={scores[student.id] || ''}
                        onChange={(e) =>
                            handleScoreChange(student.id, e.target.value)
                        }
                    />
                </Table.Td>
            </Table.Tr>
        );
    });

    const disableButtons =
        !selectedClass ||
        (!!classes?.find((c) => c.id === selectedClass)?.sections?.length &&
            !selectedSection);
    return (
        <Box pt="md">
            <Group mb="md" align="flex-end">
                {/* Class Selection */}
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

                {/* Section Selection (conditionally shown) */}
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

                {/* Subject Selection (populated dynamically) */}
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
                        disabled={loadingSubjects || !subjects.length}
                    />
                </Box>

                {/* Test Selection (populated dynamically) */}
                <Box>
                    <Text size="sm" fw={500} mb={5}>
                        Select Test:
                    </Text>
                    <Select
                        placeholder={
                            loadingSubjects ? 'Loading...' : 'Choose subject'
                        }
                        value={selectedTest}
                        onChange={setSelectedTest}
                        data={tests.map((t) => ({
                            value: t.id,
                            label: t.name,
                        }))}
                        style={{ width: 200 }}
                        disabled={loadingSubjects || !subjects.length}
                    />
                </Box>

                {/* Load Button */}
                <Button
                    variant="light"
                    onClick={handleFetchStudents}
                    disabled={disableButtons}
                >
                    Load Students
                </Button>

                {/* Student Table */}
                <Table
                    className="mt-4 border shadow w-full h-full bg-white"
                    withColumnBorders
                    withRowBorders
                    withTableBorder
                    striped
                    highlightOnHover
                >
                    <Table.Thead>
                        <Table.Tr className="text-center">
                            <Table.Th className="text-center">No</Table.Th>
                            <Table.Th className="text-center hidden sm:table-cell">
                                ID Number
                            </Table.Th>
                            <Table.Th className="text-center w-40">
                                Student
                            </Table.Th>
                            <Table.Th className="text-center hidden md:table-cell">
                                Scores
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {loadingStudents ? (
                            <Table.Tr>
                                <Table.Td colSpan={5} className="text-center">
                                    <Loader size="sm" />
                                </Table.Td>
                            </Table.Tr>
                        ) : (
                            rows
                        )}
                    </Table.Tbody>
                </Table>
            </Group>

            <Group justify="center" mt="md">
                <Button
                    onClick={() => saveResult.mutate()}
                    disabled={
                        !(students.length && selectedSubject) ||
                        Object.keys(scores).length === 0
                    }
                    loading={saveResult.isPending}
                >
                    Save Result
                </Button>
            </Group>
        </Box>
    );
}

import { RichTextInput } from '@/components/form/rich-text-input/RichTextInput';
import { Text } from '@mantine/core';
import { memo } from 'react';
import type { ControllerRenderProps, FieldError } from 'react-hook-form';

interface MemoizedRichTextEditorProps {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    field: ControllerRenderProps<any, any>;
    error: FieldError;
    label: string;
    placeholder: string;
}

export const MemoizedRichTextEditor = memo(
    ({ field, error, label, placeholder }: MemoizedRichTextEditorProps) => {
        return (
            <div className="relative mt-3">
                <Text fw={500} size="sm" mb={5}>
                    {label}{' '}
                    {label === 'Job Description' && (
                        <Text component="span" color="red" size="sm">
                            *
                        </Text>
                    )}
                </Text>

                <RichTextInput
                    withAsterisk
                    className="w-full"
                    label="Description"
                    field={field}
                    error={error}
                />

                {label === 'Job Description' && (
                    <Text size="xs" mt={5} color="dimmed">
                        Include key responsibilities, qualifications, and what
                        makes this role unique.
                    </Text>
                )}
            </div>
        );
    },
);

MemoizedRichTextEditor.displayName = 'MemoizedRichTextEditor';

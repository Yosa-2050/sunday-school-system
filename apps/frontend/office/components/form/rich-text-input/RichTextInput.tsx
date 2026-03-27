'use client';

import { Box, Button, Input, Menu } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Link, RichTextEditor } from '@mantine/tiptap';
import HardBreak from '@tiptap/extension-hard-break';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';

import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import type { ControllerRenderProps, FieldError } from 'react-hook-form';
import { cn } from 'utilities/cn';
import CustomHeading from './control/CustomHeading';
import HardbreakControl from './control/HardbreakControl';
import { IframeControl } from './control/IframeControl';
import { ImageControl } from './control/ImageControl';
import { TableControl } from './control/TableControl';
import { YoutubeControl } from './control/YoutubeControl';
import { Iframe } from './control/iframeExtension';

type RichTextInputProps = {
    field: ControllerRenderProps<any, any>;
    label?: React.ReactNode;
    error?: FieldError;
    className?: string;
    withAsterisk?: boolean;
    mode?: 'small' | 'large';
    withOnUpdate?: boolean;
    placeholder?: string;
};

export function RichTextInput({
    field,
    label,
    error,
    className,
    withAsterisk,
    mode = 'large',
    withOnUpdate = false,
    placeholder,
}: RichTextInputProps) {
    const { value, onChange } = field;
    const isMobile = useMediaQuery('(max-width: 768px)');

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: { HTMLAttributes: { class: 'list-disc' } },
                orderedList: { HTMLAttributes: { class: 'list-decimal' } },
            }),

            HardBreak.configure({ keepMarks: false }),
            Underline,
            Link.configure({ HTMLAttributes: { class: 'text-blue-500' } }),
            Superscript,
            SubScript,
            Highlight,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({
                placeholder: placeholder ?? 'This is placeholder',
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
                HTMLAttributes: { class: 'w-full h-auto my-3' },
            }),
            Youtube.configure({ HTMLAttributes: { class: 'w-full py-4' } }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'w-[500px] h-[200px] border border-gray-200 border-black mb-4 focus:outline-hidden focus:ring-2 focus:ring-blue-500',
                },
            }),
            TableRow.configure({
                HTMLAttributes: {
                    class: 'border border-gray-300',
                },
            }),
            TableCell.configure({
                HTMLAttributes: {
                    class: 'border border-gray-300 p-2 min-h-[50px] w-[100px]',
                },
            }),
            TableHeader.configure({
                HTMLAttributes: {
                    class: 'border border-gray-300 p-2 bg-gray-100 font-semibold',
                },
            }),
            CustomHeading,
            Iframe,
        ],
        content: value || '',
        onUpdate: ({ editor }) => {
            return onChange(editor?.getHTML() ?? '<p></p>');
        },
        onBlur: (props) => onChange(props?.editor?.getHTML() ?? '<p></p>'),
    });

    return (
        <Input.Wrapper
            error={<Box mt={'xs'}>{error?.message?.toString()}</Box>}
            label={label}
            withAsterisk={withAsterisk}
            className={cn(className)}
        >
            <RichTextEditor editor={editor} style={{ height: '400px' }}>
                <RichTextEditor.Toolbar
                    sticky
                    stickyOffset={60}
                    className="bg-white"
                >
                    {isMobile ? (
                        <div className="flex flex-wrap items-center gap-2">
                            {<RichTextEditor.Bold />}
                            {<RichTextEditor.Italic />}
                            {<RichTextEditor.Code />}
                            {<RichTextEditor.Underline />}
                            {<RichTextEditor.Strikethrough />}
                            {<RichTextEditor.ClearFormatting />}
                            {<RichTextEditor.Highlight />}
                            {<RichTextEditor.BulletList />}
                            {<RichTextEditor.OrderedList />}
                            {<RichTextEditor.Link />}
                            {
                                <Menu width="full">
                                    <Menu.Target>
                                        <Button size="xs" variant="outline">
                                            ...
                                        </Button>
                                    </Menu.Target>
                                    <Menu.Dropdown className="border-1 mx-5 grid grid-cols-6 gap-2 border-gray-500 p-2">
                                        {<RichTextEditor.H1 />}
                                        {<RichTextEditor.H2 />}
                                        {<RichTextEditor.H3 />}
                                        {<RichTextEditor.H4 />}

                                        {<RichTextEditor.AlignLeft />}
                                        {<RichTextEditor.AlignCenter />}
                                        {<RichTextEditor.AlignJustify />}
                                        {<RichTextEditor.AlignRight />}
                                        {<RichTextEditor.Subscript />}
                                        {<RichTextEditor.Superscript />}
                                        {editor && (
                                            <HardbreakControl editor={editor} />
                                        )}

                                        {mode === 'large' && (
                                            <>
                                                {<RichTextEditor.Undo />}
                                                {<RichTextEditor.Redo />}
                                                <RichTextEditor.ControlsGroup>
                                                    {
                                                        <RichTextEditor.ControlsGroup>
                                                            <TableControl
                                                                editor={editor}
                                                            />
                                                        </RichTextEditor.ControlsGroup>
                                                    }
                                                    <RichTextEditor.ControlsGroup className="mx-2">
                                                        {<ImageControl />}
                                                        {<YoutubeControl />}

                                                        {<IframeControl />}
                                                    </RichTextEditor.ControlsGroup>
                                                </RichTextEditor.ControlsGroup>
                                            </>
                                        )}
                                    </Menu.Dropdown>
                                </Menu>
                            }
                        </div>
                    ) : (
                        <>
                            <RichTextEditor.ControlsGroup>
                                {<RichTextEditor.Bold />}
                                {<RichTextEditor.Italic />}
                                {<RichTextEditor.Code />}
                                {<RichTextEditor.Underline />}
                                {<RichTextEditor.Strikethrough />}
                                {<RichTextEditor.ClearFormatting />}
                                {<RichTextEditor.Highlight />}
                                {<RichTextEditor.BulletList />}
                                {<RichTextEditor.OrderedList />}
                            </RichTextEditor.ControlsGroup>
                            <RichTextEditor.ControlsGroup>
                                {<RichTextEditor.H1 />}
                                {<RichTextEditor.H2 />}
                                {<RichTextEditor.H3 />}
                                {<RichTextEditor.H4 />}
                            </RichTextEditor.ControlsGroup>
                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Link />
                                <RichTextEditor.Unlink />
                                <RichTextEditor.Blockquote />
                            </RichTextEditor.ControlsGroup>
                            <RichTextEditor.ControlsGroup>
                                {<RichTextEditor.AlignLeft />}
                                {<RichTextEditor.AlignCenter />}
                                {<RichTextEditor.AlignJustify />}
                                {<RichTextEditor.AlignRight />}
                            </RichTextEditor.ControlsGroup>
                            <RichTextEditor.ControlsGroup>
                                {<RichTextEditor.Subscript />}
                                {<RichTextEditor.Superscript />}
                            </RichTextEditor.ControlsGroup>
                            {editor && <HardbreakControl editor={editor} />}
                            {mode === 'large' && (
                                <>
                                    {
                                        <RichTextEditor.ControlsGroup>
                                            <TableControl editor={editor} />
                                        </RichTextEditor.ControlsGroup>
                                    }
                                    <RichTextEditor.ControlsGroup>
                                        {<ImageControl />}
                                        {<YoutubeControl />}
                                        {<IframeControl />}
                                    </RichTextEditor.ControlsGroup>
                                    <RichTextEditor.ControlsGroup>
                                        {<RichTextEditor.Undo />}
                                        {<RichTextEditor.Redo />}
                                    </RichTextEditor.ControlsGroup>
                                </>
                            )}
                        </>
                    )}
                </RichTextEditor.Toolbar>
                <RichTextEditor.Content />
            </RichTextEditor>
        </Input.Wrapper>
    );
}

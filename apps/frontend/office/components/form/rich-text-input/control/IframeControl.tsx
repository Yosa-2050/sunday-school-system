import { Button, Modal, Stack, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';
import { IconExternalLink } from '@tabler/icons-react';
import { useState } from 'react';

export function IframeControl() {
    const { editor } = useRichTextEditorContext();
    const [opened, { open, close }] = useDisclosure(false);
    const [iframeTag, setIframeTag] = useState('');

    const handleOpen = () => {
        const oldIframeTag = editor?.getAttributes('iframe').src ?? '';
        setIframeTag(oldIframeTag);
        open();
    };

    const isValidIframeTag = (input: string) => {
        const iframePattern = /^<iframe.*src="https?:\/\/.*".*><\/iframe>$/;
        return iframePattern.test(input);
    };

    // Function to make iframe responsive
    const makeIframeResponsive = (iframe: string) => {
        const srcMatch = iframe.match(/src="([^"]+)"/);

        if (!srcMatch) {
            return iframe;
        }

        const src = srcMatch[1];

        return `
      
        <iframe 
          src="${src}" 
          style=" top: 0; left: 0; width: 95%; height: 480px; border: 0; margin: 0 auto; display: block;"
          allowfullscreen 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      
    `;
    };

    const handleAdd = () => {
        if (iframeTag && isValidIframeTag(iframeTag) && editor) {
            const responsiveIframeTag = makeIframeResponsive(iframeTag);
            editor.chain().focus().insertContent(responsiveIframeTag).run();

            close();
            setIframeTag('');
        }
    };

    const handleClose = () => {
        close();
        setIframeTag('');
    };

    return (
        <>
            <RichTextEditor.Control
                onClick={handleOpen}
                aria-label="Insert Iframe"
                title="Insert Iframe"
                style={{
                    ...(editor?.isActive('iframe')
                        ? {
                              backgroundColor:
                                  'var(--mantine-primary-color-light)',
                              color: 'var(--mantine-primary-color-light-color)',
                          }
                        : {}),
                }}
            >
                <IconExternalLink stroke={1.5} size="1rem" />
            </RichTextEditor.Control>
            <Modal opened={opened} onClose={handleClose} title="Insert Iframe">
                <Stack>
                    <TextInput
                        label="Iframe Tag"
                        placeholder="Enter the full iframe tag"
                        value={iframeTag}
                        onChange={(event) =>
                            setIframeTag(event.currentTarget.value)
                        }
                    />
                    <Button size="xs" onClick={handleAdd}>
                        Add
                    </Button>
                </Stack>
            </Modal>
        </>
    );
}

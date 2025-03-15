import { Button, Modal, Stack, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';
import { IconPhoto } from '@tabler/icons-react';
import { useState } from 'react';

export function ImageControl() {
  const { editor } = useRichTextEditorContext();
  const [opened, { open, close }] = useDisclosure(false);
  const [url, setUrl] = useState('');

  const handleOpen = () => {
    const oldUrl = editor?.getAttributes('image').src ?? '';

    setUrl(oldUrl);
    open();
  };

  const handleAdd = () => {
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
    close();
    setUrl('');
  };

  const handleClose = () => {
    close();
    setUrl('');
  };

  return (
    <>
      <RichTextEditor.Control
        onClick={handleOpen}
        aria-label="Insert Image"
        title="Insert Image"
        style={{
          ...(editor?.isActive('image')
            ? {
                backgroundColor: 'var(--mantine-primary-color-light)',
                color: 'var(--mantine-primary-color-light-color)',
              }
            : {}),
        }}
      >
        <IconPhoto stroke={1.5} size="1rem" />
      </RichTextEditor.Control>
      <Modal opened={opened} onClose={handleClose} title="Image">
        <Stack>
          <TextInput
            label="URL"
            placeholder="https://example.com/image.jpg"
            value={url}
            onChange={(event) => setUrl(event.currentTarget.value)}
          />
          <Button size="xs" onClick={handleAdd}>
            Add
          </Button>
        </Stack>
      </Modal>
    </>
  );
}

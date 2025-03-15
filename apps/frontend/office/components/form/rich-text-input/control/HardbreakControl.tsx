import { RichTextEditor } from '@mantine/tiptap';
import { IconPageBreak } from '@tabler/icons-react';
import type { Editor } from '@tiptap/react';
interface HardbreakControlProps {
    editor: Editor;
}

const HardbreakControl: React.FC<HardbreakControlProps> = ({ editor }) => {
    const handleHardbreak = (e: React.MouseEvent) => {
        e.preventDefault();
        if (editor) {
            editor.chain().focus().setHardBreak().run();
        }
    };

    return (
        <RichTextEditor.Control
            onClick={handleHardbreak}
            disabled={!editor}
            aria-label="Insert Youtube Video"
            title="Insert Youtube Video"
            style={{
                ...(editor?.isActive('image')
                    ? {
                          backgroundColor: 'var(--mantine-primary-color-light)',
                          color: 'var(--mantine-primary-color-light-color)',
                      }
                    : {}),
            }}
        >
            <IconPageBreak size="1.1rem" stroke={1.5} />
        </RichTextEditor.Control>
    );
};

export default HardbreakControl;

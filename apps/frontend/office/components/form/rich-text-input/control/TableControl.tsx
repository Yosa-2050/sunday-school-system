import { RichTextEditor } from '@mantine/tiptap';
import {
  IconColumnInsertRight,
  IconFreezeRow,
  IconRowInsertBottom,
  IconTable,
  IconTableMinus,
  IconTrash,
} from '@tabler/icons-react';
import type { Editor } from '@tiptap/react';

type TableControlProps = {
  editor: Editor | null;
};

export function TableControl({ editor }: TableControlProps) {
  if (!editor) {
    return null;
  }

  const handleInsertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 2, cols: 2, withHeaderRow: true })
      .run();
  };

  return (
    <div className="flex items-center">
      <RichTextEditor.Control
        aria-label="Insert table"
        onClick={handleInsertTable}
        disabled={!editor.can().insertTable()}
      >
        <IconTable size={16} />
      </RichTextEditor.Control>

      <RichTextEditor.Control
        aria-label="Add column"
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        disabled={!editor.can().addColumnAfter()}
      >
        <IconColumnInsertRight size={16} />
      </RichTextEditor.Control>

      <RichTextEditor.Control
        aria-label="Add row"
        onClick={() => editor.chain().focus().addRowAfter().run()}
        disabled={!editor.can().addRowAfter()}
      >
        <IconRowInsertBottom size={16} />
      </RichTextEditor.Control>

      <RichTextEditor.Control
        aria-label="Delete column"
        onClick={() => editor.chain().focus().deleteColumn().run()}
        disabled={!editor.can().deleteColumn()}
      >
        <IconTableMinus size={16} />
      </RichTextEditor.Control>

      <RichTextEditor.Control
        aria-label="Delete row"
        onClick={() => editor.chain().focus().deleteRow().run()}
        disabled={!editor.can().deleteRow()}
      >
        <IconFreezeRow size={16} />
      </RichTextEditor.Control>

      <RichTextEditor.Control
        aria-label="Delete table"
        onClick={() => editor.chain().focus().deleteTable().run()}
        disabled={!editor.can().deleteTable()}
      >
        <IconTrash size={16} />
      </RichTextEditor.Control>
    </div>
  );
}

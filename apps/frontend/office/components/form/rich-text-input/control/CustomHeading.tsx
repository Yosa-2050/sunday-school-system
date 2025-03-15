import { mergeAttributes } from '@tiptap/core';
import { Heading } from '@tiptap/extension-heading';

const CustomHeading = Heading.extend({
  addAttributes() {
    return {
      class: {
        default: '',
      },
    };
  },
  renderHTML({ node }) {
    const level = node.attrs.level;

    const classes = {
      1: 'text-4xl font-bold text-gray-900 mb-4',
      2: 'text-3xl font-semibold text-gray-800 mb-3',
      3: 'text-2xl font-medium text-gray-700 mb-2',
      4: 'text-xl font-normal text-gray-600 mb-1',
    };

    return [
      `h${level}`,
      mergeAttributes(this.options.HTMLAttributes, {
        class: classes[level as 1 | 2 | 3 | 4],
      }),
      0,
    ];
  },
});

export default CustomHeading;

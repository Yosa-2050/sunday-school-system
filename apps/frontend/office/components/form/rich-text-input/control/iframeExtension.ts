import { Node, mergeAttributes, nodePasteRule } from '@tiptap/core';

export interface IframeOptions {
  addPasteHandler: boolean;
  allowFullscreen: boolean;
  height: number;
  width: number;

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  HTMLAttributes: Record<string, any>;
  inline: boolean;
  src: string;
  style?: string;
  loading?: string;
  referrerpolicy?: string;
}

type SetIframeOptions = {
  src: string;
  width?: number;
  height?: number;
  style?: string;
  loading?: string;
  referrerpolicy?: string;
};

// Helper function to clean up the src link
const trimSrcLink = (src: string) => src.trim();

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const getEmbedUrlFromSrc = ({ src }: any) => trimSrcLink(src);

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iframe: {
      setIframe: (options: SetIframeOptions) => ReturnType;
    };
  }
}

export const Iframe = Node.create<IframeOptions>({
  name: 'iframe',

  // Define default options
  addOptions() {
    return {
      addPasteHandler: true, // Enable paste handling for iframes
      allowFullscreen: true, // Enable fullscreen by default
      height: 480, // Default iframe height
      width: 640, // Default iframe width
      HTMLAttributes: {}, // Custom HTML attributes for the iframe
      inline: false, // Iframe is block-level by default
      src: '', // Empty default source URL
      style: 'border:0; ', // Default styling for the iframe with margin added
      loading: 'lazy', // Default loading behavior
      referrerpolicy: 'no-referrer-when-downgrade', // Default referrer policy
    };
  },

  inline() {
    return this.options.inline;
  },

  group() {
    return this.options.inline ? 'inline' : 'block';
  },

  draggable: true,

  // Define the iframe attributes
  addAttributes() {
    return {
      src: { default: null },
      width: { default: this.options.width },
      height: { default: this.options.height },
      style: { default: this.options.style },
      loading: { default: this.options.loading },
      referrerpolicy: { default: this.options.referrerpolicy },
    };
  },

  // Parse HTML for iframe tag and src attribute
  parseHTML() {
    return [{ tag: 'iframe' }, { tag: 'iframe[src]' }];
  },

  // Add commands to handle iframe insertion
  addCommands() {
    return {
      setIframe:
        (options: SetIframeOptions) =>
        ({ commands }) => {
          const trimmedSrc = trimSrcLink(options.src);
          if (!trimmedSrc) {
            return false;
          }
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },

  // Add paste handling for iframe HTML
  addPasteRules() {
    return this.options.addPasteHandler
      ? [
          nodePasteRule({
            find: /<iframe[^>]*src=["']([^"']+)["'][^>]*>/g, // Regex to find iframe with src
            type: this.type,
            getAttributes: (match) => {
              return { src: match[1] }; // Capture the src attribute from iframe
            },
          }),
        ]
      : [];
  },

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    const embedUrl = getEmbedUrlFromSrc({
      src: HTMLAttributes.src,
    });

    // Ensure margin and styles are applied
    const iframeStyle = HTMLAttributes.style || this.options.style;

    return [
      'iframe', // Render the iframe tag
      mergeAttributes(
        this.options.HTMLAttributes,
        {
          width: HTMLAttributes.width || this.options.width,
          height: HTMLAttributes.height || this.options.height,
          allowfullscreen: this.options.allowFullscreen,
          style: iframeStyle, // Apply margin in style
          loading: this.options.loading,
          referrerpolicy: this.options.referrerpolicy,
        },
        { ...HTMLAttributes, src: embedUrl },
      ),
    ];
  },
});

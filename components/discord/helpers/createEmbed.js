import { isRequired, hasValidURL } from '~/utilities/validators.js';
export default function createEmbed() {
  return {
    author: {
      author: {
        type: 'v-text-field',
        columns: {
          md: 12,
        },
        props: {
          filled: true,
          label: 'Author',
          rules: [],
          counter: 256,
        },

        value: '',
      },
      authorURL: {
        type: 'v-text-field',
        columns: {
          md: 6,
          cols: 12,
        },
        props: {
          filled: true,
          rules: [hasValidURL('AuthorURL')],
          label: 'AuthorURL',
        },
        value: '',
      },
      authorIconURL: {
        type: 'v-text-field',
        columns: {
          md: 6,
          cols: 12,
        },
        props: {
          filled: true,
          label: 'AuthorIconURL',
          rules: [hasValidURL('AuthorIconURL')],
        },

        value: '',
      },
    },
    body: {
      title: {
        type: 'v-text-field',
        columns: {
          md: 12,
          cols: 12,
        },
        props: {
          counter: 256,
          filled: true,
          label: 'Title',
          rules: [isRequired('Title')],
        },
        emoji: {
          tag: 'input',
        },
        value: '',
      },
      description: {
        type: 'v-textarea',
        columns: {
          md: 12,
          cols: 12,
        },
        props: {
          counter: 4096,
          filled: true,
          label: 'Description',
          rules: [],
        },
        emoji: {
          tag: 'textarea',
        },
        value: '',
      },
      url: {
        type: 'v-text-field',
        props: {
          filled: true,
          label: 'URL',
          rules: [hasValidURL('Field')],
        },
        columns: {
          md: 6,
          cols: 12,
        },
        value: '',
      },
      color: {
        type: 'v-color-picker',
        props: {
          filled: true,
          label: 'Color',
          rules: [],
        },
        columns: {
          md: 6,
          cols: 12,
        },
        value: '#555555',
      },
    },
    fields: {
      valid: true,
      items: [],
    },
    images: {
      image: {
        type: 'v-text-field',
        columns: {
          md: 12,
        },
        props: {
          filled: true,

          label: 'Image',
          rules: [hasValidURL('Image')],
        },
        value: '',
      },
      thumbnailURL: {
        type: 'v-text-field',
        columns: {
          md: 12,
        },
        props: {
          filled: true,
          label: 'Thumbnail URL',
          rules: [hasValidURL('ThumbnailURL')],
        },
        value: '',
      },
    },
    footer: {
      footer: {
        type: 'v-textarea',
        props: {
          rows: 1,
          rules: [],
          filled: true,
          label: 'Footer',
        },
        columns: {
          cols: 12,
        },
        emoji: {
          tag: 'textarea',
        },
        value: '',
      },
      timestamp: {
        type: 'v-date-picker',
        props: {
          filled: true,
          label: 'Timestamp',
          rules: [],
        },
        columns: {
          cols: 12,
          md: 6,
        },
        value: '',
      },
      footerIconURL: {
        type: 'v-text-field',
        props: {
          filled: true,
          label: 'Footer Icon URL',
          rules: [hasValidURL('FooterIconURL')],
        },
        columns: {
          cols: 12,
          md: 6,
        },
        value: '',
      },
    },
  };
}

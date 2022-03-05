export default {
  props: {
    fileSize: {
      type: [Number, String],
      default: 120000,
    },
    exts: {
      type: Array,
      default: () => ['jpe?g', 'png', 'gif', 'svg', 'webp'],
    },
    maxThumbnailWidth: {
      type: [Number, String],
      default: undefined,
    },
    maxThumbnailHeight: {
      type: [Number, String],
      default: undefined,
    },
    minThumbnailWidth: {
      type: [Number, String],
      default: undefined,
    },
    minThumbnailHeight: {
      type: [Number, String],
      default: undefined,
    },
    minWidth: {
      type: [Number, String],
      default: undefined,
    },
    minHeight: {
      type: [Number, String],
      default: undefined,
    },
    maxWidth: {
      type: [Number, String],
      default: undefined,
    },
    maxHeight: {
      type: [Number, String],
      default: undefined,
    },
  },

  computed: {
    approvedExts() {
      const types = `\\.(${this.exts.join('|')})$`;
      return new RegExp(types, 'i');
    },
  },
};

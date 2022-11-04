<template>
  <div
    class="discord-message-embed-field"
    :style="{ 'grid-column': getFieldGridColumn }"
  >
    <div class="discord-field-name">
      <div class="discord-field-name-text" v-html="fieldName"></div>
    </div>
    <div class="discord-field-body">
      <div class="discord-field-body-text" v-html="fieldBody"></div>
    </div>
  </div>
</template>

<script>
import marked from '~/utilities/discordMarked.js';
import * as DOMPurify from 'dompurify';

export default {
  name: 'DiscordEmbedField',

  props: {
    fields: {
      type: Array,
      default: () => [],
    },
    field: {
      type: Object,
      default: () => {},
    },
    fieldIndex: {
      type: Number,
      default: 0,
    },
    maxFieldsPerRow: {
      type: Number,
      default: 3,
    },
    fieldGridSize: {
      type: Number,
      default: 12,
    },
  },

  methods: {
    sanitizeAndConvertToMD(text) {
      return DOMPurify.sanitize(marked.parse(text), {
        ALLOWED_TAGS: ['br'],
        ALLOWED_ATTRS: [],
        FORBID_TAGS: ['p'],
      });
    },
  },

  computed: {
    fieldName() {
      return this.sanitizeAndConvertToMD(this.field.name.value);
    },

    fieldBody() {
      return this.sanitizeAndConvertToMD(this.field.value);
    },

    getFieldGridColumn() {
      if (!this.field.inline) return `1 / ${this.fieldGridSize + 1}`;
      let startField = this.fieldIndex;
      while (startField > 0 && this.fields[startField - 1].inline) {
        startField -= 1;
      }

      let totalInlineFields = 0;
      while (
        this.fields.length > startField + totalInlineFields &&
        this.fields[startField + totalInlineFields].inline
      ) {
        totalInlineFields += 1;
      }

      const indexInSequence = this.fieldIndex - startField;
      const currentRow = indexInSequence / this.maxFieldsPerRow;
      const indexOnRow = indexInSequence % this.maxFieldsPerRow;
      const totalOnLastRow =
        totalInlineFields % this.maxFieldsPerRow || this.maxFieldsPerRow;
      const fullRows =
        (totalInlineFields - totalOnLastRow) / this.maxFieldsPerRow;
      const totalOnRow =
        currentRow >= fullRows ? totalOnLastRow : this.maxFieldsPerRow;

      const columnSpan = this.fieldGridSize / totalOnRow;
      const start = indexOnRow * columnSpan + 1;
      const end = start + columnSpan;

      return `${start} / ${end}`;
    },
  },
};
</script>

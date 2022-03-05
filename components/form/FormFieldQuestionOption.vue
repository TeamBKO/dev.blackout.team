<template>
  <v-col cols="8">
    <v-text-field
      v-model="computedValue"
      :placeholder="label"
      :label="label"
      @focus="addOption"
    >
      <template #append-outer>
        <slot />
      </template>
    </v-text-field>
  </v-col>
</template>

<script>
export default {
  name: 'QuestionOptional',

  props: {
    value: {
      type: [String, Number, Boolean],
    },
    idx: Number,
    length: {
      type: Number,
    },
  },

  methods: {
    addOption() {
      if (this.isLast) {
        this.$emit('addOption');
      }
    },
  },

  computed: {
    label() {
      return `Option ${this.idx + 1}`;
    },
    isLast() {
      return this.idx === this.length;
    },
    computedValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>

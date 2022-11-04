<template>
  <v-dialog
    v-model="openDialog"
    :width="width"
    :height="height"
    :min-width="minWidth"
    :max-width="maxWidth"
    :min-height="minHeight"
    :max-height="maxHeight"
    :dark="dark"
  >
    <template #activator="props">
      <slot name="activator" v-bind="props" />
    </template>
    <v-card
      :width="width"
      :height="height"
      :min-width="minWidth"
      :max-width="maxWidth"
      :min-height="minHeight"
      :max-height="maxHeight"
    >
      <v-card-title v-if="!$scopedSlots.title">
        <span>{{ title }}</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <slot name="title" />
      <v-card-text>
        <slot />
      </v-card-text>
      <v-card-actions v-if="!$scopedSlots.action">
        <v-spacer></v-spacer>
        <v-btn text :disabled="disabled" @click="onConfirm">{{
          confirmButtonText
        }}</v-btn>
        <v-btn text @click="closeDialog">{{ cancelButtonText }}</v-btn>
      </v-card-actions>
      <slot name="actions" />
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'BaseDialog',

  props: {
    confirmButtonText: {
      type: String,
      default: 'Confirm',
    },
    cancelButtonText: {
      type: String,
      default: 'Cancel',
    },
    title: {
      type: String,
      default: 'BaseDialog',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    dark: {
      type: Boolean,
      default: false,
    },
    width: {
      type: [String, Number],
      default: '400px',
    },
    height: {
      type: [String, Number],
      default: '300px',
    },
    minWidth: {
      type: [String, Number],
    },
    maxWidth: {
      type: [String, Number],
    },
    minHeight: {
      type: [String, Number],
    },
    maxHeight: {
      type: [String, Number],
    },
  },

  data() {
    return {
      open: false,
    };
  },

  methods: {
    closeDialog() {
      this.openDialog = false;
      this.$emit('close');
    },
    onConfirm() {
      this.$emit('confirm');
      this.openDialog = false;
    },
  },

  computed: {
    openDialog: {
      get() {
        return this.value || this.open;
      },
      set(value) {
        this.$emit('input', value);
        this.open = value;
      },
    },
  },
};
</script>

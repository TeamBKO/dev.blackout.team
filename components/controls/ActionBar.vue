<template>
  <v-snackbar
    bottom
    v-model="open"
    :timeout="-1"
    :transition="actionBarTransition"
  >
    {{ text }}
    <template #action="{ attrs }">
      <v-btn
        color="primary"
        :disabled="disablePrimaryButton"
        text
        v-bind="attrs"
        @click="$emit('save')"
        >Save</v-btn
      >
      <v-btn text :disabled="disableSecondaryButton" @click="$emit('reset')"
        >Reset</v-btn
      >
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: 'ActionBar',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    text: {
      type: [Number, String],
      default: 'There are unsaved changes.',
    },
    transition: {
      type: String,
      default: 'scroll-y-reverse-transition',
    },
    disable: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    disablePrimaryButton() {
      return !this.open || this.disable;
    },
    disableSecondaryButton() {
      return !this.open;
    },
    actionBarTransition() {
      return this.open ? 'scroll-y-reverse-transition' : 'scroll-y-transition';
    },
    open: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit('input', v);
      },
    },
  },
};
</script>

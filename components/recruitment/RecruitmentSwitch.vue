<template>
  <v-switch v-model="computedValue"></v-switch>
</template>

<script>
import lists from '~/constants/lists/public.js';
export default {
  name: 'RecruitmentSwitch',

  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    computedValue: {
      get() {
        return this.item.enable_recruitment;
      },
      set(value) {
        const details = { enable_recruitment: !this.item.enable_recruitment };
        this.$store.dispatch(lists.actions.EDIT_ITEM, {
          id: this.item.id,
          route: 'categories',
          details,
        });
      },
    },
  },
};
</script>

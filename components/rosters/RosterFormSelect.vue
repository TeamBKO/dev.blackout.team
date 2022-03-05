<template>
  <v-select
    label="Select a form"
    :items="forms"
    :item-text="'name'"
    :item-value="'id'"
  >
    <template #append-item v-if="forms.length && hasMore">
      <div
        v-intersect.quiet="{
          options: {
            threshold: 1.0,
          },
          handler: onIntersect,
        }"
      >
        <v-progress-circular indeterminate v-if="loading"></v-progress-circular>
      </div>
    </template>
  </v-select>
</template>

<script>
import FORMS from '~/constants/forms/public.js';
export default {
  name: 'RosterFormSelect',

  props: {
    value: {
      type: [String, Number],
    },
  },

  methods: {
    onIntersect(observer, entries, isIntersecting) {
      if (isIntersecting && this.forms.length && this.hasMore) {
        this.$store.dispatch(FORMS.actions.FETCH, {
          url: '/forms',
          loading: true,
        });
      }
    },
  },

  computed: {
    forms() {
      return this.$store.getters[FORMS.getters.ITEMS];
    },

    loading() {
      return this.$store.getters[FORMS.getters.LOADING];
    },

    hasMore() {
      return this.$store.getters[FORMS.getters.HAS_MORE];
    },
  },
};
</script>

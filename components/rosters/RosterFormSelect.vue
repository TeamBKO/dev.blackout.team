<template>
  <v-select
    v-model="computedValue"
    label="Select a form"
    :items="items"
    :item-text="'name'"
    :item-value="'id'"
  >
    <template #append-item>
      <v-list-item v-if="computedValue" @click="computedValue = 0">
        <v-list-item-content>
          <v-list-item-title>
            <v-icon left>mdi-close</v-icon>
            <span>Remove Form</span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <div
        v-if="items.length && hasMore"
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
import uniqBy from 'lodash/uniqBy';
export default {
  name: 'RosterFormSelect',

  props: {
    value: {
      type: [String, Number, Object],
    },
    items: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    async onIntersect(observer, entries, isIntersecting) {
      if (isIntersecting && this.forms.length && this.hasMore) {
        const { results } = await this.$store.dispatch(FORMS.actions.FETCH, {
          url: '/forms',
          loading: true,
        });

        this.$emit('update:items', uniqBy([...this.items, ...results], 'id'));
      }
    },
  },

  computed: {
    loading() {
      return this.$store.getters[FORMS.getters.LOADING];
    },

    hasMore() {
      return this.$store.getters[FORMS.getters.HAS_MORE];
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

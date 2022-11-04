<template>
  <form-select-with-cursor
    v-model="selectedForm"
    :items="forms"
    :loading="loading"
    :hasMore="hasMore"
    @click.native.once="fetchItems"
    @cursor="fetchItems"
  >
    <template #unset>
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-btn icon v-on="on" @click="$emit('input', 0)"
            ><v-icon>mdi-file-document-remove-outline</v-icon></v-btn
          >
        </template>
        <span>Unset selected form</span>
      </v-tooltip>
    </template>
  </form-select-with-cursor>
</template>

<script>
import FORMS from '~/constants/forms/public.js';
import uniqBy from 'lodash/uniqBy';
export default {
  name: 'FormSelector',

  props: {
    value: {
      type: [String, Number, Object],
    },
    currentForm: {
      type: Object,
    },
    label: {
      type: String,
      default: 'Select a form',
    },
  },

  methods: {
    fetchItems() {
      return this.$store.dispatch(FORMS.actions.FETCH, {
        url: '/forms',
      });
    },
  },

  computed: {
    loading() {
      return this.$store.getters[FORMS.getters.LOADING];
    },
    hasMore() {
      return this.$store.getters[FORMS.getters.HAS_MORE];
    },
    forms() {
      return uniqBy(
        [this.currentForm, ...this.$store.getters[FORMS.getters.ITEMS]],
        'id'
      );
    },
    selectedForm: {
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

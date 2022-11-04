<template>
  <v-autocomplete
    v-model="selectedRoles"
    :items="roles"
    :item-text="itemText"
    :item-value="itemValue"
    :search-input.sync="search"
    :label="label"
    multiple
    deletable-chips
    small-chips
    @click.native="loadInitialRoles"
  >
    <template #append-item>
      <div
        v-intersect.quiet="{
          threshold: 1.0,
          handler: onIntersect,
        }"
      ></div>
    </template>
  </v-autocomplete>
</template>

<script>
import ROLES from '~/constants/roles/public.js';
import uniqBy from 'lodash/uniqBy';
export default {
  name: 'RolesSelector',

  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [Array, Object],
      default: () => [],
    },
    itemText: {
      type: String,
      default: 'name',
    },
    itemValue: {
      type: String,
      default: 'id',
    },
    label: {
      type: String,
      default: 'Roles',
    },
    items: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      search: '',
    };
  },

  methods: {
    onIntersect(observer, entries, isIntersecting) {
      if (this.isIntersecting && this.roles.length && this.hasMore) {
        this.$store.dispatch(ROLES.actions.FETCH, { url: '/roles' });
      }
    },

    loadInitialRoles() {
      const roles = this.$store.getters[ROLES.getters.ITEMS];
      if (roles.length) return;
      this.$store.dispatch(ROLES.actions.FETCH, { url: '/roles' });
    },
  },

  computed: {
    selectedRoles: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },

    roles() {
      return uniqBy(
        [...this.items, ...this.$store.getters[ROLES.getters.ITEMS]],
        'id'
      );
    },

    hasMore() {
      return this.$store.getters[ROLES.getters.HAS_MORE];
    },
  },
};
</script>

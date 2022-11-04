<template>
  <v-autocomplete
    v-model="selectedRoles"
    :items="computedRoles"
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
      roles: [],
      hasMore: true,
      loading: false,
      nextCursor: '',
    };
  },

  methods: {
    async fetchMore() {
      const params = {};
      if (!this.hasMore) return;
      if (this.nextCursor) {
        Object.assign(params, { nextCursor: this.nextCursor });
      }

      this.loading = true;

      try {
        const items = await this.$axios.$get('/admin/roles/discord', {
          params,
        });

        if (items && items.results && items.results.length) {
          if (items.pageInfo.hasOwnProperty('hasMore')) {
            this.hasMore = items.pageInfo.hasMore;
          }
          if (items.pageInfo.next) {
            this.nextCursor = items.pageInfo.next;
          }
          this.roles = this.roles.concat(items.results);
        } else {
          this.hasMore = false;
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },

    async onIntersect(observer, entries, isIntersecting) {
      if (this.isIntersecting && this.roles.length && this.hasMore) {
        await this.fetchItems();
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

    computedRoles() {
      return uniqBy([...this.items, ...this.roles], 'id');
    },
  },
};
</script>

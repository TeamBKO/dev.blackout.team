<template>
  <v-list>
    <v-list-item v-for="role in roles" :key="role.name">
      <v-list-item-content>
        <v-list-item-subtitle>{{ role.name }}</v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-checkbox
          multiple
          v-model="computedValue"
          :value="role.id"
        ></v-checkbox>
      </v-list-item-action>
    </v-list-item>
    <v-list-item
      v-intersect.quiet="{
        options: { threshold: 1.0 },
        handler: onIntersect,
      }"
    >
      <div class="d-flex justify-center align-center py-2">
        <v-progress-circular indeterminate v-if="loading"></v-progress-circular>
      </div>
    </v-list-item>
  </v-list>
</template>

<script>
import ROLES from '~/constants/roles/public.js';
export default {
  name: 'RosterRoles',

  props: {
    value: {
      type: Array,
      default: () => [],
    },
    tabIsActive: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    tabIsActive: {
      immediate: true,
      handler: function (v) {
        if (v) {
          if (!this.roles.length) {
            this.$store.dispatch(ROLES.actions.FETCH, {
              url: '/roles',
              loading: true,
            });
          }
        }
      },
    },
  },

  methods: {
    onIntersect(entries, observer, isIntersecting) {
      if (isIntersecting && this.roles.length && this.hasMore) {
        this.$store.dispatch(ROLES.actions.FETCH, {
          url: '/roles',
          loading: true,
        });
      }
    },
  },

  computed: {
    roles() {
      return this.$store.getters[ROLES.getters.ITEMS];
    },

    loading() {
      return this.$store.getters[ROLES.getters.ITEMS];
    },

    hasMore() {
      return this.$store.getters[ROLES.getters.HAS_MORE];
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

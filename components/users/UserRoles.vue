<template>
  <v-chip-group>
    <v-chip
      v-for="(role, idx) in displayedRoles"
      small
      pill
      close
      :key="idx"
      @click:close="remove(role)"
    >
      <span>{{ role.name }}</span>
    </v-chip>
    <user-roles-truncated-list
      v-if="truncated.length"
      :truncated="truncated"
      @remove="remove"
    />
    <v-menu absolute :close-on-content-click="closeOnClick">
      <template v-slot:activator="{ on }">
        <v-chip small pill v-on="on" @click="openMenu">
          <v-icon small>mdi-plus</v-icon>
        </v-chip>
      </template>
      <v-list>
        <v-subheader>ROLES</v-subheader>
        <v-list-item
          v-for="(item, idx) in items"
          :key="idx"
          @click.stop="add(item)"
        >
          <span>{{ item.name }}</span>
        </v-list-item>
      </v-list>
      <v-intersect
        class="d-flex justify-center align-center"
        v-if="items.length && hasMore"
      >
        <v-progress-circular indeterminate v-if="loading"></v-progress-circular>
      </v-intersect>
    </v-menu>
  </v-chip-group>
</template>

<script>
import USERS from '~/constants/users/public.js';
import ROLES from '~/constants/roles/public.js';
import UserRolesTruncatedList from './UserRolesTruncatedList.vue';

export default {
  name: 'UserRoles',
  components: { UserRolesTruncatedList },
  props: {
    roles: {
      type: Array,
      default: () => [],
    },
    userId: {
      type: [String, Number],
    },
    display: {
      type: Number,
      default: 3,
    },
  },

  data() {
    return {
      closeOnClick: true,
    };
  },

  methods: {
    openMenu(on) {
      this.$store.dispatch(ROLES.actions.FETCH, {
        url: '/roles',
        loading: true,
      });
    },

    onIntersect(observer, entries, isIntersecting) {
      if (isIntersecting && this.roles.length && this.hasMore) {
        this.$store.dispatch(ROLES.actions.FETCH, { loading: true });
      }
    },

    remove(role) {
      this.$store.dispatch(USERS.actions.REMOVE_ROLE, {
        userId: this.userId,
        roleId: role.id,
      });
    },

    add(role) {
      const idx = this.roles.findIndex((r) => r.name === role.name);
      if (idx === -1) {
        this.$store.dispatch(USERS.actions.ADD_ROLE, {
          userId: this.userId,
          roleId: role.id,
        });
      }
    },
  },

  computed: {
    items() {
      return this.$store.getters[ROLES.getters.ITEMS];
    },
    hasMore() {
      return this.$store.getters[ROLES.getters.HAS_MORE];
    },
    loading() {
      return this.$store.getters[ROLES.getters.LOADING];
    },
    end() {
      return this.roles && this.roles.length
        ? this.display > this.roles.length
          ? this.roles.length
          : this.display
        : 0;
    },
    displayedRoles() {
      return this.roles
        ? this.roles.length > 1
          ? this.roles.slice(0, this.end)
          : this.roles
        : [];
    },
    truncated() {
      return this.roles && this.roles.length
        ? this.roles.slice(this.end, this.roles.length)
        : [];
    },
  },
};
</script>

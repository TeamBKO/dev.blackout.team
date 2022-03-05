<template>
  <v-card-text>
    <v-alert type="info">
      <span
        >Map discord roles to site roles. When a mapped discord role is assigned
        to a user on discord, the mapped site role will be assigned to the
        user.</span
      >
    </v-alert>
    <v-list>
      <v-list-item v-for="(role, idx) in roles" :key="idx">
        <v-list-item-action>
          <v-checkbox
            multiple
            v-model="computedValue"
            :value="role.id"
            :readonly="readOnly"
          ></v-checkbox>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-subtitle>
            {{ role.name }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <template v-if="!loading">
      <div
        v-intersect="{ options: { threshold: 1.0 }, handler: onIntersect }"
        v-if="roles.length && hasMore"
      ></div>
    </template>
  </v-card-text>
</template>

<script>
export default {
  name: 'DiscordRolesTab',

  props: {
    value: {
      type: Array,
      default: () => [],
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    tabIsActive: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      roles: [],
      hasMore: true,
      loading: false,
      nextCursor: '',
    };
  },

  watch: {
    async tabIsActive(v) {
      if (v) {
        if (!this.roles.length) {
          await this.fetchItems();
        }
      }
    },
  },

  methods: {
    async onIntersect(observer, entries, isIntersecting) {
      if (isIntersecting && this.roles.length) {
        await this.fetchItems();
      }
    },
    async fetchItems() {
      const params = {};
      if (!this.hasMore) return;

      if (this.nextCursor) {
        Object.assign(params, { nextCursor: this.nextCursor });
      }

      this.loading = true;

      try {
        const items = await this.$axios.$get('/admin/roles/discord');

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
  },
};
</script>

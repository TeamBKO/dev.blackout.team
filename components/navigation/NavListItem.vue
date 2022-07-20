<template>
  <v-list-item :nuxt="nuxt" :to="item.to" v-if="!hasChildren">
    <v-list-item-icon v-if="item.icon">
      <v-icon>{{ item.icon }}</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title>{{ item.title }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>

  <v-list-group
    no-action
    v-model="open"
    v-else
    exact-active-class="primary"
    :prepend-icon="item.icon"
  >
    <template v-slot:activator>
      <v-list-item-content>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item-content>
    </template>
    <template v-for="(child, idx) in item.children">
      <nav-list-item :key="idx" :item="child"></nav-list-item>
    </template>
  </v-list-group>
</template>

<script>
export default {
  name: 'NavListItem',
  props: {
    nuxt: {
      type: Boolean,
      default: true,
    },

    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      open: false,
    };
  },
  computed: {
    hasChildren() {
      return (
        this.item.hasOwnProperty('children') &&
        this.item.children &&
        this.item.children.length > 0
      );
    },

    isVisible() {
      if (this.item.scope && this.item.scope.length) {
        if (this.$auth.loggedIn) {
          return this.$auth.hasScope(this.item.scope);
        }
      }
      return true;
    },
  },
};
</script>

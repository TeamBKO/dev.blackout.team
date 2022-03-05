<template>
  <v-list-item :nuxt="nuxt" :to="item.to" v-if="!hasChildren">
    <v-list-item-icon>
      <v-icon>{{ item.icon }}</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title>{{ item.title }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>

  <v-list-group no-action v-model="open" :prepend-icon="item.icon" v-else>
    <template v-slot:activator>
      <v-list-item-content>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item-content>
    </template>
    <template v-for="(child, idx) in item.children">
      <nav-user-panel-link
        :key="idx"
        :title="child.title"
        :icon="child.icon"
      ></nav-user-panel-link>
    </template>
  </v-list-group>
</template>

<script>
export default {
  name: 'NavUserPanelLink',
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
      return this.item.children && this.item.children.length > 0;
    },
  },
};
</script>

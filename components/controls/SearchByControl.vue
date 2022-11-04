<template>
  <v-menu v-model="open" ref="menu" :return-value.sync="computedValue">
    <template #activator="{ on }">
      <v-btn x-small color="default" v-on="on">
        <span>Search By: {{ computedValue }}</span>
        <v-icon right>{{ open ? 'mdi-menu-up' : 'mdi-menu-down' }}</v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item
        v-for="(item, idx) in items"
        @click="$refs.menu.save(item)"
        :disabled="computedValue === item"
        :key="idx"
      >
        <v-list-item-content>
          <v-list-item-title>{{ item }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'SearchByControl',

  props: {
    value: {
      type: [String, Number],
    },
    items: {
      type: [Array, Object],
      default: () => [],
    },
  },

  data() {
    return {
      open: false,
    };
  },

  computed: {
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

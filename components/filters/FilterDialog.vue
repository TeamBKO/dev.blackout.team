<template>
  <v-dialog v-model="open" :max-width="modalMaxWidth" v-if="isModal">
    <template #activator="{ on }">
      <v-btn text v-on="on">
        <v-icon left v-text="icon"></v-icon>
        <span>Filters</span>
      </v-btn>
    </template>
    <filter-list
      :items="items"
      :namespace="namespace"
      :fetchOnChange="fetchOnChange"
      :delay="delay"
      @update="$emit('update')"
    ></filter-list>
  </v-dialog>
  <v-menu
    v-model="open"
    v-else
    :close-on-content-click="closeOnContentClick"
    :offset-y="offsetY"
  >
    <template #activator="{ on }">
      <v-btn text v-on="on">
        <v-icon left v-text="icon"></v-icon>
        <span>Filters</span>
      </v-btn>
    </template>
    <filter-list
      :items="items"
      :namespace="namespace"
      :fetchOnChange="fetchOnChange"
      :delay="delay"
      @update="$emit('update')"
    ></filter-list>
  </v-menu>
</template>

<script>
import FilterList from './FilterList.vue';
export default {
  name: 'FilterOptions',

  components: {
    FilterList,
  },

  props: {
    name: {
      type: String,
    },
    items: {
      type: [Array, Object],
      default: () => [],
    },
    namespace: {
      type: String,
    },
    modal: {
      type: Boolean,
      default: false,
    },
    modalMaxWidth: {
      type: Number,
      default: 500,
    },
    cardMaxWidth: {
      type: Number,
      default: 500,
    },
    fetchOnChange: {
      type: Boolean,
      default: false,
    },
    delay: {
      type: Number,
      default: 500,
    },
  },

  data() {
    return {
      icon: 'mdi-filter-variant',
      closeOnContentClick: false,
      maxWidth: 500,
      open: false,
      offsetY: true,
    };
  },

  watch: {
    '$vuetify.breakpoint.smAndDown'(newVal, oldVal) {
      if (!newVal && this.open) {
        this.open = false;
        setTimeout(() => (this.open = true), 10);
      }
    },
  },

  computed: {
    isModal() {
      return this.modal || this.$vuetify.breakpoint.smAndDown;
    },
  },
};
</script>

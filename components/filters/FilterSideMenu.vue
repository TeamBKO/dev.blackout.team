<template>
  <v-navigation-drawer v-model="open" absolute temporary right fixed>
    <v-toolbar dark>
      <v-toolbar-title> FILTERS </v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="open = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <div class="d-flex pa-2 flex-column" v-if="showSearch">
      <v-text-field
        v-model="computedInput"
        filled
        hide-details
        :label="'Search by username'"
        :prepend-inner-icon="'mdi-magnify'"
        :append-icon="'mdi-close'"
        @click:append="computedInput = ''"
      ></v-text-field>
    </div>
    <v-divider></v-divider>
    <v-expansion-panels
      v-if="displayPanels"
      v-model="panels"
      multiple
      accordion
      flat
    >
      <v-expansion-panel v-for="(items, idx) in panelItems" :key="idx">
        <v-expansion-panel-header>{{
          panelHeaders[idx]
        }}</v-expansion-panel-header>
        <v-expansion-panel-content class="px-0">
          <filter-list
            hide-header
            dense
            :items="items"
            :namespace="namespace"
            :fetchOnChange="fetchOnChange"
            @update="$emit('update')"
            @fetchMore="$emit('fetchMore', $event)"
          ></filter-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <filter-list
      v-else
      dense
      :hide-header="displayPanels"
      :items="items"
      :namespace="namespace"
      :fetchOnChange="fetchOnChange"
      @update="$emit('update')"
      @fetchMore="$emit('fetchMore', $event)"
    ></filter-list>
    <div class="d-flex justify-center pa-2" v-if="!fetchOnChange">
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="$emit('update')">Submit</v-btn>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('reset')">Reset</v-btn>
      <v-spacer />
    </div>
  </v-navigation-drawer>
</template>

<script>
import FilterList from './FilterList.vue';
export default {
  name: 'FilterSideMenu',

  components: {
    FilterList,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    items: {
      type: [Array, Object],
      default: () => [],
      required: true,
    },
    namespace: {
      type: String,
      required: true,
    },
    fetchOnChange: {
      type: Boolean,
      default: false,
    },
    itemText: {
      type: String,
      default: 'name',
    },
    itemValue: {
      type: String,
      default: 'id',
    },
    showSearch: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: 'Search',
    },
    displayPanels: {
      type: Boolean,
      default: false,
    },
    panelHeaders: {
      type: Array,
      default: () => [],
    },
  },

  mounted() {
    if (this.displayPanels) {
      this.panels = Array.from({ length: this.panelItems.length }, (v, i) => i);
    }
  },

  data() {
    return {
      searchBy: '',
      panels: [],
    };
  },

  computed: {
    open: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit('input', v);
      },
    },

    panelItems() {
      return this.items.map((item) => [item]);
    },

    computedInput: {
      get() {
        return this.searchBy;
      },
      set(v) {
        this.searchBy = v;
        this.$emit('update:search', v);
      },
    },
  },
};
</script>

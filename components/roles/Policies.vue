<template>
  <v-card-text>
    <v-fade-transition>
      <v-expansion-panels v-model="panel" accordion>
        <v-expansion-panel v-for="(items, key) in policies" :key="key">
          <v-expansion-panel-header>{{
            key.charAt(0).toUpperCase() + key.slice(1)
          }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-data-table :headers="headers" :items="items" hide-default-footer>
              <template #item.enable="{ item }">
                <v-switch
                  v-model="computedValue"
                  multiple
                  :value="item.id"
                  :readonly="readonly"
                ></v-switch>
              </template>
            </v-data-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-fade-transition>
  </v-card-text>
</template>

<script>
import POLICIES from '~/constants/policies/public.js';
export default {
  name: 'Policies',

  props: {
    value: {
      type: Array,
      default: () => [],
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    dialogStatus: {
      type: Boolean,
    },
    tabIsActive: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      headers: [
        { text: 'Action', value: 'action' },
        { text: 'Target', value: 'target' },
        { text: 'Status', value: 'enable' },
      ],

      panel: [],
      loading: false,
    };
  },

  watch: {
    tabIsActive: {
      immediate: true,
      handler: async function (v) {
        if (v) {
          if (!this.policies.length) {
            this.loading = true;
            await this.$store.dispatch(POLICIES.actions.FETCH);
            this.loading = false;
          }
        }
      },
    },

    dialogStatus(v) {
      if (!v) {
        this.panel = null;
      }
    },
  },

  computed: {
    policies() {
      return this.$store.getters[POLICIES.getters.ITEMS];
    },

    computedValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
};
</script>

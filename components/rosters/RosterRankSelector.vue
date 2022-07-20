<template>
  <form-select-with-cursor
    v-model="computedValue"
    :label="label"
    :items="ranks"
    :loading="loading"
    :hasMore="hasMore"
    :readOnly="readOnly"
    @cursor="getRanks"
  >
    <template #item="{ item, on, attrs }">
      <v-list-item v-bind="attrs" v-on="on" class="rank">
        <v-list-item-icon class="mr-3">
          <v-img :src="item.icon"></v-img>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-subtitle>
            {{ item.name }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
  </form-select-with-cursor>
</template>

<script>
import RANKS from '~/constants/rosters/ranks/public.js';
export default {
  name: 'RosterRankSelector',

  props: {
    value: {
      type: [String, Number],
    },
    label: {
      type: String,
      default: 'Select rank',
    },
    previous: {
      type: [String, Number],
      default: '',
    },
    id: {
      type: String,
    },
    priority: {
      type: Number,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    async getRanks() {
      if (this.hasMore) {
        await this.$store.dispatch(RANKS.actions.FETCH, {
          url: `/rosters/${this.id}/ranks`,
        });
      }
    },
  },

  computed: {
    ranks() {
      return this.$store.getters[RANKS.getters.ITEMS].filter(
        ({ priority }) => priority >= this.priority
      );
    },

    hasMore() {
      return this.$store.getters[RANKS.getters.HAS_MORE];
    },

    loading() {
      return this.$store.getters[RANKS.getters.LOADING];
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

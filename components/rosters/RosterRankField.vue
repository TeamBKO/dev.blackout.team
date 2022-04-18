<template>
  <v-edit-dialog
    large
    @open="getInitRanks"
    @save="$emit('save', { rank: selectedRank, previous: previousRank })"
  >
    <v-list-item class="px-0">
      <v-list-item-icon class="mr-3">
        <v-img :src="value.icon" :size="42"></v-img>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-subtitle>
          {{ value.name }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <template #input>
      <roster-rank-selector
        v-model="computedValue"
        :previous.sync="previousValue"
        :id="id"
        :priority="priority"
      ></roster-rank-selector>
    </template>
  </v-edit-dialog>
</template>

<script>
import RANKS from '~/constants/rosters/ranks/public.js';
import RosterRankSelector from '~/components/rosters/RosterRankSelector.vue';
export default {
  name: 'RosterRankField',

  components: { RosterRankSelector },

  props: {
    value: {
      type: Object,
    },
    label: {
      type: String,
      default: 'Select rank',
    },
    id: {
      type: String,
    },
    priority: {
      type: Number,
    },
  },

  watch: {
    value: {
      immediate: true,
      handler: function (v) {
        if (v !== this.internalValue) {
          this.internalValue = v.id;
        }
      },
    },
    internalValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.previousValue = oldVal;
        this.$emit('update:previous', oldVal);
      }
    },
  },

  data() {
    return {
      internalValue: '',
      previousValue: '',
    };
  },

  methods: {
    async getInitRanks() {
      if (!this.ranks.length) {
        this.$store.dispatch(RANKS.actions.FETCH, {
          url: `/rosters/${this.id}/ranks`,
          loading: false,
        });
      }
    },
  },

  computed: {
    ranks() {
      return this.$store.getters[RANKS.getters.ITEMS];
    },

    selectedRank() {
      return this.ranks.find(({ id }) => id === this.internalValue);
    },

    previousRank() {
      return this.ranks.find(({ id }) => id === this.previousValue);
    },

    computedValue: {
      get() {
        return this.internalValue;
      },
      set(value) {
        this.internalValue = value;
      },
    },
  },
};
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-autocomplete
        v-model="selectedRosters"
        :items="rosters"
        :label="`Select Rosters (${selectedRosters.length} / ${maxSelected})`"
        solo-inverted
        chips
        multiple
        @click.native.once="getRosters"
      >
        <template #append-outer>
          <v-btn icon style="bottom: 5px" @click="getRosters">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
        <template #selection="data">
          <v-chip
            v-bind="data.attrs"
            :input-value="data.selected"
            close
            @click="data.select"
            @click:close="$emit('removeSelected', data.item.id)"
          >
            <v-avatar left>
              <v-img :src="data.item.icon"></v-img>
            </v-avatar>
            {{ data.item.name }}
          </v-chip>
        </template>
        <template #item="data">
          <template v-if="typeof data.item !== 'object'">
            <v-list-item-content v-text="data.item"></v-list-item-content>
          </template>
          <template v-else>
            <v-list-item-avatar>
              <img :src="data.item.icon" alt="" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ data.item.name }}</v-list-item-title>
            </v-list-item-content>
          </template>
        </template>
        <template #append-item>
          <div
            class="d-flex justify-center align-center py-2"
            v-if="hasMore"
            v-intersect.quiet="{
              options: { threshold: 1.0 },
              handler: onIntersect,
            }"
          >
            <v-progress-circular
              indeterminate
              v-if="loading"
            ></v-progress-circular>
          </div>
        </template>
      </v-autocomplete>
    </v-col>
  </v-row>
</template>

<script>
import ROSTERS from '~/constants/rosters/public.js';
export default {
  name: 'RosterList',

  props: {
    value: {
      type: Array,
      default: () => [],
    },
    maxSelected: {
      type: Number,
      default: 25,
    },
  },

  data() {
    return {
      bench: 0,
    };
  },

  methods: {
    getRosters() {
      const rosters = this.$store.getters[ROSTERS.getters.ITEMS];
      if (rosters.length) return;
      this.$store.dispatch(ROSTERS.actions.FETCH, { url: '/rosters' });
    },
    onIntersect(observer, entries, isIntersecting) {
      if (isIntersecting && this.rosters.length && this.hasMore) {
        this.$store.dispatch(ROSTERS.actions.FETCH, { url: '/rosters' });
      }
    },
  },

  computed: {
    selectedRosters: {
      get() {
        return this.value;
      },
      set(value) {
        if (this.value.length === this.maxSelected) return;
        this.$emit('input', value);
      },
    },
    loading() {
      return this.$store.getters[ROSTERS.getters.LOADING];
    },
    hasMore() {
      return this.$store.getters[ROSTERS.getters.HAS_MORE];
    },
    rosters() {
      return this.$store.getters[ROSTERS.getters.ITEMS];
    },
  },
};
</script>

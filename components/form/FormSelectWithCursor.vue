<template>
  <v-select
    v-model="computedValue"
    :label="label"
    :items="items"
    :item-text="'name'"
    :item-value="'id'"
  >
    <template #selection="props" v-if="$scopedSlots.selection">
      <slot name="selection" v-bind="props" />
    </template>
    <template #no-data v-if="$scopedSlots['no-data']">
      <slot name="no-data" v-bind="props" />
    </template>
    <template #item="props" v-if="$scopedSlots.item">
      <slot name="item" v-bind="props" />
    </template>
    <template #counter="props" v-if="$scopedSlots.counter">
      <slot name="counter" v-bind="props" />
    </template>
    <template #append-item v-if="items.length && hasMore">
      <div
        v-intersect.quiet="{
          options: {
            threshold: 1.0,
          },
          handler: onIntersect,
        }"
      >
        <template v-if="!$scopedSlots.loading">
          <v-progress-circular
            indeterminate
            v-if="loading"
          ></v-progress-circular>
        </template>
        <template v-else>
          <slot name="loading" />
        </template>
      </div>
    </template>
  </v-select>
</template>

<script>
export default {
  name: 'RosterFormSelect',

  props: {
    value: {
      type: [String, Number],
    },
    items: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    hasMore: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
    },
  },

  methods: {
    async onIntersect(observer, entries, isIntersecting) {
      if (isIntersecting) {
        this.$emit('cursor');
      }
    },
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

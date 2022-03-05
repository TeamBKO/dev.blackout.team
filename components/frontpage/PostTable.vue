<template>
  <v-data-table
    v-model="computedSelected"
    :items="items"
    :headers="headers"
    show-select
    disable-pagination
  >
    <template #body="{ items, isSelected, select }">
      <draggable :list="items" tag="tbody">
        <tr v-for="(item, index) in items" :key="item.id">
          <td>
            <v-checkbox
              :value="isSelected(item)"
              @click.native="select(item, !isSelected)"
            ></v-checkbox>
          </td>
          <td :key="idx" v-for="(header, idx) in computedHeaders">
            <template v-if="$scopedSlots[`item.${header}`]">
              <slot :name="`item.${header}`" v-bind="{ item, index }" />
            </template>
            <template v-else>
              {{ item[header] }}
            </template>
          </td>
        </tr>
      </draggable>
      <slot name="infinite" />
    </template>
  </v-data-table>
</template>

<script>
import draggable from 'vuedraggable';
export default {
  name: 'PostTable',

  components: { draggable },

  props: {
    value: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    enableDrag: {
      type: Boolean,
      default: true,
    },
  },

  methods: {
    onDragStart(evt) {
      if (!this.enableDrag) {
        return evt.preventDefault();
      }
    },
    onDragEnd(evt) {
      if (!this.enableDrag) {
        return evt.preventDefault();
      }
    },
  },

  computed: {
    computedHeaders() {
      return this.headers.map(({ value }) => value.toLowerCase());
    },
    computedSelected: {
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

<template>
  <v-sheet>
    <v-list :dense="dense" v-for="item in items" :key="item.name">
      <v-subheader v-if="!hideHeader">{{
        item.name.toUpperCase()
      }}</v-subheader>
      <v-list-item v-for="(filter, idx) in item.list" :key="idx">
        <v-list-item-content>
          <v-list-item-title>
            {{ filter[item.itemText || itemText] }}
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-checkbox
            v-if="item.type && item.type === 'checkbox'"
            v-model="self()[`filterBy${item.name}`]"
            hide-details
            :multiple="item.multiple ? item.multiple : false"
            :value="filter[item.itemValue || itemValue]"
            :on-icon="filter[onIcon] || checkBoxOnIcon"
            :off-icon="filter[offIcon] || checkBoxOffIcon"
          ></v-checkbox>
          <v-switch
            v-else
            v-model="self()[`filterBy${item.name}`]"
            hide-details
            :multiple="item.multiple ? item.multiple : false"
            :value="filter[item.itemValue || itemValue]"
          ></v-switch>
        </v-list-item-action>
      </v-list-item>
      <template
        v-if="item.hasOwnProperty('pagination') && item.pagination.cursor"
      >
        <div
          class="d-flex justify-center align-center py-1"
          v-intersect="{
            options: { threshold: 1.0 },
            handler: self()[`${item.name}_onIntersect`],
          }"
          v-if="items.length && self()[`${item.name}_hasMore`]"
        >
          <v-progress-circular
            indeterminate
            v-if="self()[`${item.name}Loading`]"
          ></v-progress-circular>
        </div>
      </template>
    </v-list>
  </v-sheet>
</template>

<script>
import debounce from 'lodash/debounce';

function emit() {
  this.$emit('update');
}

export default {
  name: 'FilterList',
  props: {
    items: {
      type: Array,
      default: () => [],
      required: true,
    },
    namespace: {
      type: String,
    },
    itemText: {
      type: String,
      default: 'name',
    },
    itemValue: {
      type: String,
      default: 'id',
    },
    fetchOnChange: {
      type: Boolean,
      default: false,
    },
    checkBoxOffIcon: {
      type: String,
      default: '$checkboxOff',
    },
    checkBoxOnIcon: {
      type: String,
      default: '$checkboxOn',
    },
    delay: {
      type: Number,
      default: 500,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    hideHeader: {
      type: Boolean,
      default: false,
    },
  },

  beforeCreate() {
    const namespace = this.$options.propsData.namespace;
    const mapComputed = this.$options.propsData.items.forEach((item) => {
      const propModel = `filterBy${item.name}`;
      const computedProp = {
        get() {
          return this.$store.getters[`${namespace}/queryParams`](item.filterBy);
        },
        set(value) {
          this.$store.commit(`${namespace}/setParam`, {
            param: item.filterBy,
            value,
          });
        },
      };

      this.$options.computed[propModel] = computedProp;

      if (this.item.pagination.cursor) {
        const name = item.pagination.namespace.toLowerCase();
        this.$options.computed[`${item.name}Loading`] = function () {
          return this.$store.getters[`${name}/loading`];
        };
        this.$options.computed[`${name}_hasMore`] = function () {
          return this.$store.getters[`${name}/hasMore`];
        };
        Object.assign(this.$options.methods, {
          [`${item.name}_onIntersect`]: function (
            observer,
            entries,
            isIntersecting
          ) {
            if (
              item.list &&
              item.list.length &&
              this.$store.getters[`${name}/hasMore`]
            ) {
              this.$store.dispatch(`${name}/fetchItems`, {
                loading: true,
              });
            }
          },
        });
      }
    });
  },

  mounted() {
    if (this.fetchOnChange) {
      const debouncedEmit = debounce(emit, this.delay).bind(this);

      this.items.forEach((item) => {
        const propModel = `filterBy${item.name}`;
        this.$watch(propModel, function () {
          console.log(propModel);

          this.$nextTick(() => debouncedEmit());
        });
      });
    }
  },

  methods: {
    self() {
      return this;
    },
  },

  computed: {},
};
</script>

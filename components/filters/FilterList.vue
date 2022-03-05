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
        <div v-intersect="onIntersect(item.name)" v-if="items.length"></div>
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
    const mapComputed = this.$options.propsData.items.reduce((obj, item) => {
      const propModel = `filterBy${item.name}`;
      const namespace = this.$options.propsData.namespace;

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
      obj[propModel] = computedProp;
      return obj;
    }, {});

    Object.assign(this.$options.computed, { ...mapComputed });
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

    onIntersect(item) {
      const self = this;
      return function (entries, observer, isIntersecting) {
        if (isIntersecting) {
          const i = item.toLowerCase();
          self.$emit(`page:${i}`, i);
        }
      };
    },
  },

  computed: {},
};
</script>

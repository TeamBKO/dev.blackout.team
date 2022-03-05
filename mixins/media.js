export default {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    selected: {
      type: Array,
      default: () => [],
    },
    newlyAdded: {
      type: Array,
      default: () => [],
    },
    columnSizes: {
      type: Object,
    },
  },

  data() {
    return {
      internalItems: [],
      internalSelected: [],
    };
  },

  watch: {
    value: {
      deep: true,
      handler: function (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.internalItems = newVal;
        }
      },
    },
    selected: {
      deep: true,
      handler: function (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.interalSelected = newVal;
        }
      },
    },
  },

  computed: {
    computedSelected: {
      get() {
        return this.selected;
      },
      set(val) {
        this.internalSelected = val;
        this.$emit('update:selected', val);
      },
    },

    media: {
      get() {
        return this.value;
      },
      set(val) {
        if (Array.isArray(val)) {
          this.internalItems = this.internalItems.concat(val);
        } else if (typeof val === 'object' && !Array.isArray(val)) {
          this.internalItems.push(val);
        }
        this.$emit('input', this.internalItems);
      },
    },
  },
};

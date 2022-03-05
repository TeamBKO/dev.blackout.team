import isObject from 'lodash/isObject';

export default function (ns) {
  if (!isObject(ns)) {
    throw new Error(
      'arguement must be an object containing the namespaces of the store.'
    );
  }

  if (!ns?.actions?.REMOVE_ITEMS) {
    throw new Error(
      "object must have a property containing 'actions.REMOVE_ITEMS'"
    );
  }

  if (!ns?.mutations?.SET_SELECTED) {
    throw new Error(
      "object must have a property containing 'mutations.SET_SELECTED'"
    );
  }

  if (!ns?.getters?.SELECTED) {
    throw new Error(
      "object must have a property containing 'getters.SELECTED'"
    );
  }

  return {
    data() {
      return {
        itemIdToRemove: null,
        single: false,
      };
    },

    methods: {
      setItemForRemoval(id) {
        this.itemIdToRemove = id;
        this.single = true;
        this.open = true;
      },

      onDelete() {
        if (this.itemIdToRemove) {
          this.$store.dispatch(ns.actions.REMOVE_ITEMS, this.itemIdToRemove);
          this.itemIdToRemove = null;
          this.single = false;
        } else {
          this.$store.dispatch(ns.actions.REMOVE_ITEMS);
        }
      },

      onCancel() {
        if (this.itemIdToRemove) {
          this.itemIdToRemove = null;
          this.single = false;
        }
        this.open = false;
      },
    },

    computed: {
      selectedItems: {
        get() {
          return this.$store.getters[ns.getters.SELECTED];
        },
        set(value) {
          this.$store.commit(ns.mutations.SET_SELECTED, value);
        },
      },
    },
  };
}

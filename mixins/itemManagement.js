import isObject from 'lodash/isObject';

export default function (ns, property = 'open') {
  if (!isObject(ns)) {
    throw new ReferenceError(
      'arguement must be an object containing the namespaces of the store.'
    );
  }

  if (!ns?.actions?.REMOVE_ITEMS) {
    throw new ReferenceError(
      "object must have a property containing 'actions.REMOVE_ITEMS'"
    );
  }

  if (!ns?.mutations?.SET_SELECTED) {
    throw new ReferenceError(
      "object must have a property containing 'mutations.SET_SELECTED'"
    );
  }

  if (!ns?.getters?.SELECTED) {
    throw new ReferenceError(
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
        this[property] = true;
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
        this[property] = false;
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

import isUndefined from 'lodash/isUndefined';
/**
 *
 * @param {string} url The string representing the endpoint to grab the items.
 * @param {string} itemKey The string representing the alias of the computed array holding the items.
 * @param {*} methodName The string of the method used to fetch the items. default: fetchItems
 */
export default function (url, itemKey = 'items', methodName = 'fetchItems') {
  return {
    data() {
      return {
        internalItems: [],
        nextCursor: '',
        previousCursor: '',
        hasMore: false,
        loading: false,
      };
    },

    methods: {
      async [methodName]() {
        this.loading = true;
        const params = {};
        if (this.nextCursor) {
          Object.assign(params, { nextCursor: this.nextCursor });
        }

        try {
          const resp = await this.$axios.$get(url, { params });

          if (resp && resp.results && resp.results.length) {
            this[itemKey] = this[itemKey].concat(resp.results);
            if (!isUndefined(resp.pageInfo.hasMore)) {
              this.hasMore = resp.pageInfo.hasMore;
            }
            if (!isUndefined(resp.pageInfo.next)) {
              this.nextCursor = resp.pageInfo.next;
            }
            if (!isUndefined(resp.pageInfo.previous)) {
              this.previousCursor = resp.pageInfo.previous;
            }
          }
        } catch (err) {
          console.log(err);
          this.$toast.error(err.response.data.message, {
            position: 'top-center',
            duration: 5000,
          });
        } finally {
          this.loading = false;
        }
      },
    },

    computed: {
      [itemKey]: {
        get() {
          return this.internalItems;
        },
        set(value) {
          this.internalItems = value;
        },
      },
    },
  };
}

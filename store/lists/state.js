export const defaultQueryParams = {
  // page: 1,
  // limit: 25,
  // total: 0,
  exclude: [],
  nextCursor: '',
  prevCursor: '',
};

const state = () => ({
  items: {
    categories: [],
    tags: [],
  },

  type: '',

  selected: [],

  queryParams: defaultQueryParams,
});

export default state;

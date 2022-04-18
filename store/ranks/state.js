import { mapStateToStore } from '~/utilities/store';

export const defaultQueryParams = {
  nextCursor: '',
  prevCursor: '',
  exclude: [],
};

const state = () => ({
  ...mapStateToStore(defaultQueryParams, [
    'items',
    'hasMore',
    'loading',
    'queryParams',
  ]),
});

export default state;

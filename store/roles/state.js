import cloneDeep from 'lodash/cloneDeep';
import { mapStateToStore } from '~/utilities/store';

export const defaultQueryParams = {
  nextCursor: '',
  prevCursor: '',
  exclude: [],
  limit: 25,
  orderBy: 'DESC',
  sortBy: 'id',
};

const state = () => ({
  ...mapStateToStore(defaultQueryParams),
});

export default state;

import { mapStateToStore } from '~/utilities/store';
import cloneDeep from 'lodash/cloneDeep';

export const defaultQueryParams = {
  nextCursor: '',
  prevCursor: '',
  searchByUsername: '',
  exclude: [],
  limit: 50,
  orderBy: 'DESC',
  sortBy: 'id',
  'roles.id': [],
  active: [],
};

const state = () => ({
  ...mapStateToStore(defaultQueryParams),
});

export default state;

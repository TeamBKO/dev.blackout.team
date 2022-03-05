// import cloneDeep from 'lodash/cloneDeep';
import { mapStateToStore } from '~/utilities/store';

export const defaultQueryParams = {
  nextCursor: '',
  prevCursor: '',
  searchByName: '',
  exclude: [],
  orderBy: 'DESC',
  sortBy: 'id',
  'rosters.id': [],
};

// const state = () => ({
//   forms: [],
//   selected: [],

//   queryParams: cloneDeep(defaultQueryParams),
// });

const state = () => ({
  ...mapStateToStore(defaultQueryParams),
});

export default state;

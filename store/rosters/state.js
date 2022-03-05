import cloneDeep from 'lodash/cloneDeep';
import { mapStateToStore } from '~/utilities/store';

export const defaultQueryParams = {
  searchByName: '',
  exclude: [],
  limit: 50,
  nextCursor: '',
  prevCursor: '',
};

const state = () => ({
  ...mapStateToStore(defaultQueryParams),
});

export default state;

import { mapStateToStore } from '~/utilities/store';

export const defaultQueryParams = {
  nextCursor: '',
  prevCursor: '',
  exclude: [],
  roster_id: [],
  disabled: false,
  apply_roles_on_approval: false,
  enable_recruitment: false,
};

const state = () => ({
  ...mapStateToStore(defaultQueryParams),
});

export default state;

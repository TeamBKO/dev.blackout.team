import page from '~/constants/page/public.js';
export default (title) => ({ store }) =>
  store.commit(page.mutations.SET_TITLE, title);

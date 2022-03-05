import settings from '~/constants/settings/public.js';
export default async ({ app }, inject) => {
  app.store.dispatch(settings.actions.FETCH);
  // inject('permissions', policies);
};

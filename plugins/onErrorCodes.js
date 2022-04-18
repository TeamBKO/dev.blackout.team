import page from '~/constants/page/public.js';

export default ({ $axios, $auth, $toast, redirect, store }) =>
  $axios.onError((err, name, endpoint) => {
    console.log(err, name, endpoint);

    const code = parseInt(err.response && err.response.status);
    const message = err.response.data.message || err;
    const type = err.response.data.type;

    console.log(code);
    console.log(message);
    console.log(type);

    if (code === 401) {
      if (type === 'Unauthorized') {
        if (message === 'The token has been revoked.') {
          return store.commit(page.mutations.TOGGLE_STATUS_DIALOG, true);
        }
        // if ($auth.loggedIn) {
        //   $auth.logout();
        //   redirect('/');
        // }
      }
    } else if (code === 404) {
      return redirect('/404');
    } else if (code === 403) {
      if ($auth.loggedIn) {
        if (message === 'Permission denied' && type === 'Unauthorized') {
          const text = 'Insufficient permissions to perform this action.';
          $toast.error(text, { position: 'top-center' });
        }
      }
    }
  });

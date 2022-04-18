import MENU from '~/constants/menu/private.js';

const getters = {
  // [MENU.getters.LINKS]: (state, getters, rootState) =>
  //   state.links.reduce((arr, item) => {
  //     console.log(item);
  //     if (typeof item.conditions !== undefined) {
  //       const isTruthy = item.conditions.some((condition) => {
  //         if (condition === 'loggedIn') {
  //           return rootState.auth.loggedIn;
  //         }
  //       });
  //       if (!isTruthy) return arr;
  //     }
  //     arr.push(item);
  //     return arr;
  //   }, []),
  [MENU.getters.LINKS]: (state) => state.links,
};

export default getters;

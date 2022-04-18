<template>
  <v-breadcrumbs :items="breadcrumbs">
    <template #item="{ item }">
      <v-breadcrumbs-item :disabled="item.disabled" :to="item.to" nuxt>{{
        item.text
      }}</v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script>
import capitalize from 'lodash/capitalize';
import uniq from 'lodash/uniq';

const deslugify = function (str) {
  const parts = str.split('-');
  return parts.map(capitalize).join(' ');
};

export default {
  name: 'BreadCrumbs',

  computed: {
    breadcrumbs() {
      const routes = this.$router.currentRoute.fullPath.slice(1).split('/');
      return [
        { text: 'Home', disabled: false, to: '/' },
        ...routes.map((route, idx, arr) => {
          const href = uniq(this.$router.resolve(route).href.split('/')).join(
            '/'
          );
          return {
            text: deslugify(route),
            disabled: this.$router.currentRoute.path === href,
            link: true,
            to: href,
          };
        }),
      ];
    },
  },
};
</script>

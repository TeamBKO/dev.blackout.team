<template>
  <v-breadcrumbs :items="breadcrumbs">
    <!-- <template #item="{ item }">
      <v-breadcrumbs-item>{{ item.text }}</v-breadcrumbs-item>
    </template> -->
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

  props: {
    currentRoute: {
      type: Object,
      default: undefined,
    },
  },

  data() {
    return {
      breadcrumbs: [],
    };
  },

  created() {
    this.breadcrumbs = this.formatRoutes();

    if (this.currentRoute) {
      const lastIndex = this.breadcrumbs.length - 1;
      this.breadcrumbs.splice(lastIndex, 1, this.currentRoute);
    }
  },

  methods: {
    formatRoutes() {
      const routes = this.$router.currentRoute.fullPath.slice(1).split('/');
      return [
        { text: 'Home', disabled: false, to: '/', nuxt: true },
        ...routes.map((route, idx, arr) => {
          const href = uniq(this.$router.resolve(route).href.split('/')).join(
            '/'
          );
          const disabled = this.$router.currentRoute.path === href;
          return {
            text: deslugify(route),
            // disabled,
            // link: true,
            exact: true,
            nuxt: true,
            to: href,
          };
        }),
      ];
    },
  },

  computed: {
    // breadcrumbs() {
    //   const routes = this.$router.currentRoute.fullPath.slice(1).split('/');
    //   return [
    //     { text: 'Home', disabled: false, to: '/', nuxt: true },
    //     ...routes.map((route, idx, arr) => {
    //       const href = uniq(this.$router.resolve(route).href.split('/')).join(
    //         '/'
    //       );
    //       const disabled = this.$router.currentRoute.path === href;
    //       return {
    //         text: deslugify(route),
    //         disabled,
    //         // link: true,
    //         nuxt: true,
    //         to: href,
    //       };
    //     }),
    //   ];
    // },
  },
};
</script>

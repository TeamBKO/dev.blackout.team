<template>
  <section id="history">
    <parallax-banner :title="title"></parallax-banner>
    <v-container fill-height></v-container>
  </section>
</template>

<script>
import ParallaxBanner from '~/components/core/Parallax.vue';
export default {
  name: 'Guides',

  // transition: {
  //   name: 'fade',
  //   mode: 'in-out',
  // },

  components: { ParallaxBanner },

  layout: 'default',

  head() {
    return { title: 'Guides' };
  },

  data() {
    return {
      title: 'Guides',
    };
  },
};
</script>

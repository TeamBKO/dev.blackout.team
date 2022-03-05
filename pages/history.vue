<template>
  <section id="history">
    <parallax-banner :title="title"></parallax-banner>
    <v-container fill-height></v-container>
  </section>
</template>

<script>
import ParallaxBanner from '~/components/core/Parallax.vue';
export default {
  name: 'History',

  // transition: {
  //   name: 'fade',
  //   mode: 'in-out',
  // },

  components: { ParallaxBanner },

  head() {
    return { title: 'Blackout - History' };
  },
  data() {
    return {
      title: 'History',
    };
  },
};
</script>

<template>
  <v-parallax dark :src="defaultSrc" :class="parallaxClasses" :height="height">
    <v-row align="center" justify="center">
      <v-col class="text-center" cols="12">
        <h1 class="text-h2 font-weight-bold">{{ title }}</h1>
      </v-col>
    </v-row>
  </v-parallax>
</template>

<script>
export default {
  name: 'ParallaxHeader',

  props: {
    title: {
      type: String,
    },
  },

  data() {
    return {
      defaultSrc:
        'https://images.ctfassets.net/j95d1p8hsuun/1ShvIkEIe3cvb5qKSguLdC/9bbac0c4239985ca540650ec240d765b/HOME_USP1_FightTheWorld_CPB-L-1920x720.jpg',
      elevation: 5,
      height: 300,
    };
  },

  created() {
    if (!this.$vuetify.theme.dark) {
      this.$vuetify.theme.dark = true;
    }
  },

  computed: {
    parallaxClasses() {
      return [`elevation-${this.elevation}`];
    },
  },
};
</script>

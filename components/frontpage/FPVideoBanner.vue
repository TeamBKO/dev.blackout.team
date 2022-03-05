<template>
  <v-container fill-height fluid class="pa-0">
    <video v-bind="$attrs" :width="width" :height="height">
      <source :src="src" :type="type" />
    </video>
  </v-container>
</template>

<script>
export default {
  name: 'FPVideoBanner',
  props: {
    src: {
      type: String,
      default: 'https://blackout-gaming.s3.amazonaws.com/video/0001-0876.webm',
    },
    type: {
      type: String,
      default: 'video/webm',
    },
    width: {
      type: [Number, String],
      default: '100%',
    },
    height: {
      type: [Number, String],
      default: '100%',
    },
  },
};
</script>

<template>
  <v-carousel-item class="fill-height">
    <div :style="style">
      <v-container fluid>
        <v-row :justify="justify" class="px-12">
          <v-card :width="cardWidth">
            <v-toolbar>
              <v-toolbar-title>{{ title }}</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <slot />
            </v-card-text>
          </v-card>
          <!-- <v-col md="6">
            <v-card :width="cardWidth">
              <v-toolbar>
                <v-toolbar-title>{{ title }}</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <slot />
              </v-card-text>
            </v-card>
          </v-col> -->
        </v-row>
      </v-container>
    </div>
  </v-carousel-item>
</template>

<script>
export default {
  name: 'FrontPageCarouselItem',

  props: {
    title: {
      type: String,
    },
    src: {
      type: String,
    },
    cardWidth: {
      type: [String, Number],
      default: '500px',
    },
    justify: {
      type: String,
      default: 'start',
    },
  },

  computed: {
    style() {
      return { 'background-image': `url(${this.src})`, height: '100%' };
    },
  },
};
</script>

<template>
  <div :class="rootClasses">
    <v-container class="py-0">
      <v-row :class="rowClasses" no-gutters align="center" justify="center">
        <v-col md="7" cols="12">
          <div class="text-center">
            <p class="info-text info-title">{{ data.title }}</p>
            <p class="info-text info-body">{{ data.text }}</p>
          </div>
        </v-col>
        <v-col md="5" cols="12" v-if="!hasDefaultSlot">
          <div class="side-image">
            <img :src="data.image.src" alt />
          </div>
        </v-col>
        <v-col md="5" cols="12" v-else>
          <slot />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'FrontPageBlock',

  props: {
    data: {
      type: [Object, Array],
    },
    idx: Number,
  },

  computed: {
    hasDefaultSlot() {
      return !!this.$slots.default || !!this.$scopedSlots.default;
    },
    row() {
      return this.idx + 1;
    },
    isEven() {
      return this.row % 2 === 0;
    },
    rootClasses() {
      return ['fp-block', { odd: !this.isEven }];
    },
    rowClasses() {
      return {
        'flex-row-reverse': this.isEven && this.$vuetify.breakpoint.mdAndUp,
        'flex-column flex-column-reverse': this.$vuetify.breakpoint.smAndDown,
      };
    },
  },
};
</script>

<style lang="scss">
.fp-block {
  background-color: #0a0a0a;
  width: 100%;
  &-title {
    font-size: 1.5rem !important;
  }
  &.odd {
    background-color: #1d1d1d;
  }
  // height: 300px;
}
// .image-edge {
//   width: 700px;
//   height: 300px;
//   overflow: visible;
//   z-index: 1;
//   position: relative;
//   &:after {
//     content: '';
//     width: 80px;
//     height: 100%;
//     position: absolute;
//     background: #1d1d1d;
//     z-index: 2;
//     top: 0;
//     left: 0;
//     transform: skewX(-25deg);
//   }
// }

.side-image img {
  display: block;
  // height: 350px;
  width: 100%;
  object-fit: cover;
  object-position: 50% 20%;
}

.side-image {
  width: 100%;
  // -webkit-clip-path: polygon(25% 0, 100% 0, 75% 100%, 0 100%);
  // clip-path: polygon(25% 0, 100% 0, 75% 100%, 0 100%);
  // -webkit-clip-path: polygon(7% 0, 100% 0, 100% 100%, 0 100%);
  // clip-path: polygon(7% 0, 100% 0, 100% 100%, 0 100%);
  clip-path: polygon(7% 0, 100% 0, 93% 100%, 0 100%);
}

.info-text {
  font-weight: 500;
  letter-spacing: 0.1666666667em !important;
  line-height: 2rem;
  text-transform: uppercase;
  font-family: 'Roboto', sans-serif !important;
}
.info-title {
  font-size: 1.5rem !important;
}

.info-body {
  font-size: 1rem !important;
}
</style>

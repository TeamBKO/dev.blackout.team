<template>
  <v-dialog
    v-model="open"
    :transition="transition"
    :fullscreen="fullscreen"
    :scrollable="scrollable"
  >
    <template #activator="{ on, attrs }" v-if="$scopedSlots.activator">
      <slot name="activator" v-bind="{ on, attrs }" />
    </template>
    <media-container v-bind="mediaContainerProps">
      <template #close>
        <v-btn icon small @click="open = false">
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-icon v-text="closeIcon" v-on="on"></v-icon>
            </template>
            Close
          </v-tooltip>
        </v-btn>
      </template>
      <template #bottomActions="{ selected, tab }">
        <v-btn
          text
          :disabled="!selected || tab !== 1"
          @click.stop="setImage(selected)"
          >{{ buttonText }}</v-btn
        >
        <v-btn text @click="open = false">Cancel</v-btn>
      </template>
    </media-container>
  </v-dialog>
</template>

<script>
import mediaProps from '~/mixins/props/media.js';
import dimensionProps from '~/mixins/props/dimensions.js';
import MediaContainer from './MediaContainer.vue';
import camelCase from 'lodash/camelCase';
import pick from 'lodash/pick';

export default {
  name: 'MediaDialog',

  components: { MediaContainer },

  mixins: [mediaProps, dimensionProps],

  props: {
    title: {
      type: String,
      default: 'Media',
    },
    value: {
      type: Boolean,
      default: false,
    },
    header: {
      type: Boolean,
      default: true,
    },
    single: {
      type: Boolean,
      default: false,
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
    fileSize: {
      type: Number,
      default: 120000,
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    scrollable: {
      type: Boolean,
      default: true,
    },
    selectedImage: {
      type: String,
      default: undefined,
    },
    startingTab: {
      type: Number,
      default: 0,
    },
    buttonText: {
      type: String,
      default: 'Set image as avatar',
    },
    title: {
      type: String,
      default: 'Manage Media',
    },
    uploadEndpoint: {
      type: String,
      default: '/media',
    },
    galleryEndpoint: {
      type: String,
      default: '/media',
    },
    uploadKey: {
      type: String,
      default: 'media',
    },
  },

  data() {
    return {
      closeIcon: 'mdi-close',
      setImageIcon: 'mdi-file-image',
      transition: 'dialog-bottom-transition',
    };
  },

  methods: {
    setImage(selected) {
      this.$emit('setImage', selected);
      this.$emit('input', false);
    },
  },

  watch: {
    open(v) {
      if (this.fullscreen && this.scrollable) {
        if (v) document.documentElement.style.overflowY = 'hidden';
        else document.documentElement.style.overflowY = null;
      }
    },
  },

  computed: {
    open: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },

    dialogProps() {
      return pick(this.$props, [
        'maxWidth',
        'minWidth',
        'maxHeight',
        'minHeight',
        'height',
        'width',
        'value',
        'rounded',
        'fullscreen',
        'scrollable',
      ]);
    },

    mediaContainerProps() {
      return pick(this.$props, [
        'maxThumbnailWidth',
        'maxThumbnailHeight',
        'minThumbnailWidth',
        'minThumbnailHeight',
        'single',
        'header',
        'title',
        'rounded',
        'scrollable',
        'fileSize',
      ]);
    },
  },
};
</script>

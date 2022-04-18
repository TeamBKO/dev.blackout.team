<template>
  <v-tab-item>
    <v-item-group v-model="selectedItems">
      <v-container fluid :class="rootClass">
        <template v-if="viewInGrid">
          <v-scale-transition
            group
            tag="div"
            class="row"
            v-if="media && media.length"
          >
            <media-item
              v-for="(item, idx) in media"
              v-model="computedSelected"
              v-bind="thumbnailDimensions"
              @share="$emit('openDialog', item.id)"
              :columnSizes="columnSizes"
              :disableSelect="disableSelect"
              :item="item"
              :key="item.id + '_' + idx"
            ></media-item>
          </v-scale-transition>
        </template>
        <template v-else-if="viewInTable">
          <media-table
            v-model="computedSelected"
            @share="$emit('openDialog', $event)"
            :items="media"
            :disableSelect="disableSelect"
          ></media-table>
        </template>
        <v-row class="fill-height" align="center" justify="center" v-else>
          <div class="no-images">
            <div class="text-center">
              <v-icon :size="size" v-text="icon"></v-icon>
              <p class="text-h4 grey--text font-weight-medium">
                No images found.
              </p>
            </div>
          </div>
        </v-row>
        <v-row align="center" justify="center">
          <div
            class="d-flex justify-center align-center py-2"
            v-intersect="{
              options: {
                threshold: 1.0,
              },
              handler: onIntersect,
            }"
            v-if="hasMore"
          >
            <v-progress-circular
              indeterminate
              color="blue-grey"
              v-if="loading"
            ></v-progress-circular>
          </div>
        </v-row>
      </v-container>
    </v-item-group>
  </v-tab-item>
</template>

<script>
import SETTINGS from '~/constants/settings/public.js';
import { nanoid } from 'nanoid';

import MediaItem from './MediaItem.vue';
import MediaTable from './MediaTable.vue';
import pick from 'lodash/pick';

import mediaProps from '~/mixins/props/media.js';
import mediaMixins from '~/mixins/media.js';

export default {
  name: 'MediaGallery',

  mixins: [mediaProps, mediaMixins],

  components: { MediaItem, MediaTable },

  props: {
    view: {
      type: String,
      default: 'grid',
    },
    currentTab: {
      type: Number,
    },
    imageSelected: {
      type: [String, Array],
    },
    disableSelect: {
      type: Boolean,
      default: false,
    },
    galleryEndpoint: {
      type: String,
      default: '/media',
    },
    tabIsActive: {
      type: Boolean,
      default: false,
    },
    newlyAdded: {
      type: Array,
    },
  },

  data() {
    return {
      icon: 'mdi-file-alert',
      refreshIcon: 'mdi-refresh',
      removeIcon: 'mdi-close',
      size: 120,
      // identifier: nanoid(),
      nextCursor: '',
      prevCursor: '',
      hasMore: true,
      loading: false,
    };
  },

  // watch: {
  //   tabIsActive: {
  //     immediate: true,
  //     handler: function (v) {
  //       if (v) {
  //         if (!this.media.length) {
  //           this.updateList();
  //         }
  //       }
  //     },
  //   },
  // },

  methods: {
    async onIntersect(observer, entries, isIntersecting) {
      if (isIntersecting && this.hasMore) {
        await this.updateList();
      }
    },

    async updateList() {
      this.loading = true;
      try {
        const items = await this.fetchMedia();
        if (items && items.results && items.results.length) {
          if (!items.pageInfo.hasMore) {
            this.hasMore = items.pageInfo.hasMore;
          }
          if (items.pageInfo.next) {
            this.nextCursor = items.pageInfo.next;
          }
          if (items.pageInfo.previous) {
            this.prevCursor = items.pageInfo.previous;
          }

          this.media = this.media.concat(items.results);
        } else {
          this.hasMore = false;
        }
      } catch (err) {
        console.log(err);
        this.$toast.error('Encountered an error.', {
          duration: null,
          action: [
            {
              text: 'Retry',
              onClick: (e, toastObject) => {
                toastObject.goAway(0);
                this.onUpdate();
              },
            },
            {
              text: 'Close',
              onClick: (e, toastObject) => {
                toastObject.goAway(0);
              },
            },
          ],
        });
      } finally {
        this.loading = false;
      }
    },

    async fetchMedia() {
      const url = this.isAdmin ? '/admin/media' : this.galleryEndpoint;

      let params = {};

      if (this.nextCursor) {
        Object.assign(params, { nextCursor: this.nextCursor });
      }

      if (this.newlyAdded && this.newlyAdded.length) {
        Object.assign(params, { exclude: this.newlyAdded.map(({ id }) => id) });
      }

      try {
        const media = await this.$axios.$get(url, {
          params,
        });

        return media;
      } catch (err) {
        return Promise.reject(err);
      }
    },
  },

  computed: {
    viewInGrid() {
      return this.view === 'grid';
    },
    viewInTable() {
      return this.view === 'table';
    },
    allowUsersToShareMedia() {
      return this.$store.getters[SETTINGS.getters.SETTINGS_VALUES](
        'enableAccountMediaSharing'
      );
    },

    rootClass() {
      return { 'no-image': this.media && !this.media.length };
    },

    thumbnailDimensions() {
      return pick(this.$props, [
        'maxThumbnailWidth',
        'maxThumbnailWidth',
        'minThumbnailWidth',
        'minThumbnailWidth',
      ]);
    },

    isAdmin() {
      return (
        this.$auth.loggedIn &&
        this.$auth.hasScope([
          this.$permissions.VIEW_ALL_ADMIN,
          this.$permissions.VIEW_ALL_MEDIA,
        ])
      );
    },

    selectedItems: {
      get() {
        return this.imageSelected;
      },
      set(val) {
        this.$emit('update:imageSelected', val);
      },
    },
  },
};
</script>

<style scoped>
.no-image {
  height: calc(100vh - 165px);
}
</style>

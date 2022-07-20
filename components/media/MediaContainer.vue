<template>
  <v-card tile flat>
    <v-toolbar tile :flat="flat" class="z-index" max-height="112px">
      <template v-if="!hideHeader">
        <v-toolbar-title v-if="!hideHeaderTitle">
          <span class="black--text">{{ title }}</span>
        </v-toolbar-title>
        <v-spacer v-if="!hideHeaderTitle"></v-spacer>
        <delete-dialog
          v-model="open"
          @deleteAll="onDelete"
          @cancel="onCancel"
          :mini="!hideHeaderTitle"
          :length="selected.length"
          :disabled="isDeleteDisabled"
          v-if="canDelete"
        ></delete-dialog>
        <v-btn
          class="v-tab"
          text
          :disabled="isUploadDisabled"
          @click="uploadFiles"
        >
          <v-tooltip bottom>
            <template #activator="props">
              <v-icon left v-text="uploadIcon" v-on="props.on"></v-icon>
            </template>
            Upload
          </v-tooltip>
          <span v-if="hideHeaderTitle">Upload</span>
          <span> {{ upload.length }}</span>
        </v-btn>
        <slot name="close" />
      </template>
      <template #extension>
        <v-tabs v-model="currentTab" :class="tabClasses">
          <v-tab v-if="canUpload">
            <span>Upload Image(s)</span>
          </v-tab>
          <v-tab>
            <span>My Images</span>
          </v-tab>
        </v-tabs>
        <v-spacer></v-spacer>
        <slot name="topActions" v-bind="actionSlotProperties" />

        <v-btn-toggle v-model="view">
          <v-btn small class="v-tab" :value="'grid'">
            <v-icon>mdi-view-grid-outline</v-icon>
          </v-btn>
          <v-btn small class="v-tab" :value="'table'">
            <v-icon>mdi-view-list</v-icon>
          </v-btn>
        </v-btn-toggle>

        <!-- <delete-dialog
          v-model="open"
          @deleteAll="onDelete"
          @cancel="onCancel"
          :length="selected.length"
          :disabled="isDeleteDisabled"
          v-if="canDelete"
        ></delete-dialog>
        <v-btn
          class="v-tab"
          text
          :disabled="isUploadDisabled"
          @click="uploadFiles"
        >
          <v-icon left v-text="uploadIcon"></v-icon>
          <span>Upload {{ upload.length }}</span>
        </v-btn> -->
      </template>
    </v-toolbar>
    <v-card-text class="fill-height">
      <v-tabs-items v-model="tab">
        <media-upload
          v-model="upload"
          v-bind="thumbnailDimensions"
          :uploadProgress="uploadProgress"
          :isSending="isSending"
          :fileSize="fileSize"
          :selected.sync="uploadSelected"
          :single="single"
          :columnSizes="columnSizes"
          :galleryEndpoint="galleryEndpoint"
        ></media-upload>
        <media-gallery
          v-model="gallery"
          v-bind="thumbnailDimensions"
          @openDialog="openSharingDialog"
          :selected.sync="gallerySelected"
          :newlyAdded="newlyAdded"
          :imageSelected.sync="imageSelected"
          :columnSizes="columnSizes"
          :view="view"
          :disableSelect="disableSelect"
          :tabIsActive="isGalleryTab"
        ></media-gallery>
      </v-tabs-items>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <slot name="bottomActions" v-bind="actionSlotProperties" />
    </v-card-actions>
  </v-card>
</template>

<script>
import SETTINGS from '~/constants/settings/public.js';

import MediaGallery from './MediaGallery.vue';
import MediaUpload from './MediaUpload.vue';
import DeleteDialog from '~/components/dialogs/DeleteDialog.vue';
import mediaProps from '~/mixins/props/media.js';
import pick from 'lodash/pick';

export default {
  name: 'MediaContainer',

  components: {
    MediaGallery,
    MediaUpload,
    DeleteDialog,
  },

  mixins: [mediaProps],

  props: {
    header: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
    },
    single: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    startingTab: {
      type: Number,
      default: 0,
    },
    scrollable: {
      type: Boolean,
      default: false,
    },
    uploadKey: {
      type: String,
      default: 'media',
    },
    uploadEndpoint: {
      type: String,
      default: '/media',
    },
    galleryEndpoint: {
      type: String,
      default: '/media',
    },
    disableSelect: {
      type: Boolean,
      default: false,
    },
    hideHeader: {
      type: Boolean,
      default: false,
    },
    hideHeaderTitle: {
      type: Boolean,
      default: false,
    },
    flat: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      columnSizes: {
        md: 2,
        sm: 6,
      },

      view: 'grid',

      deleteIcon: 'mdi-trash-can-outline',
      uploadIcon: 'mdi-cloud-upload-outline',

      extensionHeight: 150,

      gallery: [],
      upload: [],
      newlyAdded: [],

      gallerySelected: [],
      uploadSelected: [],

      imageSelected: '',

      isSending: false,
      openShareDialog: false,
      buttonToggle: 0,
      tab: 0,
      uploadProgress: 0,
      open: false,
    };
  },

  methods: {
    onCancel() {
      this.open = false;
    },

    updateNextCursor(cursor) {
      console.log(cursor);

      this.nextCursor = cursor;
    },

    openSharingDialog(id) {
      if (this.openShareDialog) return;
      this.$refs.shareDialog.loadList(null, id);
      this.$nextTick(() => {
        this.openShareDialog = true;
      });
    },

    async onDelete() {
      if (this.isUploadTab) {
        this.upload = this.upload.filter(
          (item, idx) => !this.uploadSelected.includes(idx)
        );

        this.uploadSelected = [];

        return;
      }

      this.isSending = true;

      try {
        let url = '/media';

        if (this.$auth.hasScope(this.$permissions.DELETE_ALL_MEDIA)) {
          url = '/admin/media';
        } else if (this.$auth.hasScope(this.$permissions.DELETE_OWN_MEDIA)) {
          url = '/media';
        }

        const params = { keys: this.gallerySelected };
        const deleted = (await this.$axios.delete(url, { params })).data;

        this.gallery = this.gallery.filter(({ id }) => !deleted.includes(id));
        this.gallerySelected = [];
        this.$toast.show(`Deleted ${deleted.length} item(s).`, {
          position: 'top-center',
          duration: 3000,
        });
      } catch (err) {
        console.log(err);
        const text =
          'Encountered a problem executing action. Please contact the administrator';
        this.$toast.error(text, {
          position: 'top-center',
          duration: 3000,
        });
      } finally {
        this.isSending = false;
      }
    },

    async uploadFiles() {
      if (!this.isUploadTab || !this.upload.length) return;

      const formData = new FormData();

      const onUploadProgress = (progressEvent) => {
        this.uploadProgress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );

        if (this.uploadProgress === 100) {
          this.$nextTick(() => {
            this.upload = [];
            this.uploadProgress = 0;
          });
        }
      };

      const config = { onUploadProgress };

      this.upload.forEach(({ image }) =>
        formData.append(this.uploadKey, image)
      );

      this.isSending = true;

      try {
        const items = await this.$axios.$post(
          this.uploadEndpoint,
          formData,
          config
        );

        if (items && items.length) {
          this.gallery.unshift(...items);
          this.newlyAdded.push(...items.map(({ id }) => id));
        }

        this.$toast.success('Upload complete.', {
          position: 'top-center',
          duration: 3000,
        });
        this.$emit('onSuccess', items);
      } catch (err) {
        console.log(err);
        this.$toast.error(err.response.data.message, {
          position: 'top-center',
          duration: 3000,
        });
        this.$emit('onError');
      } finally {
        this.isSending = false;
      }
    },
  },

  computed: {
    canUpload() {
      return (
        this.$auth.loggedIn &&
        this.$auth.hasScope([
          [this.$permissions.ADD_ALL_MEDIA],
          [this.$permissions.ADD_OWN_MEDIA],
        ])
      );
    },

    canView() {
      return (
        this.$auth.loggedIn &&
        this.$auth.hasScope([
          [this.$permissions.VIEW_ALL_MEDIA],
          [this.$permissions.VIEW_OWN_MEDIA],
        ])
      );
    },

    canDelete() {
      return (
        this.$auth.loggedIn &&
        this.$auth.hasScope([
          [this.$permissions.DELETE_ALL_MEDIA],
          [this.$permissions.DELETE_OWN_MEDIA],
        ])
      );
    },

    selected() {
      return this.tab === 1 ? this.gallerySelected : this.uploadSelected;
    },

    actionSlotProperties() {
      return {
        selected: this.imageSelected,
        isSending: this.isSending,
        tab: this.tab,
      };
    },

    isUploadTab() {
      return this.tab === 0;
    },

    isGalleryTab() {
      return this.tab === 1;
    },

    isDeleteDisabled() {
      return this.isSending || !this.selected.length;
    },

    isUploadDisabled() {
      return this.isSending || !this.upload.length || !this.isUploadTab;
    },

    tabClasses() {
      return { 'tabs-disabled': this.isSending };
    },

    isScrollable() {
      return { scrollable: this.scrollable };
    },

    thumbnailDimensions() {
      return pick(this.$props, [
        'maxThumbnailWidth',
        'minThumbnailWidth',
        'maxThumbnailHeight',
        'maxThumbnailHeight',
      ]);
    },

    currentTab: {
      get() {
        return this.tab;
      },
      set(val) {
        if (this.isSending) return;
        this.tab = val;
      },
    },
  },
};
</script>

<style style="scss">
.tabs-disabled {
  opacity: 0.7;
}

.z-index {
  z-index: 1;
}
</style>

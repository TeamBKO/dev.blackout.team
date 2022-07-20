<template>
  <v-tab-item>
    <v-container :fluid="!single" :class="containerClasses">
      <v-row
        v-if="singleOrEmpty"
        align="center"
        justify="center"
        :class="rowClasses"
        @drop.prevent="addFile"
        @dragover.prevent
      >
        <div v-if="!media.length" cols="12" class="text-center">
          <v-icon :size="size" v-text="icon"></v-icon>
          <p class="text-h4 grey--text font-weight-medium">
            Drag an image here
          </p>
          <div class="divider-text">
            <div class="left"></div>
            <span>OR</span>
            <div class="right"></div>
          </div>
          <v-btn color="grey" @click="$refs.uploader.click()">
            <v-icon left v-text="uploadIcon"></v-icon>
            <span>Click here to upload an image</span>
          </v-btn>
          <input
            type="file"
            accept="image/*"
            class="upload-btn-single"
            ref="uploader"
            :disabled="isSending"
            @change.prevent.stop="addFile"
          />
        </div>
        <v-col cols="12" v-else>
          <v-img
            :src="media[0].preview"
            :alt="media[0].name"
            :max-width="200"
            :max-height="200"
            :min-width="minThumbnailWidth"
            :min-height="minThumbnailHeight"
          >
            <v-btn icon small top right absolute :disabled="isSending">
              <v-checkbox
                v-model="computedSelected"
                multiple
                :value="0"
              ></v-checkbox>
            </v-btn>
          </v-img>
          <div class="upload-bar" :style="progressBar"></div>
        </v-col>
      </v-row>
      <v-scale-transition group tag="div" class="row" v-else>
        <v-col
          class="upload-image"
          cols="12"
          v-for="(image, idx) in media"
          :key="image.id"
          :md="columnSizes.md"
          :sm="columnSizes.sm"
        >
          <v-img
            :src="image.preview"
            :alt="image.name"
            :max-width="maxThumbnailWidth"
            :max-height="maxThumbnailHeight"
            :min-width="minThumbnailWidth"
            :min-height="minThumbnailHeight"
          >
            <v-btn icon small top right absolute :disabled="isSending">
              <v-checkbox
                v-model="computedSelected"
                multiple
                :value="idx"
              ></v-checkbox>
            </v-btn>
          </v-img>
          <div class="upload-bar" :style="progressBar"></div>
        </v-col>
        <v-col
          cols="12"
          @drop.prevent="addFile"
          @dragover.prevent
          :key="'add'"
          :md="columnSizes.md"
          :sm="columnSizes.sm"
        >
          <div class="text-center upload" @click="$refs.uploader.click()">
            <v-icon :size="size" v-text="icon"></v-icon>
            <input
              type="file"
              accept="image/*"
              class="upload-btn-single"
              ref="uploader"
              multiple
              :disabled="isSending"
              @change.prevent.stop="addFile"
            />
          </div>
        </v-col>
      </v-scale-transition>
    </v-container>
  </v-tab-item>
</template>

<script>
import media from '~/constants/media/public.js';

import mediaProps from '~/mixins/props/media.js';
import mediaMixins from '~/mixins/media.js';
import { nanoid } from 'nanoid';

export default {
  name: 'MediaUpload',

  mixins: [mediaProps, mediaMixins],

  props: {
    uploadProgress: {
      type: Number,
      default: 0,
    },
    isSending: {
      type: Boolean,
      default: false,
    },
    single: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      size: 120,
      uploadIcon: 'mdi-cloud-upload-outline',
      // fileTypes: /\.(jpe?g|png|gif|svg|webp)$/i,
    };
  },

  methods: {
    checkFiles(files) {
      return new Promise((resolve, reject) => {
        for (const file of files) {
          const validFileExt = this.approvedExts.test(file.name);
          const isImage = file.type.startsWith('image/');
          const validFileSize = file.size <= this.fileSize;
          if (!validFileExt) {
            reject('File extention is invalid.');
            break;
          }
          if (!isImage) {
            reject('File is not an image.');
            break;
          }
          if (!validFileSize) {
            const sizeInKb = Math.floor(this.fileSize / 1024);
            reject(`File is too large. Must be ${sizeInKb}kb in size or less.`);
            break;
          }
        }

        resolve();
      });
    },

    async addFile(event) {
      if (this.isSending) return;
      const data =
        event.dataTransfer && event.dataTransfer.files.length
          ? event.dataTransfer.files
          : event.target.files;

      const files = [...data];

      try {
        await this.checkFiles(files);
        files.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (f) => {
            this.media = {
              id: nanoid(10),
              image: file,
              preview: f.target.result,
            };
          };
          reader.readAsDataURL(file);
        });
      } catch (err) {
        console.log(err);

        this.$toast.error(err, { position: 'top-center' });
      }
    },
  },

  computed: {
    singleOrEmpty() {
      return this.single || !this.media.length;
    },
    progressBar() {
      return { height: this.uploadProgress + '%' };
    },
    containerClasses() {
      return [{ 'no-image': !this.media.length }];
    },
    // containerClasses() {
    //   return [{ 'no-image': this.single && !this.media.length || this.singleOrEmpty }];
    // },
    rowClasses() {
      return [{ 'fill-height': this.singleOrEmpty }];
    },
    icon() {
      return this.singleOrEmpty ? 'mdi-image-multiple-outline' : 'mdi-plus';
    },
  },
};
</script>

<style lang="scss" scoped>
.upload {
  border-radius: 1px;
  border-style: dashed;
  padding: 1rem;
  position: relative;
  cursor: pointer;
}

.no-image {
  height: calc(100vh - 165px);
}

.upload-image {
  position: relative;
  .upload-bar {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    opacity: 0.7;
    background-color: #77dd77;
    z-index: 10;
  }
}

.upload-btn {
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: hidden;
  opacity: 0;
  top: 0;
  left: 0;
}

.upload-btn-single {
  display: none;
}

.divider-text {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    padding: 1rem;
  }
  .left,
  .right {
    width: 100px;
    height: 5px;
    background-color: #eee;
  }
}
</style>

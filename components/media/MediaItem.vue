<template>
  <v-col :md="columnSizes.md" :sm="columnSizes.sm">
    <v-item #default="{ active, toggle }" :value="item.url">
      <v-img
        :class="{ 'is-selected': active }"
        :src="item.url"
        :max-width="maxThumbnailWidth"
        :max-height="maxThumbnailHeight"
        :min-width="minThumbnailWidth"
        :min-height="minThumbnailHeight"
        @click="select(toggle)"
      >
        <v-menu
          open-on-hover
          :close-on-content-click="false"
          v-if="showOptions"
        >
          <template #activator="{ on }">
            <v-btn fab small top right absolute v-on="on" color="grey">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item v-if="canShare" @click="$emit('share')" role="button">
              <v-list-item-content>
                <v-list-item-title>Share</v-list-item-title>
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon>mdi-share</v-icon>
              </v-list-item-icon>
            </v-list-item>
            <v-list-item @click="copyToClipboard(item.url)" role="button">
              <v-list-item-content>
                <v-list-item-title>Get Link</v-list-item-title>
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon>mdi-link</v-icon>
              </v-list-item-icon>
            </v-list-item>
            <v-list-item v-if="canDelete">
              <v-list-item-content>
                <v-list-item-title>Delete</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-checkbox
                  v-model="computedSelectedForDeletion"
                  multiple
                  :value="item.storage_key"
                ></v-checkbox>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-img>
    </v-item>
  </v-col>
</template>

<script>
import SETTINGS from '~/constants/settings/public.js';
export default {
  name: 'MediaItem',

  props: {
    columnSizes: {
      type: Object,
      required: true,
      default: () => {},
    },
    item: {
      type: Object,
      required: true,
      default: () => {},
    },
    value: {
      type: Array,
      required: true,
      default: () => [],
    },
    maxThumbnailWidth: {
      type: [Number, String],
    },
    maxThumbnailHeight: {
      type: [Number, String],
    },
    minThumbnailWidth: {
      type: [Number, String],
    },
    minThumbnailHeight: {
      type: [Number, String],
    },
    disableSelect: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    select(toggle) {
      // if (this.avatarAlreadySet) return;
      if (this.disableSelect) return;
      toggle();
    },
    copyToClipboard(value) {
      navigator.clipboard.writeText(value);
      this.$toast.success('Copied to clipboard', { position: 'top-center' });
    },
  },

  computed: {
    allowUsersToShareMedia() {
      return this.$store.getters[SETTINGS.getters.SETTINGS_VALUES](
        'enableAccountMediaSharing'
      );
    },

    showOptions() {
      return this.canShare || this.canDelete;
    },

    isOwner() {
      return this.$auth.user.id === this.item.owner_id;
    },

    canDeleteAll() {
      return this.$auth.hasScope([this.$permissions.DELETE_ALL_MEDIA]);
    },

    canDeleteOwn() {
      return this.$auth.hasScope([this.$permissions.DELETE_OWN_MEDIA]);
    },

    // avatarAlreadySet() {
    //   return this.$auth.user.avatar === this.item.url;
    // },

    canDelete() {
      return (
        this.$auth.loggedIn &&
        ((this.isOwner && this.canDeleteOwn) || this.canDeleteAll)
      );
    },

    canShare() {
      return this.isOwner && this.allowUsersToShareMedia;
    },

    computedSelectedForDeletion: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
};
</script>

<style scoped>
.is-selected {
  border: 2px solid #779ecb;
}
</style>

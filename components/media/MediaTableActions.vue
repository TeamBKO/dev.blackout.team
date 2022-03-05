<template>
  <v-menu v-model="open" :close-on-content-click="false" open-on-hover>
    <template #activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <slot
        name="top"
        v-bind="{ canDelete, canDeleteAll, canDeleteOwn, isOwner, canShare }"
      />
      <v-list-item v-if="canShare" @click="$emit('share')" role="button">
        <v-list-item-content>
          <v-list-item-title>
            <v-icon left small>mdi-share-variant</v-icon>
            <span>Share</span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <slot
        name="bottom"
        v-bind="{ canDelete, canDeleteAll, canDeleteOwn, isOwner, canShare }"
      />
    </v-list>
  </v-menu>
</template>

<script>
import SETTINGS from '~/constants/settings/public.js';
export default {
  name: 'MediaTableActions',

  props: {
    item: {
      type: Object,
      default: () => {},
      required: true,
    },
  },

  data() {
    return {
      open: false,
    };
  },

  computed: {
    isOwner() {
      return this.$auth.user.id === this.item.owner_id;
    },
    canDeleteAll() {
      return this.$auth.hasScope([this.$permissions.DELETE_ALL_MEDIA]);
    },
    canDeleteOwn() {
      return this.$auth.hasScope([this.$permissions.DELETE_OWN_MEDIA]);
    },
    canDelete() {
      return (
        this.$auth.loggedIn &&
        ((this.isOwner && this.canDeleteOwn) || this.canDeleteAll)
      );
    },
    canShare() {
      return this.isOwner && this.allowUsersToShareMedia;
    },
    allowUsersToShareMedia() {
      return this.$store.getters[SETTINGS.getters.SETTINGS_VALUES](
        'enableAccountMediaSharing'
      );
    },
  },
};
</script>

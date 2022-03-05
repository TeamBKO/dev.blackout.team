<template>
  <div class="v__user-settings-avatar">
    <v-avatar :size="adjustedSize" :color="color" style="overflow: visible">
      <v-img :src="item[avatarKey]" v-if="item[avatarKey]"></v-img>
      <span class="white--text headline text-md-h2" v-else>{{ initials }}</span>
    </v-avatar>
    <v-btn
      v-if="showButton"
      fab
      absolute
      right
      :min-width="buttonSize"
      :min-height="buttonSize"
      :max-width="buttonSize"
      :max-height="buttonSize"
      :size="adjustedSize"
      :style="{ top: '-15px', right: '0px' }"
      @click="$emit('update-avatar')"
    >
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
  </div>
</template>

<script>
import avatar from '~/mixins/avatar.js';
export default {
  name: 'UserSettingsAvatar',
  props: {
    item: {
      type: Object,
      required: true,
    },
    avatarKey: {
      type: String,
      default: 'avatar',
    },
    nameKey: {
      type: String,
      default: 'username',
    },
    size: {
      type: Number,
      default: 62,
    },
    color: {
      type: String,
      default: 'primary',
    },
    showButton: {
      type: Boolean,
      default: true,
    },
  },
  mixins: [avatar],

  computed: {
    adjustedSize() {
      const isSmAndDown = this.$vuetify.breakpoint.smAndDown;
      return isSmAndDown ? Math.round(this.size / 2) : this.size;
    },
    buttonSize() {
      return Math.round(this.adjustedSize / 2.5);
    },
    initials() {
      if (this.item[this.nameKey]) {
        const username = this.item[this.nameKey];
        const initials = username.match(/\b\w/g) || [];
        return (
          (initials.shift() || '') + (initials.pop() || '')
        ).toUpperCase();
      }
    },
  },
};
</script>

<style scoped>
.v__user-settings-avatar {
  position: relative;
}
</style>

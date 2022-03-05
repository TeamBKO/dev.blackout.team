<template>
  <v-avatar :size="size" :color="color" v-if="!isEditable">
    <v-img :src="item[avatarKey]" v-if="item[avatarKey]"></v-img>
    <span class="white--text" v-else>
      {{ initials }}
    </span>
  </v-avatar>
  <v-badge
    avatar
    bordered
    overlap
    @click.native.stop="$emit('edit-profile-image')"
    style="overflow: visible"
    v-else
  >
    <template v-slot:badge>
      <v-avatar>
        <v-icon>mdi-image-edit-outline</v-icon>
      </v-avatar>
    </template>
    <v-avatar :size="size" :color="color">
      <v-img :src="item[avatarKey]" alt v-if="item[avatarKey]" />
      <span class="white--text headline" v-else>{{ initials }}</span>
    </v-avatar>
  </v-badge>
</template>

<script>
export default {
  name: 'ListAvatar',

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
      type: [String, Number],
      default: 40,
    },
    color: {
      type: String,
      default: 'primary',
    },
    isEditable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
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

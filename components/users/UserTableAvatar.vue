<template>
  <v-avatar color="primary">
    <v-img :src="src" alt v-if="src" />
    <span class="white--text headline" v-else>{{ initials }}</span>
  </v-avatar>
</template>

<script>
export default {
  name: 'UserTableAvatar',
  props: {
    username: {
      type: String,
    },
    src: {
      type: String,
    },
  },

  computed: {
    initials() {
      const initials = this.username.match(/\b\w/g) || [];

      return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    },
  },
};
</script>
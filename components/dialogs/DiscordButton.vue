<template>
  <div class="d-flex justify-center" @click="loginWithDiscord">
    <v-btn :block="block" :color="color" large>
      <v-icon>{{ icon }}</v-icon>
      <span class="pl-2">{{ label }}</span>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'DiscordButton',

  props: {
    label: {
      type: String,
      default: 'Login with Discord',
    },
    icon: {
      type: String,
      default: 'mdi-discord',
    },
    color: {
      type: [String, Number],
      default: '#7289da',
    },
    block: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    async loginWithDiscord() {
      try {
        await this.$auth.loginWith('bko');
      } catch (err) {
        this.$toast.error(err.response.data.message, {
          position: 'top-center',
        });
      }
    },
  },
};
</script>

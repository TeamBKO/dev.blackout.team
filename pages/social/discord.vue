<template>
  <v-container fluid fill-height>
    <v-row align="center" justify="center">
      <div class="d-flex flex-column justify-center align-center">
        <p class="text-h2">{{ text }}</p>
        <v-progress-circular indeterminate :size="96"></v-progress-circular>
      </div>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'DiscordSocialLinkPage',

  layout: 'headerless',

  async asyncData(ctx) {
    const { code, state } = ctx.query;
    if (!ctx.$auth.loggedIn) {
      return { isLoading: false, text: 'You must be logged in.' };
    }
    try {
      await ctx.$axios.post('/social/discord', { code, state });
      return { isLoading: true, text: 'Linking...' };
    } catch (err) {
      return { isLoading: false, text: `Encountered an error: ${err.message}` };
    }
  },
};
</script>

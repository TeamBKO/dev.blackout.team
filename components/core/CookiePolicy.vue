<template>
  <v-card class="privacy" v-if="showCookiePolicy" :max-width="width">
    <v-card-title>
      <v-icon left>mdi-cookie-alert</v-icon>
      <span>Cookie Policy</span>
    </v-card-title>
    <v-card-text>
      <p>
        We use cookies to personalise content and to provide social media
        features and to analyse our traffic. We also might share information
        about your use of our site with our social media, advertising and
        analytics partners who may combine it with other information that you’ve
        provided to them or that they’ve collected from your use of their
        services.
      </p>
      <p>
        By closing this dialog you agree that we can store cookies on your
        device and disclose information.
      </p>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="setCookiePolicyState">Okay, I understand.</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import cookie from 'js-cookie';

export default {
  name: 'CookiePolicyCard',

  created() {
    if (process.client) {
      const isCookieSet = cookie.get('cookie-policy');
      if (isCookieSet) this.showCookiePolicy = false;
    }
  },

  data() {
    return {
      showCookiePolicy: true,
      width: 500,
    };
  },

  methods: {
    setCookiePolicyState() {
      cookie.set('cookie-policy', true, { expires: 7 });
      this.showCookiePolicy = false;
    },
  },
};
</script>

export default {
  data() {
    return {
      gresponse: null,
    };
  },

  methods: {
    onSuccess(response) {
      this.gresponse = response;
    },
    onExpiry() {
      this.resetRecaptcha();
    },
    onError() {
      this.resetRecaptcha();
    },
    resetRecaptcha() {
      this.gresponse = null;
      this.$recaptcha.reset();
    },
  },
};

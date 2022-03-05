<template>
  <v-container fill-height>
    <v-row align="center" justify="center">
      <v-sheet rounded width="70%" class="text-center my-4">
        <v-icon :size="iconSize" v-text="icons[status]"></v-icon>
        <div class="text-h3">Account Activation</div>
        <p class="text-h5">{{ message }}</p>
        <v-btn
          x-large
          block
          v-if="resend"
          @click="resendCode"
          :disabled="isDisabled"
          >{{ shouldDisplayTime }}</v-btn
        >
      </v-sheet>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'UserAccountActivation',

  layout: 'default',

  middleware: [
    ({ query, redirect }) => {
      if (!query.code || !query.id) return redirect('/');
    },
  ],

  async asyncData({ query, $axios }) {
    try {
      const resp = await $axios.post('/users/activation', {
        code: query.code,
        id: query.id,
      });

      return {
        status: resp.data.status,
        resend: resp.data.resend,
        message: resp.data.message,
        startTimer: resp.data.startTimer,
        endTime: resp.data.endTime,
      };
    } catch (err) {
      console.log(err);
    }
  },

  mounted() {
    if (this.startTimer) {
      this.startResendTimer();
    }
  },

  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },

  data() {
    return {
      icons: ['mdi-account-check', 'mdi-account-alert'],
      resend: false,
      iconSize: 200,
      status: 0,
      message: '',
      startTimer: false,
      endTime: 0,
      count: 0,
      timer: null,
    };
  },

  methods: {
    startResendTimer() {
      const endTime = this.endTime;

      this.timer = setInterval(() => {
        let now = new Date().getTime();
        this.count = endTime - now;
        if (this.count <= 0) {
          clearInterval(this.timer);
          this.startTimer = false;
          this.timer = null;
          this.count = 0;
        }
      }, 1000);
    },

    async resendCode() {
      const id = this.$route.query.id;
      const code = this.$route.query.code;

      try {
        const { startTimer, endTime, resend } = (
          await this.$axios.post('/users/resend/activation', { id, code })
        ).data;

        this.resend = resend;
        this.startTimer = startTimer;
        this.endTime = endTime;

        const text =
          "We've dispatched an email with the activation instructions.";
        this.$toast.success(text, { position: 'top-center' });
        this.startResendTimer();
      } catch (err) {
        this.$toast.error(err.message, { position: 'top-center' });
        console.log(err);
      }
    },
  },
  computed: {
    displayTime() {
      return this.$dayjs(this.count).format('mm:ss');
    },
    shouldDisplayTime() {
      return !this.startTimer && !this.count ? 'RESEND' : this.displayTime;
    },
    isDisabled() {
      return this.startTimer;
    },
  },
};
</script>

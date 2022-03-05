<template>
  <v-btn x-large block :color="color" :disabled="isDisabled">{{
    displayTimeOrLabel
  }}</v-btn>
</template>

<script>
export default {
  name: 'CountdownButton',

  props: {
    startTimer: {
      type: Boolean,
      default: true,
    },
    endTime: {
      type: Number,
      default: 0,
    },
    activeLabel: {
      type: [String, Number],
      default: 'RESEND',
    },
    color: {
      type: String,
    },
  },

  mounted() {
    if (this.startTimer) {
      this.startCountdown();
    }
  },

  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },

  data() {
    return {
      count: 0,
      timer: null,
    };
  },

  methods: {
    startCountdown() {
      const endTime = this.endTime;

      this.timer = setInterval(() => {
        let now = new Date().getTime();
        this.count = endTime - now;
        if (this.count <= 0) {
          clearInterval(this.timer);
          this.timer = null;
          this.count = 0;
          this.$emit('complete');
        }
      }, 1000);
    },
  },

  computed: {
    displayTime() {
      return this.$dayjs(this.count).format('mm:ss');
    },
    displayTimeOrLabel() {
      return !this.startTimer ? this.activeLabel : this.displayTime;
    },
    isDisabled() {
      return this.startTimer;
    },
  },
};
</script>

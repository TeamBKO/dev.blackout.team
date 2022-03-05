<template>
  <v-btn
    block
    v-bind="$attrs"
    v-if="show"
    :disabled="disabled || !!startingCount"
    >{{ startingCount ? displayTime : 'Submit' }}</v-btn
  >
</template>

<script>
export default {
  name: 'ResendButton',

  props: {
    startingCount: {
      type: Number,
      default: 0,
    },
    show: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      count: 0,
      timer: null,
    };
  },

  watch: {
    startingCount(v) {
      if (v) this.startResendTimer();
    },
  },

  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },

  methods: {
    startResendTimer() {
      const sCount = new Date(this.startingCount).getTime();

      this.timer = setInterval(() => {
        const time = new Date().getTime();
        this.count = sCount - time;
        if (this.count === 0) {
          clearInterval(this.timer);
          this.timer = null;
          this.startingCount = 0;
        }
      }, 1000);
    },
  },

  computed: {
    displayTime() {
      return this.$dayjs(this.count).format('mm:ss');
    },
  },
};
</script>

export default function (count = 3) {
  return {
    data() {
      return {
        count: count,
        timer: null,
      };
    },

    methods: {
      startRedirectTimer() {
        this.timer = setInterval(() => {
          if (!this.count) {
            clearInterval(this.timer);
            this.timer = null;
            // this.redirect('/');
          }
          this.count--;
        }, 1000);
      },
    },

    computed: {
      redirectMessage() {
        return `Redirect in ${this.count} seconds...`;
      },
    },

    beforeDestroy() {
      clearInterval(this.timer);
      this.timer = null;
    },
  };
}

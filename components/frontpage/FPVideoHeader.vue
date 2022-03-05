<template>
  <div class="video-container">
    <video
      ref="video"
      id="video-header"
      autoplay=""
      loop=""
      :width="width"
      :height="height"
    >
      <source :src="src" :type="type" />
    </video>
    <div class="video-play" @click="toggleVideoStatus">
      <v-icon x-large>{{ videoStatus }}</v-icon>
    </div>
    <div class="scroll-down" @click.stop="scrollDown">
      <span>scroll</span>
      <svg
        class="scroll-icon"
        style="width: 24px; height: 24px"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
        />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FPVideoHeader',
  props: {
    src: {
      type: String,
      default: 'https://blackout-gaming.s3.amazonaws.com/video/0001-0876.webm',
    },
    type: {
      type: String,
      default: 'video/webm',
    },
    width: {
      type: [Number, String],
      default: '100%',
    },
    height: {
      type: [Number, String],
      default: '100%',
    },
  },

  data() {
    return {
      paused: false,
    };
  },

  methods: {
    toggleVideoStatus() {
      if (this.paused) {
        this.$refs.video.play();
        this.paused = false;
      } else {
        this.$refs.video.pause();
        this.paused = true;
      }
    },
    scrollDown() {
      const el = document.querySelector('[data-id="1"]');
      el.scrollIntoView({ behavior: 'smooth' });
    },
  },

  computed: {
    videoStatus() {
      return this.paused ? 'mdi-play' : 'mdi-pause';
    },
  },
};
</script>

<style scoped lang="scss">
.video-container {
  position: relative;
  width: 100%;
  height: 100vh;
  &:hover {
    .video-play {
      opacity: 0.6;
      display: flex;
    }
  }
  .video-play {
    display: none;
    position: absolute;
    top: 50%;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #222;
    justify-content: center;
    align-items: center;
    opacity: 0;
    cursor: pointer;
    transition: opacity 0.25s ease;
  }
  .scroll-icon {
    animation: scrollDown 1.5s infinite;
  }
  .scroll-down {
    bottom: 100px;
    right: 4px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9;
    cursor: pointer;
    text-align: center;
    transition: all 0.6 ease;
    span {
      font-size: 12px;
      line-height: 1.5;
      letter-spacing: 5px;
      text-transform: uppercase;
      display: block;
    }
  }
  #video-header {
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    transform: none;
    object-fit: cover;
  }
}

@keyframes scrollDown {
  0% {
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    -webkit-transform: translate(0px, 10px);
    transform: translate(0px, 10px);
    opacity: 0;
  }
}
</style>

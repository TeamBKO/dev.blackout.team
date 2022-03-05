<template>
  <ol class="monoliths">
    <li v-for="(item, idx) in items" :key="idx">
      <img :src="item.src" :alt="item.alt" />
    </li>
  </ol>
</template>

<script>
export default {
  name: 'FrontPageMonoliths',

  data() {
    return {
      url: 'https://blackout-gaming.s3.amazonaws.com/Images/monolith/games/',
    };
  },

  computed: {
    items() {
      return [
        { src: `${this.url}last.jpg`, alt: 'Last Oasis' },
        { src: `${this.url}albion.jpg`, alt: 'Albion Online' },
        { src: `${this.url}nw.png`, alt: 'New World' },
        { src: `${this.url}starbase.png`, alt: 'Starbase' },
      ];
    },
  },
};
</script>

<style lang="scss">
.monoliths {
  display: flex;
  padding-bottom: 1px;
  overflow: hidden;
  list-style-type: none;
  padding-left: 0 !important;

  li {
    width: 25%;
  }

  img {
    display: block;
    height: 33rem;
    width: 100%;
    object-fit: cover;
    object-position: 50% 20%;
  }
}

@supports (clip-path: polygon(0 0)) or (-webkit-clip-path: polygon(0 0)) {
  .monoliths li {
    width: 38.5%;
    margin-right: -9.5%;
    -webkit-clip-path: polygon(25% 0, 100% 0, 75% 100%, 0 100%);
    clip-path: polygon(25% 0, 100% 0, 75% 100%, 0 100%);
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>

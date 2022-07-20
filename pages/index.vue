<template>
  <section id="home">
    <video-header
      :src="settings.frontPageVideoUrl.value"
      v-if="showVideoOnMobile || showVideo"
    ></video-header>
    <v-container dark class="pa-0" fluid>
      <info-block data-id="1" :data="blocks[0]" :idx="0" />
      <info-block :data="blocks[1]" :idx="1">
        <monolith-block />
      </info-block>
      <info-block :data="blocks[2]" :idx="2">
        <div class="side-image">
          <img
            src="https://lobucket.s3.ca-central-1.amazonaws.com/images/content.webp"
            alt=""
          />
        </div>
      </info-block>
    </v-container>
    <testimonies v-if="settings.showTestimonies.value" />
    <v-container fluid fill-height class="pa-0">
      <v-carousel
        v-model="model"
        class="fill-height history-slides"
        :height="height"
        :vertical-delimiters="verticalDelimiters"
        :hide-delimiter-background="hideDelimiterBackground"
      >
        <carousel-item
          :title="item.title"
          :src="item.src"
          :justify="item.justify"
          v-for="(item, idx) in items"
          :key="idx"
        >
          {{ item.text }}
        </carousel-item>
      </v-carousel>
    </v-container>
  </section>
</template>

<script>
import InfoBlock from '~/components/frontpage/FPBlock.vue';
import CarouselItem from '~/components/frontpage/CarouselItem.vue';
import MonolithBlock from '~/components/frontpage/Monoliths.vue';
import VideoBanner from '~/components/frontpage/FPVideoBanner.vue';
import VideoHeader from '~/components/frontpage/FPVideoHeader.vue';
import Testimonies from '~/components/frontpage/TestimonyCarousel.vue';

import settings from '~/constants/settings/public.js';

export default {
  name: 'Home',
  layout: 'default',

  components: {
    InfoBlock,
    MonolithBlock,
    VideoBanner,
    VideoHeader,
    CarouselItem,
    Testimonies,
  },

  head() {
    return { title: 'Blackout Gaming Community' };
  },

  mounted() {
    if (this.$route.query.code && this.$route.query.state) {
      history.pushState(null, '', location.href.split('?')[0]);
    }
  },

  data() {
    return {
      model: 0,
      verticalDelimiters: 'top',
      hideDelimiterBackground: false,
      height: '100vh',

      testimonies: [
        {
          avatar:
            'https://blackout-gaming.s3.amazonaws.com/Images/testimony/admeer.png',
          author: 'admeer',
          text: 'fuck bko',
        },
        {
          avatar:
            'https://blackout-gaming.s3.amazonaws.com/Images/testimony/2b.png',
          author: '2b',
          text: 'is BKO that big of an issue?',
        },
        {
          avatar:
            'https://blackout-gaming.s3.amazonaws.com/Images/testimony/artemis.png',
          author: 'artemis',
          text: "BKO is going to cause the downfall of this game with the ridiculous amount of hexes they're screwing up.",
        },
        {
          avatar:
            'https://blackout-gaming.s3.amazonaws.com/Images/testimony/beast.png',
          author: 'baast',
          text: "mhmm, there's this BKO guild in NA-W thats huge and just roam around raiding people, been dodging them hard as hard as we try, nothing we can do when 30 repeaters are raining on us.",
        },
        {
          avatar:
            'https://blackout-gaming.s3.amazonaws.com/Images/testimony/blucobra.png',
          author: 'blucobra',
          text: 'yah I know them and BKD or BKO or whatever there called are ruthlesss. I spawned in a new tile last night bam killed on sit 3 times and when I went to trader to get away they were outside in all directions waiting lol.',
        },
        {
          avatar:
            'https://blackout-gaming.s3.amazonaws.com/Images/testimony/ghost.png',
          author: 'ghost',
          text: 'anyone know who this BKO clan is? Clan of griefers.',
        },
        {
          avatar:
            'https://blackout-gaming.s3.amazonaws.com/Images/testimony/kswest.png',
          author: 'kswest',
          text: "Lol. Just logged into my peaceful allied server of like 10-12 clans getting fuckin decimated by 50+ bko zerg. Good fuckin times. Apparently it really is assimilate to the 1000+ man zerg or don't play.",
        },
      ],

      items: [
        {
          title: 'Albion Online',
          src: 'https://blackout-gaming.s3.amazonaws.com/Images/slides/fullscreen/albion.jpg',
          justify: 'center',
          text: `<p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nam eu lorem eu turpis tincidunt convallis ac et lorem.
                        Pellentesque scelerisque nunc in enim rhoncus, quis
                        aliquet turpis cursus. Duis a mi dui. Vivamus lacus
                        ipsum, feugiat sit amet tempus ut, sagittis ut libero.
                        Quisque volutpat mauris eget aliquam accumsan. Nullam
                        euismod tortor quis neque commodo fringilla. Phasellus
                        odio libero, lacinia sit amet efficitur sed, consectetur
                        in nisi. Praesent tempor, nibh ut ultricies vehicula,
                        quam sapien venenatis felis, accumsan pellentesque
                        libero eros nec massa. Suspendisse potenti. Pellentesque
                        habitant morbi tristique senectus et netus et malesuada
                        fames ac turpis egestas. Sed a urna non nunc finibus
                        tincidunt eget non sem. Nulla rutrum vestibulum sem,
                        quis pharetra mauris finibus at. Praesent tristique
                        venenatis dui. Ut felis turpis, laoreet vel dui a,
                        mollis euismod nibh. Vestibulum eget sem est.
                      </p>`,
        },
        {
          title: 'Starbase',
          src: 'https://blackout-gaming.s3.amazonaws.com/Images/slides/fullscreen/starbase.jpg',
          justify: 'end',
          text: `<p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nam eu lorem eu turpis tincidunt convallis ac et lorem.
                        Pellentesque scelerisque nunc in enim rhoncus, quis
                        aliquet turpis cursus. Duis a mi dui. Vivamus lacus
                        ipsum, feugiat sit amet tempus ut, sagittis ut libero.
                        Quisque volutpat mauris eget aliquam accumsan. Nullam
                        euismod tortor quis neque commodo fringilla. Phasellus
                        odio libero, lacinia sit amet efficitur sed, consectetur
                        in nisi. Praesent tempor, nibh ut ultricies vehicula,
                        quam sapien venenatis felis, accumsan pellentesque
                        libero eros nec massa. Suspendisse potenti. Pellentesque
                        habitant morbi tristique senectus et netus et malesuada
                        fames ac turpis egestas. Sed a urna non nunc finibus
                        tincidunt eget non sem. Nulla rutrum vestibulum sem,
                        quis pharetra mauris finibus at. Praesent tristique
                        venenatis dui. Ut felis turpis, laoreet vel dui a,
                        mollis euismod nibh. Vestibulum eget sem est.
                      </p>`,
        },
        {
          title: 'Last Oasis',
          src: 'https://blackout-gaming.s3.amazonaws.com/Images/slides/fullscreen/lastoasis.jpg',
          text: `<p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nam eu lorem eu turpis tincidunt convallis ac et lorem.
                        Pellentesque scelerisque nunc in enim rhoncus, quis
                        aliquet turpis cursus. Duis a mi dui. Vivamus lacus
                        ipsum, feugiat sit amet tempus ut, sagittis ut libero.
                        Quisque volutpat mauris eget aliquam accumsan. Nullam
                        euismod tortor quis neque commodo fringilla. Phasellus
                        odio libero, lacinia sit amet efficitur sed, consectetur
                        in nisi. Praesent tempor, nibh ut ultricies vehicula,
                        quam sapien venenatis felis, accumsan pellentesque
                        libero eros nec massa. Suspendisse potenti. Pellentesque
                        habitant morbi tristique senectus et netus et malesuada
                        fames ac turpis egestas. Sed a urna non nunc finibus
                        tincidunt eget non sem. Nulla rutrum vestibulum sem,
                        quis pharetra mauris finibus at. Praesent tristique
                        venenatis dui. Ut felis turpis, laoreet vel dui a,
                        mollis euismod nibh. Vestibulum eget sem est.
                      </p>`,
        },
        {
          title: 'New World Oasis',
          src: 'https://blackout-gaming.s3.amazonaws.com/Images/slides/fullscreen/newworld.jpg',
          text: `<p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nam eu lorem eu turpis tincidunt convallis ac et lorem.
                        Pellentesque scelerisque nunc in enim rhoncus, quis
                        aliquet turpis cursus. Duis a mi dui. Vivamus lacus
                        ipsum, feugiat sit amet tempus ut, sagittis ut libero.
                        Quisque volutpat mauris eget aliquam accumsan. Nullam
                        euismod tortor quis neque commodo fringilla. Phasellus
                        odio libero, lacinia sit amet efficitur sed, consectetur
                        in nisi. Praesent tempor, nibh ut ultricies vehicula,
                        quam sapien venenatis felis, accumsan pellentesque
                        libero eros nec massa. Suspendisse potenti. Pellentesque
                        habitant morbi tristique senectus et netus et malesuada
                        fames ac turpis egestas. Sed a urna non nunc finibus
                        tincidunt eget non sem. Nulla rutrum vestibulum sem,
                        quis pharetra mauris finibus at. Praesent tristique
                        venenatis dui. Ut felis turpis, laoreet vel dui a,
                        mollis euismod nibh. Vestibulum eget sem est.
                      </p>`,
        },
        {
          title: 'Life is Feudal: MMO',
          src: 'https://blackout-gaming.s3.amazonaws.com/Images/slides/fullscreen/lif.jpg',
          text: `<p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nam eu lorem eu turpis tincidunt convallis ac et lorem.
                        Pellentesque scelerisque nunc in enim rhoncus, quis
                        aliquet turpis cursus. Duis a mi dui. Vivamus lacus
                        ipsum, feugiat sit amet tempus ut, sagittis ut libero.
                        Quisque volutpat mauris eget aliquam accumsan. Nullam
                        euismod tortor quis neque commodo fringilla. Phasellus
                        odio libero, lacinia sit amet efficitur sed, consectetur
                        in nisi. Praesent tempor, nibh ut ultricies vehicula,
                        quam sapien venenatis felis, accumsan pellentesque
                        libero eros nec massa. Suspendisse potenti. Pellentesque
                        habitant morbi tristique senectus et netus et malesuada
                        fames ac turpis egestas. Sed a urna non nunc finibus
                        tincidunt eget non sem. Nulla rutrum vestibulum sem,
                        quis pharetra mauris finibus at. Praesent tristique
                        venenatis dui. Ut felis turpis, laoreet vel dui a,
                        mollis euismod nibh. Vestibulum eget sem est.
                      </p>`,
        },
      ],

      blocks: [
        {
          title: 'ABOUT US',
          text: `We are a group of hardcore PvPers that were at one point all enemies but have come together as one efficient and disciplined group.
            Our goal is to let our skill and coordination show through our victories on the battlefield.`,
          image: {
            src: 'https://blackout-gaming.s3.amazonaws.com/Images/slides/about/bko.png',
            widthInPx: 700,
            heightInPx: 363,
          },
        },
        {
          title: 'GAMES WE PLAY',
          text: `Our current primary focus is Last Oasis, but we can also be found playing other games such as Albion Online, and the upcoming Starbase. We also have vested interest in upcoming games like Profane, Corepunk and New World`,
          image: {
            src: 'https://blackout-gaming.s3.amazonaws.com/Images/webx/bko-black.webp',
            widthInPx: 700,
            heightInPx: 363,
          },
        },
        {
          title: 'OUR CONTENT',
          text: `We are in the process of building up our Twitch and Youtube channels to bring you videos and tutorials. Stay tuned for more information!`,
          image: {
            src: 'https://blackout-gaming.s3.amazonaws.com/Images/webx/bko-black.webp',
            widthInPx: 700,
            heightInPx: 363,
          },
        },
      ],
    };
  },

  computed: {
    settings() {
      return this.$store.getters[settings.getters.SETTINGS](
        'showVideo',
        'showVideOnMobile',
        'showTestimonies',
        'frontPageVideoUrl'
      );
    },
    showVideo() {
      return this.settings.showVideo.value;
    },
    showVideoOnMobile() {
      return (
        this.settings.showVideo.value &&
        this.settings.showVideoOnMobile.value &&
        this.$vuetify.breakpoint.mobile
      );
    },
  },
};
</script>

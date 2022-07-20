<template>
  <v-container id="testimonies">
    <v-fade-transition>
      <v-row>
        <v-col cols="12" md="3" v-for="(item, idx) in items" :key="idx">
          <v-card>
            <v-card-title>
              <v-list-item class="grow">
                <v-list-item-avatar>
                  <v-img :src="item.avatar"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ item.author }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card-title>
            <v-card-text>
              <p>{{ item.text }}</p>
            </v-card-text>
          </v-card>
        </v-col>
        <div class="t-carousel-controls">
          <v-btn
            fab
            absolute
            left
            class="t-control previous"
            @click.stop="getItems('previous')"
            :disabled="!pageInfo.hasPrevious"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn
            fab
            absolute
            right
            class="t-control next"
            @click.stop="getItems('next')"
            :disabled="!pageInfo.hasNext"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </v-row>
    </v-fade-transition>
  </v-container>
</template>

<style scoped lang="scss">
#testimonies {
  position: relative;
  overflow: visible;
  .t-carousel-controls {
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
    margin: 0 auto;
  }
  .t-control {
    top: 37%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(55, 55, 55, 0.6);
    &.next {
      right: -75px;
    }
    &.previous {
      left: -75px;
    }
  }
}
</style>

<script>
const isUndefined = (val) => val === undefined;

export default {
  name: 'TestimonyCarousel',

  async fetch() {
    await this.getItems();
  },

  data() {
    return {
      items: [],
      pageInfo: {
        next: '',
        previous: '',
        hasMore: false,
        hasNext: false,
        hasPrevious: false,
      },
    };
  },

  methods: {
    setPageInfo(obj) {
      if (!obj?.pageInfo) return;
      return Object.entries(obj.pageInfo).reduce((output, [key, val]) => {
        if (this.pageInfo[key] === undefined) return output;
        output[key] = val;
        return output;
      }, {});
    },

    isValidCursorType(type) {
      return type && (type === 'previous' || type === 'previous');
    },
    async getItems(cursorType) {
      // if (!this.isValidCursorType(cursorType)) {
      //   throw ReferenceError('Cursor type must be of next or previous');
      // }

      let request = this.$axios.$get(`/posts/testimonies`);

      if (cursorType) {
        request = this.$axios.$get(`/posts/testimonies`, {
          params: {
            [cursorType]: this.pageInfo[cursorType],
          },
        });
      }

      try {
        const items = await request;

        if (items.results?.length) {
          this.items = items.results;
          this.pageInfo = this.setPageInfo(items);
        }
      } catch (err) {}
    },
  },
};
</script>

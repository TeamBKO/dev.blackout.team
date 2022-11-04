<template>
  <v-menu
    v-model="open"
    dark
    offset-y
    :min-width="470"
    :max-width="470"
    :activator="activator"
    :close-on-content-click="false"
    :nudge-left="450"
    :style="{ 'overflow-y': 'hidden' }"
  >
    <template #activator="{ on }">
      <slot name="activator" v-bind="{ on }" />
    </template>

    <v-card id="emoji" :min-width="470" :style="{ 'overflow-y': 'hidden' }">
      <v-toolbar>
        <v-toolbar-title> </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn small icon @click.stop="open = false">
          <v-icon small>mdi-close</v-icon>
        </v-btn>
        <template #extension>
          <v-text-field
            v-model="tag"
            solo-inverted
            :append-icon="'mdi-magnify'"
          ></v-text-field>
        </template>
      </v-toolbar>
      <div class="emoji-tabs pt-2 px-2">
        <div class="d-flex flex-column emoji-tabs-wrapper">
          <template v-for="e in emoji">
            <v-btn
              v-if="e.emojiList.length"
              icon
              class="py-2"
              @click.prevent="scrollIntoView(e.group)"
              :key="e.group"
            >
              <v-icon color="grey">{{ e.icon }}</v-icon>
            </v-btn>
          </template>
        </div>
      </div>
      <v-card-text
        class="d-flex pl-12 emoji-grid-container"
        ref="emojiGridContainer"
      >
        <discord-emoji-picker-grid
          ref="discordEmojiPickerGrid"
          @getEmoji="onEmojiClick"
        ></discord-emoji-picker-grid>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
import debounce from 'lodash/debounce';
import DiscordEmojiPickerGrid from './DiscordEmojiPickerGrid.vue';
export default {
  name: 'DiscordEmojiPicker',

  props: {
    activator: null,
  },

  components: { DiscordEmojiPickerGrid },

  data() {
    return {
      open: false,
      internalValue: '',
    };
  },

  watch: {
    open(v) {
      if (!v) this.$store.commit('emoji/SET_TAG', '');
    },
  },

  methods: {
    onEmojiClick(emoji) {
      this.$emit('getEmoji', emoji);
      this.open = false;
    },
    scrollIntoView(key) {
      const el = this.$refs.discordEmojiPickerGrid.$el.querySelector(`#${key}`);

      const container = this.$refs.emojiGridContainer;

      container.scrollTop = el.offsetTop;
    },
  },

  computed: {
    tag: {
      get() {
        return this.$store.getters['emoji/tag'];
      },
      set: debounce(function (value) {
        this.$store.commit('emoji/SET_TAG', value);
      }, 500),
    },

    emoji() {
      return this.$store.getters['emoji/emoji'];
    },
  },
};
</script>

<style lang="scss">
#emoji {
  position: relative;
  .emoji-tabs {
    position: absolute;
    height: 100%;
    top: 112px;
    left: 0;
    z-index: 1000;
  }
  .emoji-grid-container {
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    height: 300px;
  }
  .emoji-tabs-wrapper {
    height: 300px;
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-width: none;
    padding-bottom: 0.75rem;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>

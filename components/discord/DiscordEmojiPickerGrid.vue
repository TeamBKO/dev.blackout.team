<template>
  <v-container fluid class="py-0 my-0">
    <v-expansion-panels flat multiple v-model="panels">
      <template v-for="(emoji, idx) in emoji">
        <accordion
          v-if="emoji.emojiList.length"
          :value="panels.includes(idx)"
          :id="emoji.group"
          :root-class="'pt-0 px-0 pb-3'"
          :content-class="'px-1'"
          :header-height="24"
          :key="emoji.group"
        >
          <template #header="{ iconClass }">
            <v-list-item class="pa-0">
              <v-list-item-icon class="mr-0 py-0">
                <v-icon small left>{{ emoji.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="mr-0" :style="{ flex: 'unset' }">
                <strong
                  ><span class="emoji-type">{{
                    emoji.group.toUpperCase()
                  }}</span></strong
                >
              </v-list-item-content>
              <v-list-item-action class="ml-0">
                <v-btn small icon>
                  <v-icon small :class="iconClass">mdi-chevron-right</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </template>
          <v-container fluid class="pa-0 ma-0">
            <v-row class="py-2">
              <v-col
                col="2"
                class="flex-grow-0 px-1 py-0"
                v-for="(e, i) in emoji.emojiList"
                :key="i"
              >
                <v-btn icon @click="$emit('getEmoji', e.unicode)">
                  <span class="emoji">{{ e.unicode }}</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </accordion>
      </template>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import Accordion from '~/components/controls/Accordion.vue';

export default {
  name: 'DiscordEmojiPicker',

  components: {
    Accordion,
  },

  created() {
    this.panels = Array.from({ length: this.emoji.length }, (v, i) => i);
  },

  data() {
    return {
      panels: [],
    };
  },

  computed: {
    emoji() {
      return this.$store.getters['emoji/emoji'];
    },
  },
};
</script>

<style scoped lang="scss">
.emoji-type {
  font-size: 0.75rem;
}
.emoji {
  font-size: 24px;
}

.panel-button {
  transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &.active {
    transform: rotate(90deg);
  }
}

.v-expansion-panel-content::v-deep .v-expansion-panel-content__wrap {
  padding: 0 !important;
}
</style>

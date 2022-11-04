<template>
  <div class="discord-message-embed" :style="rootStyles">
    <div class="discord-message-embed-grid">
      <div
        class="discord-message-embed-author"
        v-if="embed.author.author.value"
      >
        <v-img
          v-if="embed.author.authorIconURL.value"
          class="discord-message-embed-author-avatar"
          :src="embed.author.authorIconURL.value"
        ></v-img>
        <div class="discord-message-embed-author-name">
          {{ embed.author.author.value }}
        </div>
      </div>
      <span class="discord-message-embed-title" v-if="embed.body.title.value">
        <div class="discord-message-embed-title-text">
          <template v-if="embed.body.url.value">
            <a :href="embed.body.url.value"> {{ embed.body.title.value }}</a>
          </template>
          <template v-else>
            {{ embed.body.title.value }}
          </template>
        </div>
      </span>
      <div class="discord-message-embed-body">
        <div
          class="discord-message-embed-body-text"
          v-html="parseMarkdown(sanitize(embed.body.description.value))"
        ></div>
      </div>
      <div
        class="discord-message-embed-fields"
        v-if="embed.fields.items && embed.fields.items.length"
      >
        <discord-embed-field
          v-for="(field, i) in embed.fields.items"
          :field="field"
          :fields="embed.fields.items"
          :fieldIndex="i"
          :key="i"
        ></discord-embed-field>
      </div>
      <div
        class="discord-message-embed-thumbnail"
        v-if="embed.images.thumbnailURL.value"
      >
        <div class="discord-thumbnail">
          <v-img :src="embed.images.thumbnailURL.value"></v-img>
        </div>
      </div>
      <v-img
        class="discord-message-embed-image"
        v-if="embed.images.image.value"
        :src="embed.images.image.value"
      ></v-img>
      <div
        class="discord-message-embed-footer"
        v-if="embed.footer.footer.value"
      >
        <img
          class="discord-message-embed-footer-image"
          :src="embed.footer.footerIconURL.value"
          alt=""
        />

        <span
          class="discord-message-embed-footer-text"
          v-html="parseMarkdown(sanitize(embed.footer.footer.value))"
        ></span>
        <span class="discord-message-embed-footer-date"></span>
      </div>
    </div>
  </div>
</template>

<script>
import marked from '~/utilities/discordMarked.js';
import * as DOMPurify from 'dompurify';
import createEmbed from './helpers/createEmbed.js';
import { url } from '~/utilities/validators.js';

import DiscordEmbedField from '~/components/discord/DiscordEmbedField.vue';
export default {
  name: 'DiscordMessageEmbed',

  components: { DiscordEmbedField },

  props: {
    embed: {
      type: Object,
      default: createEmbed(),
    },
  },

  methods: {
    isValidURL(value) {
      return url.test(value);
    },
    sanitize(text) {
      return DOMPurify.sanitize(text, {
        ALLOWED_TAGS: ['br'],
        ALLOWED_ATTR: [],
        SAFE_FOR_TEMPLATE: true,
      });
    },
    parseMarkdown(text) {
      return marked.parse(text);
    },
  },

  computed: {
    hasImage() {
      return this.isValidURL(this.embed.images.image.value);
    },
    rootStyles() {
      return {
        'border-color': this.embed.body.color.value,
        'max-width': this.hasImage ? '432px' : null,
      };
    },
  },
};
</script>

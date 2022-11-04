<template>
  <div id="discord-messages">
    <div class="discord-message">
      <div class="discord-message-header">
        <v-img
          class="discord-message-author-avatar"
          :src="
            avatarURL
              ? avatarURL
              : 'https://www.siasat.com/wp-content/uploads/2021/05/Discord.jpg'
          "
        ></v-img>
        <h1 class="discord-message-author-name">{{ name }}</h1>
        <span class="discord-message-tag">Bot</span>
        <span class="discord-message-date"
          >Today at {{ $dayjs(Date.now()).format('h:mm') }}</span
        >
      </div>
      <div class="discord-message-body" v-html="content"></div>
      <div class="discord-message-items">
        <template v-if="images && images.length">
          <v-img
            v-for="(image, idx) in images"
            :key="idx"
            class="discord-message-image"
            max-width="400"
            max-height="300"
            :src="image"
          ></v-img>
        </template>
        <template v-if="embeds && embeds.length">
          <discord-message-embed
            v-for="(embed, idx) in embeds"
            :embed="embed"
            :key="idx"
          ></discord-message-embed>
        </template>
        <template v-if="components && components.length">
          <discord-message-components
            :items="components"
          ></discord-message-components>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import marked from '~/utilities/discordMarked.js';
import * as DOMPurify from 'dompurify';

import DiscordMessageEmbed from '~/components/discord/DiscordMessageEmbed.vue';

export default {
  name: 'DiscordMessage',

  props: { DiscordMessageEmbed },

  props: {
    authorName: {
      type: String,
      default: 'TeamBKO',
    },
    avatarURL: {
      type: String,
    },
    content: {
      type: String,
    },
    embeds: {
      type: Array,
      default: () => [],
    },
    components: {
      type: Array,
      default: () => [],
    },
    images: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    sanitizeAndConvertToMD(text) {
      return DOMPurify.sanitize(marked.parse(text), {
        ALLOWED_TAGS: ['br'],
        ALLOWED_ATTR: [],
      });
    },
  },

  computed: {
    name() {
      return this.authorName ? this.authorName : 'TeamBKO';
    },
  },
};
</script>

<style lang="scss">
#discord-messages {
  font-family: 'Roboto', sans-serif;
  .discord-message-embed-text {
    font-size: 0.875rem;
    font-weight: 600;
    color: rgb(255, 255, 255);
  }
  .discord-message {
    margin-top: 1rem;
    padding: 0.125rem 16px 0.125rem 4.5rem;
    min-height: 2.75rem;

    .discord-message-header {
      position: relative;
      margin-left: -4.5rem;
      padding-left: 4.5rem;
      .discord-message-author-avatar {
        height: 2.5rem;
        width: 2.5rem;
        position: absolute;
        left: 0;
        top: 0.125rem;
        margin: 0 1rem;
        border-radius: 50%;
        object-fit: cover;
        cursor: pointer;
      }
      .discord-message-author-name {
        display: inline;
        vertical-align: baseline;
        margin: 0px 0.25rem 0px 0px;
        color: #ffffff;
        font-size: 1rem;
        font-weight: 500;
        line-height: 1.375rem;
        overflow-wrap: break-word;
        cursor: pointer;
        a {
          color: #fff;
          text-decoration: none;
          &:hover {
            text-decoration: underline;
          }
        }
      }
      .discord-message-tag {
        position: relative;
        bottom: 0.15rem;
        min-height: 1.275em;
        max-height: 1.275em;
        margin: 0.075em 0.25rem 0px 0px;
        padding: 0.071875rem 0.275rem;
        border-radius: 3px;
        background: rgb(88, 101, 242);
        color: rgb(255, 255, 255);
        font-size: 0.725em;
        font-weight: 500;
        line-height: 1.3;
        vertical-align: baseline;
        text-transform: uppercase;
      }
      .discord-message-date {
        display: inline-block;
        height: 1.25rem;
        cursor: default;
        color: rgb(114, 118, 125);
        margin-left: 0.25rem;
        font-size: 0.75rem;
        font-weight: 500;
        line-height: 1.375rem;
        vertical-align: baseline;
      }
    }
    .discord-message-items {
      display: grid;
      grid-auto-flow: row;
      row-gap: 0.25rem;
      padding: 0.125rem 0px;
      text-indent: 0px;
      .discord-message-embed {
        max-width: 520px;
        display: grid;
        background: rgb(47, 49, 54);
        border-radius: 4px;
        border-left: 4px solid rgb(32, 34, 37);
        .discord-message-embed-grid {
          padding: 0.5rem 1rem 1rem 0.75rem;
          display: inline-grid;
          grid-template-columns: auto;
          grid-template-rows: auto;
        }
        .discord-message-embed-title {
          min-width: 0px;
          display: inline-block;
          margin: 8px 0px 0px;
          grid-column: 1 / 2;
          a {
            color: #00b0f4;
            font-weight: 600;
            text-decoration: none;
            &:hover {
              text-decoration: underline;
            }
          }
          .discord-message-embed-title-text {
            font-size: 1rem;
            font-weight: 600;
            color: #fff;
          }
        }
        .discord-message-embed-body {
          min-width: 0px;
          margin: 8px 0px 0px;
          grid-column: 1 /2;
          .discord-message-embed-body-text {
            font-size: 0.855rem;
            color: rgb(220, 221, 222);
            line-height: 1.125rem;
            white-space: pre-line;
          }
        }
        .discord-message-embed-image {
          min-width: 0px;
          max-width: 400px;
          max-height: 300px;
          margin: 16px 0px 0px;
          border-radius: 4px;
          cursor: pointer;
          grid-column: 1 / 3;
        }
        .discord-message-embed-thumbnail {
          margin: 8px 0px 0px 16px;
          grid-area: 1 / 2 / 8 / 3;
          justify-self: end;
          cursor: pointer;
          .discord-thumbnail {
            max-width: 80px;
            max-height: 80px;
            border-radius: 4px;
          }
        }
        .discord-message-embed-author {
          min-width: 0px;
          display: flex;
          align-items: center;
          grid-column: 1 / 2;
          margin: 8px 0px 0px;
          .name {
            font-size: 0.875rem;
            font-weight: 500;
            color: rgb(255, 255, 255);
            white-space: pre-wrap;
            display: inline-block;
          }
        }
        .discord-message-embed-fields {
          min-width: 0px;
          margin: 8px 0px 0px;
          display: grid;
          grid-column: 1 / 2;
          gap: 8px;
          .discord-message-embed-field {
            min-width: 0px;
            font-size: 0.855rem;
            line-height: 1.125rem;
          }
          .discord-field-name {
            min-width: 0px;
            margin: 0px 0px 1px;
            font-size: 0.875rem;
            font-weight: 600;
            color: #ffffff;
            .discord-field-name-text {
              white-space: pre-wrap;
              overflow-wrap: break-word;
              line-height: 1.375;
            }
          }
          .discord-field-body {
            min-width: 0px;
            .discord-field-body-text {
              font-size: 0.875rem;
              line-height: 1.125rem;
              color: rgb(220, 221, 222);
              white-space: pre-line;
            }
          }
        }
        .discord-message-embed-footer {
          min-width: 0px;
          margin: 8px 0px 0px;
          display: flex;
          align-items: center;
          grid-area: auto / 1 / auto / 2;
          .discord-message-embed-footer-image {
            height: 20px;
            width: 20px;
            margin: 0px 8px 0px 0px;
            object-fit: cover;
            border-radius: 50%;
          }
          .discord-message-embed-footer-text {
            font-size: 0.75rem;
            font-weight: 500;
            color: rgb(220, 221, 222);
            line-height: 1rem;
            white-space: break-spaces;
          }
          .discord-message-embed-footer-date {
            display: inline-block;
            margin: 0px 4px;
          }
        }
      }

      .discord-message-components {
        .v-btn {
          font-family: Whitney, Helvetica Neue, Helvetica, Arial, sans-serif;
        }
      }
    }
  }
}
</style>

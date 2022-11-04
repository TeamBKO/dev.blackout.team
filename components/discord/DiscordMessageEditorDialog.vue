<template>
  <v-dialog
    v-model="open"
    fullscreen
    hide-overlay
    dark
    :content-class="'discord-message-dialog'"
  >
    <template #activator="props">
      <slot name="activator" v-bind="props" />
    </template>

    <v-card id="discord-message-editor">
      <v-app-bar ref="top">
        <v-toolbar-title>
          {{ title }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="open = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <div id="v__discord_editor" :style="editorStyle">
        <div class="v__discord_editor_wrap">
          <v-container fluid class="px-5 pb-16">
            <div class="expand preview" @click="expandPreviewPanel">
              <v-icon large>mdi-chevron-left</v-icon>
            </div>
            <v-row>
              <v-col cols="12">
                <div class="d-flex justify-space-around">
                  <base-dialog
                    ref="saveDraft"
                    :title="'Save draft'"
                    :disabled="!saveDraftValid"
                    :confirmButtonText="'Save'"
                    :width="800"
                    :height="220"
                    dark
                    @confirm="saveDraft"
                    @cancel="draftName = ''"
                  >
                    <template #activator="{ on }">
                      <v-btn v-on="on" outlined default>
                        {{ editorState }}
                      </v-btn>
                    </template>
                    <v-form lazy-validation v-model="saveDraftValid">
                      <v-text-field
                        v-model="draftName"
                        filled
                        label="Name"
                      ></v-text-field>
                    </v-form>
                  </base-dialog>

                  <discord-draft-menu
                    @load="loadDraft"
                    @setMessage="getMessage"
                  >
                    <template #activator="{ on }">
                      <v-btn class="mx-2" v-on="on" outlined default
                        ><span>Manage</span>
                        <v-icon right>mdi-menu-down</v-icon></v-btn
                      >
                    </template>
                  </discord-draft-menu>

                  <base-dialog
                    :title="'Clear All'"
                    :confirm-button-text="'Clear All'"
                    :width="500"
                    :height="200"
                    dark
                    @confirm="clearAll"
                  >
                    <template #activator="{ on }">
                      <v-btn outlined default v-on="on">Clear All</v-btn>
                    </template>
                    <p>
                      This action resets all content currently displayed. Are
                      you sure you want to continue? This action is irrevesible.
                    </p>
                  </base-dialog>
                  <v-spacer></v-spacer>
                </div>
              </v-col>
              <v-col cols="12" v-if="uid"> Draft ID: {{ uid }} </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="">
                <v-text-field
                  v-model="webhookURL"
                  class="inputs"
                  label="Webhook URL"
                  filled
                  placeholder="https://discord.com/api/webhooks/..."
                  type="password"
                  :disabled="disableWebhookInputs"
                >
                  <template #append>
                    <v-btn
                      small
                      @click.stop="sendMessage"
                      :disabled="disableWebhookInputs || !webhookURL || !valid"
                      >Send</v-btn
                    >
                  </template>
                  <template #append-outer>
                    <v-checkbox
                      v-model="messageMethod"
                      class="inputs"
                      :on-icon="'$radioOn'"
                      :off-icon="'$radioOff'"
                      :value="'webhook'"
                    ></v-checkbox>
                  </template>
                </v-text-field>
                <v-btn small>Add Webhook</v-btn>
              </v-col>
              <v-col cols="12" class="pb-0 inputs">
                <v-text-field
                  v-model="channelId"
                  label="Channel ID"
                  filled
                  :disabled="!disableWebhookInputs || !isDiscordBotEnabled"
                >
                  <template #append>
                    <v-btn
                      small
                      @click.stop="sendMessage"
                      :disabled="!isDiscordBotEnabled || !channelId || !valid"
                      >Send</v-btn
                    >
                  </template>
                  <template #append-outer>
                    <v-checkbox
                      v-model="messageMethod"
                      hide-details
                      :disabled="!isDiscordBotEnabled"
                      :on-icon="'$radioOn'"
                      :off-icon="'$radioOff'"
                      :value="'channelId'"
                    ></v-checkbox>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" class="py-0">
                <roster-list
                  v-model="selectedRosters"
                  @removeSelected="removeSelected"
                ></roster-list>
                <div class="py-1"></div>
                <v-divider></v-divider>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" class="pb-0">
                <v-textarea
                  ref="mainContent"
                  v-model="mainContent.content"
                  label="Content"
                  filled
                  rows="5"
                  :counter="2000"
                >
                  <template #append>
                    <discord-emoji-picker
                      @getEmoji="
                        getEmoji(
                          $refs.mainContent,
                          mainContent,
                          'content',
                          $event
                        )
                      "
                    >
                      <template #activator="{ on }">
                        <v-btn v-on="on" icon>
                          <v-icon>mdi-emoticon</v-icon>
                        </v-btn>
                      </template>
                    </discord-emoji-picker>
                  </template>
                </v-textarea>
              </v-col>
              <v-col cols="12" class="pt-0">
                <v-expansion-panels flat accordion multiple>
                  <v-expansion-panel>
                    <v-expansion-panel-header hide-actions class="px-0">
                      <v-list-item class="pa-0">
                        <v-list-item-icon class="mr-0">
                          <v-btn icon @click="openProfile = !openProfile">
                            <v-icon :class="iconClass"
                              >mdi-chevron-right</v-icon
                            >
                          </v-btn>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>Profile</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            ref="mainContent"
                            v-model="mainContent.profile.username"
                            label="Username"
                            filled
                            :counter="80"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="mainContent.profile.avatarURL.value"
                            label="Avatar URL"
                            filled
                            :rules="mainContent.profile.avatarURL.rules"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
              <v-col cols="12">
                <v-form v-model="valid">
                  <v-file-input
                    v-model="files"
                    solo-inverted
                    persistent-hint
                    counter
                    multiple
                    show-size
                    small-chips
                    label="Files"
                    :accepts="'image/*'"
                    :hint="'8 MB max.'"
                    :rules="[isUnderTotalFileSize]"
                  ></v-file-input>
                </v-form>
              </v-col>
              <v-col cols="12">
                <v-expansion-panels accordion multiple>
                  <discord-message-embed-panel
                    v-model="valid"
                    v-for="(embed, idx) in embeds"
                    @addField="addField(idx)"
                    @addImage="addImage(idx)"
                    @remove="removeEmbed(idx)"
                    @duplicate="duplicateEmbed(idx)"
                    @duplicateField="duplicateField(idx, $event)"
                    @removeField="removeField(idx, $event)"
                    @moveField="moveField(idx, $event)"
                    @move="moveEmbed(idx, $event)"
                    :embed="embed"
                    :key="idx"
                    :position="idx"
                    :maxNumOfPanels="embeds.length"
                  >
                    <template #panel-header>
                      <span
                        ><strong>{{ embed.body.title }}</strong></span
                      >
                    </template>
                  </discord-message-embed-panel>
                </v-expansion-panels>
                <v-btn
                  class="my-3"
                  primary
                  @click="addEmbed"
                  :disabled="isEmbedButtonDisabled"
                  >Add Embed</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </div>
      </div>
      <v-card-text id="v__discord-preview" :style="previewStyle">
        <div class="v__discord-preview_wrap">
          <div class="expand editor" @click="expandEditorPanel">
            <v-icon large>mdi-chevron-right</v-icon>
          </div>
          <v-container fluid>
            <discord-message
              :author-name="mainContent.profile.username"
              :avatar-url="mainContent.profile.avatarURL.value"
              :content="markdown"
              :embeds="embeds"
              :images="images"
              :components="components"
            ></discord-message>
          </v-container>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import SETTINGS from '~/constants/settings/public.js';
import DISCORD_MESSAGE_DRAFTS from '~/constants/discordMessageDrafts/public.js';

import DiscordDraftMenu from '~/components/discord/DiscordDraftMenu.vue';
import DiscordMessage from '~/components/discord/DiscordMessage.vue';
import DiscordMessageEmbedPanel from '~/components/discord/DiscordMessageEmbedPanel.vue';
import DiscordEmojiPicker from '~/components/discord/DiscordEmojiPicker.vue';
import BaseDialog from '~/components/dialogs/BaseDialog.vue';
import RosterList from '~/components/rosters/RosterList.vue';
import Accordion from '~/components/controls/Accordion.vue';

import marked from '~/utilities/discordMarked.js';
import * as DOMPurify from 'dompurify';
import cloneDeep from 'lodash/cloneDeep';
import pick from 'lodash/pick';
import createEmbed from './helpers/createEmbed.js';
import createEmbedField from './helpers/createEmbedField.js';

import { isRequired, hasValidURL } from '~/utilities/validators.js';
import { nanoid } from 'nanoid';
import buildComponentRows from './helpers/buildComponentRows.js';

export default {
  name: 'DiscordMessageEditorDialog',

  components: {
    DiscordMessage,
    DiscordMessageEmbedPanel,
    DiscordEmojiPicker,
    BaseDialog,
    RosterList,
    Accordion,
  },

  props: {
    title: {
      type: String,
      default: 'Discord Message Editor',
    },
  },

  watch: {
    selectedRosters(rosters) {
      this.components = buildComponentRows.call(this, rosters);
    },
  },

  data() {
    return {
      edit: false,
      valid: true,
      saveDraftValid: false,
      isDraft: false,
      open: false,
      openEditor: true,
      openProfile: false,
      messageMethod: 'webhook',
      uid: null,
      draftName: '',
      channelId: '',
      webhookURL: '',
      files: [],
      selectedRosters: [],
      mainContent: {
        content: '',
        profile: {
          username: '',
          avatarURL: {
            value: '',
            rules: [hasValidURL('Field')],
          },
        },
      },
      embeds: [],
      components: [],
      width: '50%',
      previewPadding: '50%',
    };
  },

  methods: {
    copyToClipboard(uid) {
      navigator.clipboard.writeText(uid);
    },

    removeSelected(id) {
      const idx = this.selectedRosters.findIndex((roster) => roster.id === id);
      if (idx === -1) return;
      this.selectedRosters.splice(idx, 1);
    },

    getMessage(message) {
      this.edit = true;

      if (message.content) {
        this.mainContent.content = this.sanitizeHTML(message.content);
      }

      if (message?.author?.username) {
        this.mainContent.profile.username = message.author.username;
      }

      if (message?.author?.avatar) {
        this.mainContent.profile.avatarURL.value = message.author.avatar;
      }

      if (message?.embeds?.length) {
        this.embeds = message.embeds.map((embed) =>
          this.formatEmbed(createEmbed(), embed)
        );
      }

      if (message?.components?.length) {
        this.components = message.components;
      }
    },

    formatEmbed(obj, embed) {
      if (embed.title) {
        obj.body.title.value = this.sanitizeHTML(embed.title);
      }
      if (embed.url) {
        obj.body.url.value = this.sanitizeHTML(embed.url);
      }
      if (embed.description) {
        obj.body.description.value = this.sanitizeHTML(embed.description);
      }
      if (embed?.author?.name) {
        obj.author.author.value = this.sanitizeHTML(embed.author.name);
      }
      if (embed?.author?.icon_url) {
        obj.author.authorIconURL.value = embed.author.icon_url;
      }
      if (embed?.author?.url) {
        obj.author.authorURL.value = embed.author.url;
      }
      if (embed?.image?.url) {
        obj.images.image.value = embed.image.url;
      }
      if (embed?.thumbnail?.url) {
        obj.images.thumbnailURL.value = embed.thumbnail.url;
      }
      if (embed?.footer?.text) {
        obj.footer.footer.value = this.sanitizeHTML(embed.footer.text);
      }
      if (embed?.footer?.timestamp) {
        obj.footer.timestamp.value = embed.footer.timestamp;
      }

      obj.fields.items = embed?.fields?.length
        ? embed.fields.map((f) => this.formatEmbedField(createEmbedField(), f))
        : [];

      return obj;
    },

    formatDraftResponse(resp) {
      if (resp.content) {
        this.mainContent.content = this.sanitizeHTML(resp.content);
      }

      if (resp.avatar_url) {
        this.mainContent.profile.avatarURL.value = resp.avatar_url;
      }

      if (resp.username) {
        this.mainContent.profile.username = this.sanitizeHTML(resp.username);
      }

      if (resp?.embeds?.length) {
        this.embeds = resp.embeds.map((embed) =>
          this.formatEmbed(createEmbed(), embed)
        );
      }
    },

    formatEmbedField(obj, field) {
      if (field.name) {
        obj.name.value = this.sanitizeHTML(field.value);
      }
      if (field.value) {
        obj.value = this.sanitizeHTML(field.value);
      }
      obj.inline = field.inline;

      return obj;
    },

    isUnderTotalFileSize(v) {
      const MAX_TOTAL_FILE_SIZE = 8388608; //8 MB max.
      return (
        this.totalFileSize <= MAX_TOTAL_FILE_SIZE ||
        'Total file size cannot exceed 8 MB.'
      );
    },

    getEmoji(ref, target, key, emoji) {
      const element = ref.$el.getElementsByTagName('textarea')[0];

      let startPos = element.selectionStart,
        endPos = element.selectionEnd,
        cursorPos = startPos,
        tmp = target[key];

      target[key] =
        tmp.substring(0, startPos) + emoji + tmp.substring(endPos, tmp.length);

      setTimeout(() => {
        cursorPos += emoji.length;
        element.selectionStart = element.selectionEnd = cursorPos;
      }, 10);
    },

    sanitizeHTML(text) {
      return DOMPurify.sanitize(text, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        SAFE_FOR_TEMPLATES: true,
      });
    },

    formatMessage() {
      const message = { username: this.profileAuthorName };

      if (this.mainContentText) {
        Object.assign(message, { content: this.mainContentText });
      }

      if (this.mainContent.avatarURL) {
        Object.asign(message, {
          avatar_url: this.mainContent.profile.avatarURL.value,
        });
      }

      if (this.embeds.length) {
        const embeds = this.embeds.map((embed) => {
          const result = {
            color: parseInt(`${embed.body.color.value.replace('#', '')}`, 16),
          };

          const author = {};
          const thumbnail = {};
          const image = {};
          const footer = {};

          if (embed.body.title.value) {
            Object.assign(result, { title: embed.body.title.value });
          }

          if (embed.body.url.value) {
            Object.assign(result, { url: embed.body.url.value });
          }

          if (embed.body.description.value) {
            Object.assign(result, {
              description: this.sanitizeHTML(embed.body.description.value),
            });
          }

          if (embed.author.author.value) {
            Object.assign(author, { name: embed.author.author.value });
          }

          if (embed.author.authorIconURL.value) {
            Object.assign(author, {
              icon_url: embed.author.authorIconURL.value,
            });
          }

          if (embed.author.authorURL.value) {
            Object.assign(author, { url: embed.author.authorURL.value });
          }

          if (embed.images.thumbnailURL.value) {
            Object.assign(thumbnail, { url: embed.images.thumbnailURL.value });
          }

          if (embed.images.image.value) {
            if (urls.length) {
              Object.assign(image, { url: embed.images.image.value });
            }
          }

          if (embed.footer.footer.value) {
            Object.assign(footer, {
              text: this.sanitizeHTML(embed.footer.footer.value),
            });
          }

          if (embed.footer.timestamp.value) {
            Object.assign(result, {
              timestamp: new Date(embed.footer.timestamp.value).toISOString(),
            });
          }

          if (embed.footer.footerIconURL.value) {
            Object.assign(footer, {
              icon_url: embed.footer.footerIconURL.value,
            });
          }

          if (Object.keys(author).length) {
            Object.assign(result, { author });
          }

          if (Object.keys(thumbnail).length) {
            Object.assign(result, { thumbnail });
          }

          if (Object.keys(image).length) {
            Object.assign(result, { image });
          }

          if (Object.keys(footer).length) {
            Object.assign(result, { footer });
          }

          if (embed.fields.items.length) {
            const fields = embed.fields.items.map((field) => ({
              name: field.name.value,
              value: this.sanitizeHTML(field.value),
              inline: field.inline,
            }));

            Object.assign(result, { fields });
          }

          return result;
        });
        Object.assign(message, { embeds });
      }

      return message;
    },

    async sendMessage() {
      try {
        if (this.webhookURL && !this.disableWebhookInputs) {
          const formData = new FormData();
          const json = JSON.stringify(this.formatMessage());
          formData.append('payload_json', json);
          if (this.files?.length) {
            this.files.forEach((file, idx) =>
              formData.append(`files_${idx}`, file)
            );

            await fetch(this.webhookURL, {
              method: 'POST',
              'content-type': 'multipart/form-data',
              body: formData,
            });
            this.$toast.success('Sent message to discord via Webhook.', {
              position: 'top-center',
              duration: 3000,
            });
            return;
          }

          await fetch(this.webhookURL, {
            method: 'POST',
            'content-type': 'multipart/form-data',
            body: formData,
          });
          this.$toast.success('Sent message to discord via Webhook.', {
            position: 'top-center',
            duration: 3000,
          });

          return;
        }

        if (this.files?.length) {
          const formData = new FormData();
          this.files.forEach((file) => formData.append('files', file));
          formData.append('message', JSON.stringify(this.formatMessage()));

          await this.$axios.$post(
            `/discord/message/${this.channelId}`,
            formData
          );

          return;
        }

        const params = { message: this.formatMessage() };

        await this.$axios.$post(`/discord/message/${this.channelId}`, params);

        this.$toast.success('Sent message to discord.', {
          position: 'top-center',
          duration: 3000,
        });
      } catch (err) {
        console.log(err);
        this.$toast.error(err, {
          position: 'top-center',
          duration: 3000,
        });
      }
    },

    async saveDraft() {
      try {
        await this.$store.dispatch(
          DISCORD_MESSAGE_DRAFTS.actions.ADD_ITEM,
          Object.assign({}, { name: this.draftName }, this.formatMessage())
        );
        this.$refs.saveDraft.closeDialog();
        requestAnimationFrame(() => (this.draftName = ''));
      } catch (err) {
        this.$toast.error(err.response.data[0].message, {
          position: 'top-center',
          duration: 3000,
        });
        console.log(err);
      }
    },

    async loadDraft(id) {
      try {
        const resp = await this.$axios.$get(`/discord/drafts/${id}`);

        this.uid = resp.uid;
        this.formatDraftResponse(resp.body);
        this.$toast.show(`Loaded ${resp.name}`, {
          position: 'top-center',
          duration: 3000,
        });
        this.isDraft = true;
        this.edit = true;
      } catch (err) {
        this.$toast.error(err, {
          position: 'top-center',
          duration: 3000,
        });
      }
    },

    clearAll() {
      this.mainContent.content = '';
      this.mainContent.profile.username = '';
      this.mainContent.profile.avatarURL.value = '';
      this.webhookURL = '';
      this.embeds = [];
      this.uid = null;
      this.isDraft = true;
      this.edit = false;
    },

    addEmbed() {
      if (this.embeds.length === 10) return;
      this.embeds.push(createEmbed());
    },

    removeEmbed(idx) {
      this.embeds.splice(idx, 1);
    },

    duplicateEmbed(idx) {
      if (this.embeds.length === 10) return;
      const dupe = cloneDeep(this.embeds[idx]);
      this.embeds.push(dupe);
    },

    moveEmbed(from, to) {
      const element = this.embeds.splice(from, 1)[0];
      this.embeds.splice(to, 0, element);
    },

    moveField(embed, { from, to }) {
      const e = this.embeds[embed];
      const element = e.fields.items.splice(from, 1)[0];
      e.fields.items.splice(to, 0, element);
    },

    addField(idx) {
      if (this.embeds[idx].fields.items.length === 5) return;
      this.embeds[idx].fields.items.push(createEmbedField());
    },

    removeField(embed, idx) {
      this.embeds[embed].fields.items.splice(idx, 1);
    },

    duplicateField(embed, idx) {
      if (this.embeds[embed].fields.items.length === 5) return;
      const dupe = cloneDeep(this.embeds[embed].fields.items[idx]);
      dupe.id = nanoid();
      this.embeds[embed].fields.items.push(dupe);
    },

    addImage(idx) {
      this.embeds[idx].images.imageURLs.push('');
    },

    removeImage(embed, idx) {
      this.embeds[idx].images.imageURLS.splice(idx, 1);
    },

    expandPreviewPanel() {
      if (this.previewPadding === '50%' || this.$vuetify.breakpoint.mobile) {
        this.openEditor = false;
        this.previewPadding = '0%';
      } else if (this.previewPadding === '100%') {
        this.width = '50%';
        this.previewPadding = '50%';
      }
    },
    expandEditorPanel() {
      if (this.openEditor) {
        this.width = '100%';
        this.previewPadding = '100%';
      } else if (!this.openEditor) {
        this.openEditor = true;
        this.previewPadding = '50%';
      } else if (this.$vuetify.breakpoint.mobile) {
        this.width = '100%';
        this.openEditor = true;
        this.previewPadding = '100%';
      }
    },

    hasNoSpecialCharacters(v) {
      return (v) =>
        !/[^a-zA-Z\d\s:]/.test(v) || 'Field must be alphanumerical.';
    },
  },

  computed: {
    editorState() {
      return this.edit && !this.isDraft
        ? 'Update Message'
        : this.edit && this.isDraft
        ? 'Update Draft'
        : 'Save Draft';
    },

    images() {
      const images = this.files.filter(({ type }) =>
        /image\/(jpe?g|png|webp|svg|gif)/.test(type)
      );
      return images?.length
        ? images.map((image) => URL.createObjectURL(image))
        : [];
    },

    totalFileSize() {
      return this.files.reduce((total, file) => {
        total += file.size;
        return total;
      }, 0);
    },

    isDiscordBotEnabled() {
      return this.$store.getters[SETTINGS.getters.SETTINGS_VALUES]('enableBot');
    },

    disableWebhookInputs() {
      return this.messageMethod !== 'webhook';
    },
    sanitizedContent() {
      return DOMPurify.sanitize(this.mainContentText, {
        SAFE_FOR_TEMPLATES: true,
        ALLOWED_TAGS: ['br'],
        ALLOWED_ATTR: [],
        SAFE_FOR_TEMPLATES: true,
      });
    },

    markdown() {
      return marked.parse(this.sanitizedContent);
    },

    profileAuthorName() {
      return this.mainContent.profile.username
        ? DOMPurify.sanitize(this.mainContent.profile.username, {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: [],
            SAFE_FOR_TEMPLATES: true,
          })
        : 'TeamBKO';
    },

    mainContentText() {
      return DOMPurify.sanitize(this.mainContent.content, {
        ALLOWED_TAGS: ['br'],
        ALLOWED_ATTR: [],
      });
    },

    iconClass() {
      return ['chevron', { active: this.openProfile }];
    },

    settingsIconClass() {
      return ['chevron', { active: this.openSettings }];
    },
    navStyle() {
      return { top: !this.$vuetify.breakpoint.smAndDown ? '64px' : '56px' };
    },

    top() {
      return { top: this.$refs.top.$el.style.height };
    },

    isEmbedButtonDisabled() {
      return this.embeds.length === 10;
    },

    editorStyle() {
      return {
        transform: this.openEditor ? `translateX(0)` : `translateX(-100%)`,
        width: this.width,
      };
    },

    previewStyle() {
      return {
        'padding-left': `${this.previewPadding}`,
      };
    },
  },
};
</script>

<style lang="scss">
.discord-message-dialog {
  overflow: hidden;
}

#discord-message-editor {
  blockquote {
    border-left: 3px solid #555;
    padding-left: 8px;
  }

  #v__discord_editor {
    position: fixed;
    display: flex;
    transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    max-height: calc(100% + 0px);
    height: 100vh;
    left: 0;
    border-right: 1px solid #555;
    z-index: 1000;
    background-color: #1e1e1e;
    padding-bottom: 64px;
    .v__discord_editor_wrap {
      display: flex;
      overflow-y: auto;
      overflow-x: hidden;
      width: 100%;
      height: 100%;
    }
  }

  #v__discord-preview {
    display: flex;
    flex: 1 0 auto;
    position: relative;
    background-color: #36393f;
    transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    height: 100vh;
    padding-bottom: 64px;
    &.v-card__text {
      padding: 0 0 64px;
    }

    .v__discord-preview_wrap {
      position: relative;
      display: flex;
      overflow-y: auto;
      overflow-x: hidden;
      width: 100%;
      height: 100%;
    }
  }

  .expand {
    $expandBackgroundColor: rgba(55, 55, 55, 0.3);
    $expandBorderRadius: 4px;
    border-color: #555;
    border-radius: 4px;
    position: absolute;
    top: 5px;
    background-color: $expandBackgroundColor;
    cursor: pointer;
    &:hover {
      background-color: lighten($expandBackgroundColor, 30%);
    }
    &.preview {
      right: 0;
      border-top-left-radius: $expandBorderRadius;
      border-bottom-left-radius: $expandBorderRadius;
    }
    &.editor {
      left: 0;
      border-top-right-radius: $expandBorderRadius;
      border-bottom-right-radius: $expandBorderRadius;
    }
  }

  .chevron {
    transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .active {
    transform: rotate(90deg);
  }

  .v-expansion-panel--active > .v-expansion-panel-header {
    min-height: 48px !important;
    height: 48px;
  }

  .v-expansion-panel-header {
    height: 48px;
  }

  .discord-message-footer-text {
    font-size: 0.75rem;
    font-weight: 500;
    color: #fff;
    line-height: 1rem;
    white-space: break-spaces;
  }

  .inputs {
    .v-input__append-outer {
      margin-top: 0;
    }
  }
}
</style>

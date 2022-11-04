<template>
  <v-menu
    v-model="open"
    :close-on-content-click="false"
    offset-y
    dark
    min-width="500px"
  >
    <template #activator="props">
      <slot name="activator" v-bind="props" />
    </template>
    <v-card dark>
      <v-toolbar>
        <v-tabs fixed-tabs v-model="computedTab" dark>
          <v-tab :disabled="!isDiscordBotEnabled">
            <span>Load Message</span>
            <v-tooltip bottom>
              <template #activator="{ on }">
                <v-icon right small v-on="on">mdi-information-outline</v-icon>
              </template>
              Copy & paste the id of the channel and discord message you want to
              retrieve.
            </v-tooltip>
          </v-tab>
          <v-tab>
            <span>Drafts</span>
            <v-btn small icon absolute top right @click.stop="open = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-tab>
        </v-tabs>
      </v-toolbar>

      <v-tabs-items dark v-model="computedTab">
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <v-container fluid>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="channelID" filled label="Channel ID">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="messageID"
                      filled
                      label="Message ID"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click.stop="getMessage">Submit</v-btn>
            </v-card-actions>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card-text>
            <v-container fluid>
              <discord-message-draft-list :items="drafts" v-if="drafts.length">
                <template #actions="draft">
                  <div class="d-flex" click.stop>
                    <v-tooltip bottom>
                      <template #activator="{ on }">
                        <v-btn icon v-on="on" @click="$emit('load', draft.id)">
                          <v-icon>mdi-tray-arrow-down</v-icon>
                        </v-btn>
                      </template>
                      Load draft
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template #activator="{ on }">
                        <v-btn
                          icon
                          v-on="on"
                          @click="updateDraftPrivacy(draft.id, !draft.private)"
                        >
                          <v-icon>{{
                            draft.private ? 'mdi-eye' : 'mdi-eye-off'
                          }}</v-icon>
                        </v-btn>
                      </template>
                      {{ draft.private ? 'Public' : 'Private' }}
                    </v-tooltip>
                    <delete-dialog
                      dark
                      :item="draft"
                      @delete="removeDraft(draft.id)"
                    >
                      <template #activator="prop">
                        <v-tooltip bottom>
                          <template #activator="{ on }">
                            <v-btn icon v-on="{ ...on, ...prop.on }">
                              <v-icon>mdi-trash-can</v-icon>
                            </v-btn>
                          </template>
                          Delete draft
                        </v-tooltip>
                      </template>
                    </delete-dialog>

                    <v-tooltip bottom>
                      <template #activator="{ on }">
                        <v-btn
                          icon
                          v-on="on"
                          @click="copyToClipboard(draft.uid)"
                        >
                          <v-icon>mdi-clipboard-multiple</v-icon>
                        </v-btn>
                      </template>
                      Copy Draft ID: {{ draft.uid }}
                    </v-tooltip>
                  </div>
                </template>
                <template #append>
                  <div
                    class="d-flex justify-center align-center py-2"
                    v-if="hasMore"
                    v-intersect.quiet="{
                      options: { threshold: 1.0 },
                      handler: onIntersect,
                    }"
                  >
                    <v-progress-circular
                      indeterminate
                      v-if="loading"
                    ></v-progress-circular>
                  </div>
                </template>
              </discord-message-draft-list>
              <div
                class="d-flex justify-center align-center flex-column"
                v-else
              >
                <v-icon large>mdi-empty</v-icon>
                No data.
              </div>
            </v-container>
          </v-card-text>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-menu>
</template>

<script>
import DISCORD_MESSAGE_DRAFTS from '~/constants/discordMessageDrafts/public.js';
import SETTINGS from '~/constants/settings/public.js';

import DeleteDialog from '~/components/dialogs/DeleteDialog2.vue';

export default {
  name: 'DiscordDraftMenu',

  components: { DeleteDialog },

  data() {
    return {
      open: false,
      messageID: '',
      channelID: '',
      tab: 0,
    };
  },

  watch: {
    open: {
      once: true,
      handler: function (v) {
        if (v && !this.drafts.length) {
          this.$store.dispatch(DISCORD_MESSAGE_DRAFTS.actions.FETCH);
        }
      },
    },
  },

  methods: {
    onIntersect(observer, entries, isIntersecting) {
      if (isIntersecting && this.drafts.length && this.hasMore) {
        this.$store.dispatch(DISCORD_MESSAGE_DRAFTS.actions.FETCH);
      }
    },
    updateDraftPrivacy(id, isPrivate) {
      this.$store.dispatch(DISCORD_MESSAGE_DRAFTS.actions.UPDATE_ITEM, {
        id,
        payload: { private: isPrivate },
      });
    },
    removeDraft(id) {
      this.$store.dispatch(DISCORD_MESSAGE_DRAFTS.actions.REMOVE_ITEMS, id);
    },
    async getMessage() {
      try {
        const message = await this.$axios.$get(
          `/discord/message/${this.channelID}/${this.messageID}`
        );
        this.$toast.success('Retrieved message from discord', {
          position: 'top-center',
          duration: 3000,
        });
        this.$emit('setMessage', message);
      } catch (err) {
        console.log(err);
      }
    },
  },

  computed: {
    drafts() {
      return this.$store.getters[DISCORD_MESSAGE_DRAFTS.getters.ITEMS];
    },
    loading() {
      return this.$store.getters[DISCORD_MESSAGE_DRAFTS.getters.LOADING];
    },
    hasMore() {
      return this.$store.getters[DISCORD_MESSAGE_DRAFTS.getters.HAS_MORE];
    },
    isDiscordBotEnabled() {
      return this.$store.getters[SETTINGS.getters.SETTINGS_VALUES]('enableBot');
    },
    computedTab: {
      get() {
        return this.isDiscordBotEnabled ? this.tab : 1;
      },
      set(value) {
        this.tab = value;
      },
    },
  },
};
</script>

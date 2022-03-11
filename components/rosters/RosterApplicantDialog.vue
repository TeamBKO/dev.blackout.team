<template>
  <v-dialog v-model="open" :max-width="maxWidth">
    <template #activator="{ on }" v-if="button">
      <v-btn class="v-tab" text v-on="on" :height="buttonHeight">
        <span>Apply</span>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar prominent v-if="!isReadMode">
        <div class="d-flex align-center justify-center flex-grow-1 inherit">
          <v-select
            v-model="selectedRoster"
            label="Roster"
            :items="rosters"
            :item-text="'name'"
            :item-value="'id'"
          >
            <template #append-item>
              <div
                class="d-flex justify-center align-enter py-2"
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
          </v-select>
        </div>
        <v-btn x-small icon @click="open = false">
          <v-icon v-text="closeIcon"></v-icon>
        </v-btn>
      </v-toolbar>
      <v-toolbar dark v-else-if="isReadMode">
        <v-toolbar-title>
          <user-avatar :item="selectedForm.applicant.member" :size="40" />
          <span>{{ selectedForm.applicant.member.username }}</span>
        </v-toolbar-title>
        <v-btn small absolute top right icon @click="open = false">
          <v-icon v-text="closeIcon"></v-icon>
        </v-btn>
      </v-toolbar>
      <template v-if="isEmpty">
        <v-container fill-height fluid>
          <v-row justify="center" align="center" class="py-4 flex-column">
            <v-icon large>mdi-information-off-outline</v-icon>
            <p>No forms.</p>
          </v-row>
        </v-container>
      </template>
      <template v-if="!submitted && !isEmpty">
        <v-card-text>
          <v-form v-model="valid" ref="form">
            <roster-form
              v-model="fields"
              ref="formApplication"
              :readonly="readonly"
              :form="selectedForm"
              :open="open"
              :status.sync="status"
            >
            </roster-form>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="save" :disabled="isDisabled">Submit</v-btn>
          <v-btn text @click="$refs.form.reset()">Reset</v-btn>
        </v-card-actions>
      </template>
      <template v-else-if="!isEmpty">
        <v-card-text>
          <v-container>
            <v-row align="center" justify="center">
              <v-col cols="12" class="text-center">
                <v-icon
                  :color="iconColor"
                  :size="iconSize"
                  v-text="submittedIcon"
                ></v-icon>
              </v-col>
              <v-col cols="12" class="text-center">
                <p class="headline">Thank you for submitted an application.</p>
                <p class="headline">We will get back to you soon.</p>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </template>
      <v-overlay v-model="isSending">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-card>
  </v-dialog>
</template>

<script>
import RosterForm from './RosterForm.vue';
import UserAvatar from '~/components/avatar/ListAvatar.vue';

export default {
  name: 'RosterApplicantDialog',

  components: { RosterForm, UserAvatar },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    button: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      closeIcon: 'mdi-close',
      maxWidth: '600px',
      valid: false,
      initialRequest: true,
      isSending: false,
      readonly: false,
      submitted: false,
      selectedForm: null,
      selectedRoster: null,
      forms: [],
      fields: [],
      rosters: [],
      status: '',
      buttonHeight: '100%',
      iconSize: 120,
      submittedIcon: 'mdi-checkbox-marked-circle-outline',
      iconColor: 'mint',
      isInitialLoad: false,
      nextCursor: '',
      prevCursor: '',
      hasMore: false,
      loading: false,
      isEmpty: false,
    };
  },

  watch: {
    selectedRoster(newId, oldId) {
      if (!oldId) return;
      this.setForm(newId);
    },

    open(v) {
      if (!v) {
        this.readonly = false;
        this.selectedForm = null;
        this.fields = [];
      } else {
        if (!this.readonly) {
          if (this.initialRequest) {
            this.setForm();
            this.initialRequest = false;
          } else {
            this.setForm(this.selectedRoster);
          }
        }
      }
      this.$emit('open');
    },
  },

  methods: {
    async save() {
      const params = {
        form_id: this.selectedForm.form_id,
        roster_id: this.selectedRoster,
        fields: this.fields,
      };

      if (this.isReadMode) {
        const payload = {
          status: this.status,
        };

        try {
          await this.$store.dispatch(ROSTERS.actions.UPDATE_MEMBER_STATUS, {
            id: this.selectedForm.id,
            payload,
          });
          this.open = false;
          this.$toast.success('Saved changes.', { position: 'top-center' });
        } catch (err) {
          this.$toast.error(err.message, { position: 'top-center' });
        }

        return;
      }

      try {
        await this.$axios.post('/rosters', params);
        this.submitted = true;
      } catch (err) {
        console.log(err);
      }
    },

    async onIntersect(observer, entries, isIntersecting) {
      if (isIntersecting && this.rosters.length && this.hasMore) {
        await getMoreRosters();
      }
    },

    async getMoreRosters() {
      if (!this.hasMore) return;
      try {
        const items = await this.$axios.$get('/rosters');
        if (items?.results?.length) {
          if (items?.pageInfo?.next) {
            this.nextCursor = items.pageInfo.next;
          }
          if (items?.pageInfo?.prev) {
            this.nextCursor = items.pageInfo.prev;
          }
          if (typeof items.pageInfo.hasMore !== undefined) {
            this.nextCursor = items.pageInfo.next;
          }
          this.rosters = this.rosters.concat(items.results);
        }
      } catch (err) {}
    },

    async setForm(id) {
      const getForm = id ? this.getForm(id) : this.getForm();
      let response = await getForm;

      if (response?.empty) {
        this.isEmpty = response?.empty;
        return;
      } else {
        this.isEmpty = false;
      }

      if (response?.rosters?.results?.length) {
        if (!this.rosters.length) {
          this.rosters = response?.rosters.results;
        }
        if (response?.rosters?.pageInfo.next) {
          this.nextCursor = response?.rosters.pageInfo.next;
        }
        if (response?.rosters?.pageInfo.previous) {
          this.prevCUrsor = response?.rosters.pageInfo.previous;
        }
        if (typeof response?.rosters?.pageInfo.hasMore !== undefined) {
          this.hasMore = response?.rosters.pageInfo.hasMore;
        }
        if (response?.roster?.id) {
          this.selectedRoster = response?.roster.id;
        }
      }

      this.selectedForm = Object.assign(response.form, {
        name: response.roster.name,
      });
    },

    async getForm(id, params) {
      this.isSending = true;

      const url = id
        ? this.readonly
          ? `/forms/${id}`
          : `/forms/roster/${id}`
        : '/forms/roster';

      try {
        const payload = { params };
        const results = await this.$axios.$get(url, payload);

        if (results.status === 203) {
          this.submitted = true;
        } else {
          this.submitted = false;
        }

        // if (this.submitted) this.submitted = false;

        return results;
      } catch (err) {
        console.log(err);
      } finally {
        this.isSending = false;
      }
    },

    async viewForm(formId, rosterId) {
      this.readonly = true;
      const form = await this.getForm(formId, { roster_id: rosterId });

      console.log(form);
      this.open = true;
      this.selectedForm = form;
    },
  },

  computed: {
    isReadMode() {
      return this.readonly && this.selectedForm;
    },
    applicant() {
      return this.selectedForm.applicant.member
        ? `${this.selectedForm.applicant.member.username}'s Application`
        : '';
    },
    isDisabled() {
      // return !this.readonly && (!this.gresponse || !this.valid);

      return !this.valid;
    },
    open: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>

<style>
.inherit {
  height: inherit;
}

.no-scroll {
  overflow-y: hidden;
}

.scroll {
  overflow-y: auto;
}

.no-border {
  border-radius: 0;
}
</style>

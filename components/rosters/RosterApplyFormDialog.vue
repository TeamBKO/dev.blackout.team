<template>
  <v-dialog v-model="computedOpen" :max-width="maxWidth">
    <template #activator="props" v-if="$scopedSlots.activator">
      <slot name="activator" v-bind="props" />
    </template>
    <v-card>
      <v-toolbar prominent :src="banner">
        <div class="d-flex align-center justify-center flex-grow-1 inherit">
          <v-text-field v-model="name" label="Roster" readonly></v-text-field>
        </div>
        <v-btn x-small icon @click="computedOpen = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <template v-if="!submitted">
        <v-card-text>
          <v-form v-model="valid" ref="form">
            <roster-form
              v-if="selectedForm"
              v-model="fields"
              ref="formApplication"
              :form="selectedForm"
              :open="open"
            >
            </roster-form>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="save" :disabled="!valid">Submit</v-btn>
          <v-btn text @click="$refs.form.reset()">Reset</v-btn>
        </v-card-actions>
      </template>
      <template v-else>
        <v-card-text>
          <v-container>
            <v-row align="center" justify="center">
              <v-col cols="12" class="text-center">
                <v-icon :size="120">mdi-checkbox-marked-circle-outline</v-icon>
              </v-col>
              <v-col cols="12" class="text-center">
                <p class="headline">Thank you for submitting an application.</p>
                <p class="headline">We will get back to you soon.</p>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </template>
      <v-overlay absolute v-model="isSending">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-card>
  </v-dialog>
</template>

<script>
import isString from 'lodash/isString';
import isNull from 'lodash/isNull';
import ROSTERS from '~/constants/rosters/public.js';
import RosterForm from './RosterForm.vue';
import UserAvatar from '~/components/avatar/ListAvatar.vue';

export default {
  name: 'RosterApplyFormDialog',

  components: { RosterForm, UserAvatar },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    rosterID: {
      type: String,
      validator: (prop) => isString(prop) || isNull(prop),
    },
    maxWidth: {
      type: [String, Number],
      default: '600px',
    },
  },

  data() {
    return {
      open: false,
      valid: false,
      isSending: false,
      submitted: false,
      selectedForm: null,
      selectedRoster: null,
      banner: null,
      name: '',
      fields: [],
    };
  },

  watch: {
    async computedOpen(v) {
      if (v) {
        await this.setForm();
      } else {
        this.computedOpen = false;
        this.$nextTick(() => {
          this.selectedForm = null;
          this.selectedRoster = null;
          this.banner = null;
          this.name = '';
          this.fields = [];
          this.submitted = false;
        });
      }
    },
  },

  methods: {
    async getRosterForm() {
      this.isSending = true;
      try {
        const { data, status } = await this.$axios.get(
          `/forms/roster/${this.rosterID}`
        );
        if (status === 203) {
          this.submitted = true;
        } else {
          this.submitted = false;
        }

        return data;
      } finally {
        this.isSending = false;
      }
    },

    async setForm() {
      try {
        const response = await this.getRosterForm();

        this.selectedForm = response.form;

        if (response?.roster?.id) {
          this.selectedRoster = response.roster.id;
        }
        if (response?.roster?.name) {
          this.name = response.roster.name;
          Object.assign(this.selectedForm, { roster: { name: this.name } });
        }
        if (response?.roster?.banner) {
          this.banner = response.roster.banner;
        }
      } catch (err) {
        console.log(err);
      }
    },

    async save() {
      this.isSending = true;
      const params = {
        form_id: this.selectedForm.form_id,
        fields: this.fields,
      };
      try {
        const { roster, member } = await this.$axios.$post(
          `/rosters/${this.rosterID}`,
          params
        );

        if (roster) {
          this.$store.commit(ROSTERS.mutations.UPDATE_ITEM, {
            id: roster.id,
            joined: !!parseInt(roster.joined, 10),
            members: roster.members,
          });
        }

        if (member) {
          this.$emit('save', member);
        }
        this.submitted = true;
      } catch (err) {
        console.log(err);
        this.$toast.error(err.response.data.message, {
          position: 'top-center',
        });
      } finally {
        this.isSending = false;
      }
    },
  },
  computed: {
    computedOpen: {
      get() {
        return this.value || this.open;
      },
      set(value) {
        this.open = value;
        this.$emit('input', value);
      },
    },
  },
};
</script>

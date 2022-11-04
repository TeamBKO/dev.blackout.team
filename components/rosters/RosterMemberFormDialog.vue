<template>
  <v-dialog v-model="computedOpen" :eager="eager" :max-width="maxWidth">
    <template #activator="props" v-if="$scopedSlots.activator">
      <slot name="activator" v-bind="props" />
    </template>
    <v-card>
      <v-toolbar v-if="readOnly">
        <v-toolbar-title v-if="selectedForm">
          <user-avatar :item="selectedForm.applicant.member" :size="40" />
          <span>{{ applicant }}</span>
        </v-toolbar-title>
        <v-btn small absolute top right icon @click="computedOpen = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-toolbar prominent :src="banner" v-else>
        <div
          class="d-flex align-center justify-center flex-grow-1 inherit"
          :style="{ height: '100%' }"
        >
          <v-text-field v-model="name" label="Roster" readonly></v-text-field>
        </div>
        <v-btn x-small icon @click="computedOpen = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <roster-form
            v-model="fields"
            v-if="selectedForm"
            ref="formApplication"
            :form="selectedForm"
            :open="open"
            :readonly="readOnly"
          >
          </roster-form>
        </v-form>
      </v-card-text>
      <v-card-actions v-if="readOnlyAndNotPendingOrRejected">
        <v-spacer></v-spacer>
        <v-btn
          text
          color="green"
          @click="$emit('onUpdate', 'approved')"
          :disabled="!valid"
          >Approve</v-btn
        >
        <v-btn text color="error" @click="$emit('onUpdate', 'rejected')"
          >Reject</v-btn
        >
      </v-card-actions>
      <v-card-actions v-else-if="!readOnly">
        <v-spacer></v-spacer>
        <v-btn text @click="save" :disabled="!valid">Save</v-btn>
        <v-btn text @click="computedOpen = false">Close</v-btn>
      </v-card-actions>
      <v-overlay absolute v-model="isSending">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-card>
  </v-dialog>
</template>

<script>
import isString from 'lodash/isString';
import isNull from 'lodash/isNull';
import isNumber from 'lodash/isNumber';
import ROSTERS from '~/constants/rosters/public.js';
import RosterForm from './RosterForm.vue';
import UserAvatar from '~/components/avatar/ListAvatar.vue';

export default {
  name: 'RosterMemberFormDialog',

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
    rosterFormID: {
      type: Number,
      validator: (prop) => isNumber(prop) || isNull(prop),
    },
    formID: {
      type: String,
      validator: (prop) => isString(prop) || isNull(prop),
    },
    member: {
      type: Object,
    },
    maxWidth: {
      type: [String, Number],
      default: '600px',
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    eager: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    async computedOpen(v) {
      if (v) {
        await this.getMemberForm();
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

  data() {
    return {
      open: false,
      valid: false,
      isSending: false,
      selectedForm: null,
      selectedRoster: null,
      banner: null,
      name: '',
      fields: [],
    };
  },

  methods: {
    async getMemberForm() {
      this.isSending = true;
      try {
        let params = {};
        let url = `/forms/${this.userFormID}`;

        if (!this.userFormID) {
          url = `/forms/roster/${this.rosterID}`;
        } else {
          Object.assign(params, { roster_id: this.rosterID });
        }

        if (!this.readOnly) {
          Object.assign(params, { edit: true });
        }

        const response = await this.$axios.$get(url, {
          params,
        });

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
      } finally {
        this.isSending = false;
      }
    },

    async save() {
      let url = `/forms/${this.userFormID}`;
      let params = { fields: this.fields, roster_id: this.rosterID };

      if (this.member?.id) {
        /** The member doesn't have a form */
        if (!this.userFormID) {
          url = '/forms';
          Object.assign(params, {
            fields: this.fields.map((field) => {
              const { id, ...f } = field;
              return Object.assign(f, { field_id: id });
            }),
            member_id: this.member.id,
            form_id: this.selectedForm.form_id,
          });
        }
      }

      try {
        const response = await this.$axios.$put(url, params);

        console.log('update_form', response);

        this.computedOpen = false;
        this.$toast.success(
          `Updated form for member: ${response.member.username}`,
          {
            position: 'top-center',
          }
        );
        this.$emit('onUpdate', response);
      } catch (err) {
        this.$toast.error(err.response.data.message, {
          position: 'top-center',
        });
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
    applicant() {
      return this.selectedForm?.applicant?.member
        ? `${this.selectedForm.applicant.member.username}'s Application`
        : '';
    },

    memberStatus() {
      return this.member.status;
    },

    internalFormID() {
      return this.formID
        ? this.formID
        : this.hasForms
        ? parseInt(
            Object.keys(this.member.forms).find(
              (key) => parseInt(key, 10) === this.rosterFormID
            ),
            10
          )
        : null;
    },

    isSame() {
      return this.rosterFormID && this.rosterFormID === this.internalFormID;
    },

    hasForms() {
      return this.formID
        ? true
        : !!(this.member.forms && Object.keys(this.member.forms).length);
    },

    userFormID() {
      return this.formID
        ? this.formID
        : this.hasForms && this.isSame
        ? this.member.forms[this.internalFormID]
        : null;
    },

    hasUserForm() {
      return !!this.userFormID;
    },

    readOnlyAndNotPendingOrRejected() {
      return (
        this.readOnly &&
        (this.memberStatus === 'pending' || this.memberStatus === 'rejected')
      );
    },
  },
};
</script>

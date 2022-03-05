<template>
  <v-dialog persistent v-model="open" :width="width">
    <template #activator="{ on }">
      <v-btn text v-on="on" :disabled="disabled">{{ label }}</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <v-icon left>mdi-alert</v-icon>
        <span>{{ title }}</span>
      </v-card-title>
      <v-card-text>
        <p v-if="!awaitingConfirmation">
          Changing your contact information is considered a security risk and
          will require additional authorization through your current email
          address.
        </p>
        <v-form v-model="valid" v-else>
          <p>An email has been dispatched with a code.</p>
          <v-text-field
            filled
            v-for="(input, key) in inputFields"
            v-model="input.value"
            :label="input.label"
            :rules="input.validators"
            :key="key"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="error" @click="makeUpdateRequest">{{
          awaitingConfirmation ? 'Submit' : 'Send Code'
        }}</v-btn>
        <v-btn text color="default" @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
    <v-overlay absolute v-model="isSending">
      <v-progress-circular :size="72"></v-progress-circular>
    </v-overlay>
  </v-dialog>
</template>

<script>
import { isRequired, isEmail, minLength } from '~/utilities/validators';

export default {
  name: 'UpdateEmailDialog',

  props: {
    title: {
      type: String,
      default: 'Update Email',
    },
    label: {
      type: String,
      default: 'Submit',
    },
    disabled: {
      type: Boolean,
      required: true,
      default: true,
    },
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },

  data() {
    return {
      awaitingConfirmation: false,
      open: false,
      isSending: false,
      valid: false,

      currentEmail: this.data.email.value || '',

      width: 750,

      inputFields: {
        code: {
          label: 'Enter code to proceed',
          value: '',
          validators: [isRequired('code'), minLength('code', 32)],
        },
        newEmail: {
          label: 'New Email address',
          value: '',
          validators: [
            isRequired('Email'),
            isEmail('Email'),
            (v) =>
              v !== this.currentEmail ||
              'Email address must be different from the current',
          ],
        },
        newEmailConfirm: {
          label: 'Confirm New Email address',
          value: '',
          validators: [
            isRequired('Email'),
            (v) =>
              v === this.inputFields.newEmail.value ||
              'Email address must match',
          ],
        },
      },
    };
  },

  watch: {
    data(v) {
      if (v) {
        this.currentEmail = this.data.email.value;
      }
    },
  },

  methods: {
    cancel() {
      this.open = false;
      this.$nextTick(() => {
        this.awaitingConfirmation = false;
        this.inputFields.code.value = '';
      });
    },

    async dispatchEmail() {
      this.isSending = true;

      const email = this.data.email.value;
      const password = this.data.password.value;

      try {
        const resp = (
          await this.$axios.patch('/users/update/contact', { email, password })
        ).data;

        this.awaitingConfirmation = resp.awaitConfirmation;
      } catch (err) {
        Promise.reject(err);
      } finally {
        this.isSending = false;
      }
    },

    async makeUpdateRequest() {
      const code = this.inputFields.code.value;
      try {
        if (code) {
          this.$emit('onUpdate', {
            code,
            email: this.inputFields.newEmail.value,
          });
          this.open = false;
          this.awaitingConfirmation = false;
          this.inputFields.code.value = '';
          return;
        }

        await this.dispatchEmail();
      } catch (err) {
        const message = err.response.data.message || err.message;
        this.$toast.error(message, {
          position: 'top-center',
        });
      }
    },
  },
};
</script>

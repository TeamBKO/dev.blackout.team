<template>
  <v-dialog persistent v-model="open" :width="width">
    <template #activator="{ on }">
      <slot name="activator" v-bind="{ on }" />
    </template>
    <v-card>
      <v-card-title>
        <v-icon left>mdi-alert</v-icon>
        <span>{{ title }}</span>
      </v-card-title>
      <v-card-text>
        <v-row v-if="!awaitingConfirmation">
          <v-form v-model="valid">
            <v-col cols="12">
              <p>
                Changing your contact information is considered a security risk
                and will require additional authorization through your current
                email address.
              </p>
            </v-col>
            <v-col cols="12">
              <!-- <v-text-field
                type="password"
                filled
                v-model="password.value"
                :label="password.label"
                :rules="password.validators"
              ></v-text-field> -->
              <form-field
                v-model="password.value"
                filled
                :rules="password.validators"
                :field="{ type: 'password', label: 'Enter password' }"
              ></form-field>
            </v-col>
          </v-form>
        </v-row>

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
        <v-btn
          text
          color="error"
          :disabled="!valid"
          @click="makeUpdateRequest"
          >{{ awaitingConfirmation ? 'Submit' : 'Send Code' }}</v-btn
        >
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
import FormField from '~/components/form/FormField.vue';

export default {
  name: 'UpdateEmailDialog',

  components: { FormField },

  props: {
    title: {
      type: String,
      default: 'Edit Email',
    },
    label: {
      type: String,
      default: 'Submit',
    },
    email: {
      type: String,
      required: true,
      default: '',
    },
  },

  data() {
    return {
      awaitingConfirmation: false,
      open: false,
      isSending: false,
      valid: false,

      currentEmail: this.email || '',

      width: 750,

      password: {
        label: 'Enter password',
        value: '',
        validators: [isRequired('Password')],
      },

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
        this.currentEmail = this.email;
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

      const password = this.password.value;

      try {
        const resp = (
          await this.$axios.patch(`users/update/email`, { password })
        ).data;

        this.awaitingConfirmation = resp.awaitConfirmation;
      } catch (err) {
        return Promise.reject(err);
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

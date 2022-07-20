<template>
  <v-dialog persistent v-model="open" :width="width">
    <template #activator="{ on }">
      <slot name="activator" v-bind="{ on }" />
    </template>
    <v-card>
      <v-card-title>
        <v-icon left>mdi-alert</v-icon>
        <span>Update Password</span>
      </v-card-title>
      <v-card-text>
        <v-row v-if="!awaitingConfirmation">
          <v-form v-model="valid">
            <v-col cols="12">
              <p>
                Changing your password is considered a security risk and will
                require additional authorization through your current email
                address.
              </p>
            </v-col>
            <v-col cols="12">
              <form-field
                v-model="password.value"
                filled
                :field="password.info"
                :rules="password.validators"
              ></form-field>
            </v-col>
          </v-form>
        </v-row>

        <v-row v-else>
          <v-col cols="12">
            <p>An email has been dispatched with a code.</p>
            <password-criteria
              v-model="meetsPasswordCriteria"
              :input="inputFields.newPassword.value"
            ></password-criteria>
          </v-col>
          <v-form v-model="valid" class="row">
            <v-col cols="12" v-for="(input, key) in inputFields" :key="key">
              <form-field
                v-model="input.value"
                filled
                :field="input.info"
                :rules="input.validators"
              ></form-field>
            </v-col>
          </v-form>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text
          color="error"
          :disabled="isDisabled"
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
import { isRequired, minLength, maxLength } from '~/utilities/validators';
import PasswordCriteria from '~/components/auth/PasswordCriteria.vue';
import FormField from '~/components/form/FormField.vue';

export default {
  name: 'UpdatePasswordDialog',

  components: { FormField, PasswordCriteria },

  props: {
    value: {
      type: [String, Number, Boolean],
      default: '',
    },
  },

  data() {
    return {
      awaitingConfirmation: false,
      open: false,
      isSending: false,
      valid: false,
      meetsPasswordCriteria: false,

      width: 750,

      password: {
        info: {
          label: 'Enter password',
          type: 'password',
        },
        value: '',
        validators: [isRequired('Password')],
      },

      inputFields: {
        code: {
          info: {
            label: 'Enter code to proceed',
            type: 'text',
          },
          value: '',
          validators: [isRequired('code'), minLength('code', 32)],
        },
        newPassword: {
          info: {
            type: 'password',
            label: 'New password',
          },
          value: '',
        },
        newPasswordConfirm: {
          info: {
            label: 'New password',
            type: 'password',
          },
          value: '',
          validators: [
            (v) =>
              v === this.inputFields.newPassword.value ||
              'Passwords must match',
          ],
        },
      },
    };
  },

  methods: {
    cancel() {
      this.open = false;
      this.$nextTick(() => {
        this.awaitingConfirmation = false;
        this.inputFields.code.value = '';
      });
    },

    clearInputs() {
      for (let [key, val] of Object.entries(this.inputFields)) {
        this.inputFields[key].value = '';
      }
    },

    async dispatchEmail() {
      this.isSending = true;

      const password = this.password.value;

      try {
        const resp = (
          await this.$axios.patch(`/users/update/loggedin/password`, {
            password,
          })
        ).data;

        this.awaitingConfirmation = true;
        this.$toast.success('Dispatched an email with further instructions.', {
          position: 'top-center',
          duration: 5000,
        });
        this.clearInputs();
      } catch (err) {
        if (err.response.data.awaitingConfirmation !== undefined) {
          this.awaitingConfirmation = true;
        }
        return Promise.reject(err);
      } finally {
        this.password.value = '';
        this.isSending = false;
      }
    },

    async makeUpdateRequest() {
      const code = this.inputFields.code.value;
      try {
        if (code) {
          await this.$axios.patch(`/users/update/loggedin/password/${code}`, {
            code,
            password: this.inputFields.newPassword.value,
            confirm: this.inputFields.newPasswordConfirm.value,
          });
          this.open = false;
          this.awaitingConfirmation = false;
          this.clearInputs();
          this.$toast.success('Your new password has been saved.', {
            position: 'top-center',
            duration: 3000,
          });
          return;
        }

        await this.dispatchEmail();
      } catch (err) {
        console.log(err);
        const message = err.response.data.message || err.message;
        this.$toast.error(message, {
          position: 'top-center',
          duration: 5000,
        });
      }
    },
  },

  computed: {
    isDisabled() {
      return (
        !this.valid ||
        (this.awaitingConfirmation && !this.meetsPasswordCriteria)
      );
    },
  },
};
</script>

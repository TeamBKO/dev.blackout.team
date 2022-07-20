<template>
  <v-container fill-height>
    <v-row align="center" justify="center">
      <v-sheet rounded width="70%" class="text-center my-4">
        <v-icon :size="iconSize" v-text="icons[status]"></v-icon>
        <div class="text-h3">Password Reset</div>
        <template v-if="status === 0">
          <v-form v-model="valid">
            <v-container>
              <v-row align="center" justify="center" class="my-4">
                <password-criteria
                  v-model="passCriteria"
                  :input="newPassword"
                ></password-criteria>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <form-field
                    v-model="newPassword"
                    filled
                    :field="{ type: 'password', label: 'Enter new password' }"
                    :rules="[
                      isRequired('Password'),
                      compare,
                      isValidPassword('Password'),
                    ]"
                  ></form-field>
                  <!-- <v-text-field
                    label="Enter new password"
                    v-model="newPassword"
                    :rules="[
                      isRequired('Password'),
                      compare,
                      isValidPassword('Password'),
                    ]"
                    filled
                  ></v-text-field> -->
                </v-col>
                <v-col cols="12">
                  <form-field
                    v-model="confirmNewPassword"
                    filled
                    :field="{ type: 'password', label: 'Confirm new password' }"
                    :rules="[
                      isRequired('Password'),
                      compare,
                      isValidPassword('Password'),
                    ]"
                  ></form-field>
                  <!-- <v-text-field
                    label="Confirm new password"
                    v-model="confirmNewPassword"
                    :rules="[
                      isRequired('Password'),
                      compare,
                      isValidPassword('Password'),
                    ]"
                    filled
                  ></v-text-field> -->
                </v-col>
              </v-row>
              <v-col cols="12">
                <v-btn
                  @click="changePassword"
                  :disabled="!valid && !passCriteria"
                  >Submit</v-btn
                >
              </v-col>
            </v-container>
          </v-form>
        </template>
        <template v-else-if="status === 1">
          <p class="text-h5">{{ message }}</p>
          <p v-if="success">You will be redirected in {{ count }} seconds...</p>
        </template>
        <template v-else>
          <p class="text-h">{{ message }}</p>
        </template>
        <v-overlay absolute v-model="isSending">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
      </v-sheet>
    </v-row>
  </v-container>
</template>

<script>
import validators from '~/utilities/validators.js';
import PasswordCriteria from '~/components/auth/PasswordCriteria.vue';
import FormField from '~/components/form/FormField.vue';

const { isRequired, isValidPassword } = validators;

export default {
  name: 'PasswordReset',

  layout: 'default',

  components: { PasswordCriteria, FormField },

  middleware: [
    ({ query, params, redirect }) => {
      if (!params.code || !query.id) return redirect('/');
    },
  ],

  async asyncData({ query, params, $axios }) {
    try {
      const resp = (
        await $axios.post(`/users/password-reset/${params.code}`, {
          id: query.id,
        })
      ).data;

      return {
        status: resp.status,
        message: resp.message,
      };
    } catch (err) {
      console.log(err);
    }
  },

  beforeRouteLeave(to, from, next) {
    clearInterval(this.timer);
    this.timer = null;
    next();
  },

  data() {
    return {
      icons: ['mdi-lock-reset', 'mdi-account-alert', 'mdi-lock-open-check'],
      newPassword: '',
      confirmNewPassword: '',
      valid: false,
      success: false,
      isSending: false,
      passCriteria: false,
      iconSize: 200,
      status: 0,
      count: 5,
      message: '',
      timer: null,
    };
  },

  methods: {
    isRequired,
    isValidPassword,
    compare(v) {
      return v === this.newPassword || 'Passwords must match.';
    },
    async changePassword() {
      const id = this.$route.query.id;
      const code = this.$route.params.code;
      const password = this.newPassword;
      const confirm = this.confirmNewPassword;

      this.isSending = true;

      try {
        const resp = (
          await this.$axios.patch('/users/update/loggedout/password', {
            id,
            code,
            password,
            confirm,
          })
        ).data;
        this.message = resp.message;
        this.success = resp.success;
        this.status = resp.status;
        this.newPassword = '';
        this.confirmNewPassword = '';
        this.timer = setInterval(() => {
          if (!this.count) {
            clearInterval(this.timer);
            this.timer = null;
            this.$router.replace('/');
          }
          this.count--;
        }, 1000);
      } catch (err) {
        this.$toast.error(err.data.message || err.response.data.message, {
          position: 'top-center',
          duration: 3000,
        });
      } finally {
        this.isSending = false;
      }
    },
  },

  computed: {
    hasLowerCase() {
      return /^(?=.*[a-z])/.test(this.newPassword);
    },

    hasUpperCase() {
      return /^(?=.*[A-Z])/.test(this.newPassword);
    },

    hasNumericCharacter() {
      return /^(?=.*[0-9])/.test(this.newPassword);
    },

    hasSpecialCharacter() {
      return /(?=.*[!@#$%&_])/.test(this.newPassword);
    },

    meetsLengthCriteria() {
      return /(?=.{8,})/.test(this.newPassword);
    },

    alertType() {
      const isSuccessful = this.passwordCriteria.every(
        ({ color }) => color === 'success'
      );
      return isSuccessful ? 'success' : 'error';
    },

    passwordCriteria() {
      return [
        {
          text: 'Password must contain atleast 1 lowercase character.',
          color: this.hasLowerCase ? 'success' : 'error',
          icon: this.hasLowerCase ? 'mdi-check' : 'mdi-close',
        },
        {
          text: 'Password must contain atleast 1 uppercase character.',
          color: this.hasUpperCase ? 'success' : 'error',
          icon: this.hasUpperCase ? 'mdi-check' : 'mdi-close',
        },
        {
          text: 'Password must contain atleast 1 numeric character.',
          color: this.hasNumericCharacter ? 'success' : 'error',
          icon: this.hasNumericCharacter ? 'mdi-check' : 'mdi-close',
        },
        {
          text: 'Password must contain atleast 1 special character: !@%$%&_',
          color: this.hasSpecialCharacter ? 'success' : 'error',
          icon: this.hasSpecialCharacter ? 'mdi-check' : 'mdi-close',
        },
        {
          text: 'Password must be 8 characters in length or longer.',
          color: this.meetsLengthCriteria ? 'success' : 'error',
          icon: this.meetsLengthCriteria ? 'mdi-check' : 'mdi-close',
        },
      ];
    },
  },
};
</script>

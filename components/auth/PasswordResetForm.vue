<template>
  <v-tab-item eager>
    <v-card :light="light" :dark="dark">
      <v-card-title>
        <span>Password Reset</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="onClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="pw" v-if="!message">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Email address"
                  filled
                  v-model="email"
                  :rules="[isRequired('Email'), isEmail('Email')]"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <recaptcha
                  ref=""
                  :data-theme="recaptchaTheme"
                  @error="onError"
                  @expired="resetRecaptcha"
                  @success="onSuccess"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <v-alert type="success" v-else>
          <p>{{ message }}</p>
        </v-alert>
      </v-card-text>
      <v-card-actions v-if="!message">
        <v-btn block @click="send">Submit</v-btn>
      </v-card-actions>
      <v-overlay absolute v-model="isSending">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-card>
  </v-tab-item>
</template>

<script>
import validators from '~/utilities/validators.js';
import recaptcha from '~/mixins/recaptcha.js';

const { isRequired, isEmail } = validators;

export default {
  name: 'PasswordResetForm',

  mixins: [recaptcha],

  props: {
    dark: {
      type: Boolean,
      default: true,
    },
    light: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      valid: false,
      resend: true,
      isSending: false,
      email: '',
      message: '',
    };
  },

  methods: {
    isRequired,
    isEmail,

    reset() {
      this.message = '';
      this.gresponse = null;
      this.$recaptcha.reset();
    },

    onClose() {
      this.reset();
      this.$recaptcha.reset();
      this.$emit('close');
    },

    async send() {
      try {
        const resp = (
          await this.$axios.post('/users/password-reset', {
            type: 'reset',
            email: this.email,
            gresponse: this.gresponse,
          })
        ).data;

        this.message =
          "We've dispatched an email with instructions on how to reset your password. \nPlease follow them accordingly.";
      } catch (err) {
        console.log(err);
        this.reset();
        this.$toast.error(err.data.message, {
          position: 'top-center',
        });
      } finally {
        this.email = '';
        this.isSending = false;
        this.resetRecaptcha();
      }
    },
  },

  computed: {
    recaptchaTheme() {
      return this.light ? 'light' : 'dark';
    },
  },
};
</script>

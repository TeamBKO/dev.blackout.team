<template>
  <v-tab-item eager>
    <template>
      <v-card-text>
        <v-form v-model="valid" ref="signUpForm">
          <v-container>
            <v-row>
              <v-col cols="12" v-if="socialAuthenticationEnabled">
                <discord-button
                  :label="'Register with Discord'"
                ></discord-button>
                <divider></divider>
              </v-col>
              <v-col cols="12">
                <password-criteria
                  v-model="passwordCriteria"
                  :input="inputs.password.value"
                ></password-criteria>
              </v-col>
              <v-col cols="12" v-for="(input, key) in inputs" :key="key">
                <v-text-field
                  v-if="input.type === 'password'"
                  filled
                  v-model="input.value"
                  @click:append="input.show = !input.show"
                  :append-icon="input.show ? 'mdi-eye' : 'mdi-eye-off'"
                  :label="input.label"
                  :type="input.show ? 'text' : input.type"
                  :rules="input.rules"
                ></v-text-field>
                <v-text-field
                  v-else
                  filled
                  v-model="input.value"
                  :label="input.label"
                  :type="input.type"
                  :rules="input.rules"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <recaptcha
                  data-theme="dark"
                  @error="onError"
                  @expired="resetRecaptcha"
                  @success="onSuccess"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="dark darken-1" :disabled="isDisabled" @click="signUp"
          >Submit</v-btn
        >
        <v-btn text color="dark darken-1" @click="resetInputs">Reset</v-btn>
      </v-card-actions>
      <v-overlay absolute v-model="isSending">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </template>
  </v-tab-item>
</template>

<script>
import {
  isRequred,
  isEmail,
  maxLength,
  minLength,
  hasLowerCase,
  hasUpperCase,
  hasNumericCharacter,
  hasSpecialCharacter,
} from '~/utilities/validators.js';

import SETTINGS from '~/constants/settings/public.js';
import Divider from './Divider.vue';
import DiscordButton from '~/components/dialogs/DiscordButton.vue';
import PasswordCriteria from './PasswordCriteria';

import isAlphanumeric from '~/utilities/isAlphanumeric.js';

import recaptcha from '~/mixins/recaptcha.js';

export default {
  name: 'SignUpForm',
  components: { Divider, DiscordButton, PasswordCriteria },

  mixins: [recaptcha],

  props: {
    successful: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isSending: false,
      valid: false,
      passwordCriteria: false,
      pattern: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,

      inputs: {
        email: {
          label: 'Email',
          value: '',
          type: 'text',
          rules: [
            // isRequired('Email'),
            // isEmail('Email'),
            (v) => !!v || 'Email is required.',
            (v) => (v && this.pattern.test(v)) || 'Email must be valid.',
          ],
        },
        username: {
          label: 'Username',
          value: '',
          type: 'text',
          rules: [
            // isRequired('Username'),
            // isAlphanumeric('Username'),
            // minLength('Username', 3),
            // maxLength('Username', 30),
            (v) => !!v || 'Username is required.',
            (v) =>
              (v && isAlphanumeric(v)) ||
              'Username can only contain the following characters: a-z 0-9 _',
          ],
        },
        password: {
          label: 'Password',
          type: 'password',
          show: false,
          value: '',
          rules: [
            // isRequired('Password'),
            // minLength('Password', 8),
            // maxLength('Password', 50),
            // hasLowerCase('Password'),
            // hasUpperCase('Password'),
            // hasNumericCharacter('Password'),
            // hasSpecialCharacter('Password'),
            (v) => !!v || 'Password is required',
            (v) =>
              (v && v.length >= 8) ||
              'Password must be longer than 8 characters.',
            (v) =>
              (v && v.length <= 50) ||
              'Password cannot be longer than 50 characters.',
          ],
        },
        confirm: {
          label: 'Confirm Password',
          type: 'password',
          show: false,
          value: '',
          rules: [
            // isRequired('Confirm password'),
            (v) => !!v || 'Password is required',
            (v) =>
              (v && v === this.inputs.password.value) ||
              'Passwords must match.',
            (v) =>
              (v && v.length >= 8) ||
              'Password must be longer than 8 characters.',
            (v) =>
              (v && v.length <= 50) ||
              'Password cannot be longer than 50 characters.',
          ],
        },
      },
    };
  },

  methods: {
    reset() {
      // this.$refs.signUpForm.resetValidation();
      this.$recaptcha.reset();
      this.resetInputs();
    },

    resetInputs() {
      this.gresponse = null;
      this.$refs.signUpForm.reset();
    },

    async signUp() {
      const { confirm, ...creds } = Object.entries(this.inputs).reduce(
        (obj, [key, item]) => {
          obj[key] = item.value;
          return obj;
        },
        {}
      );
      try {
        const user = (
          await this.$axios.$post('/users/register', {
            ...creds,
            gresponse: this.gresponse,
          })
        ).data;
        this.reset();

        this.$emit('success', true);
      } catch (err) {
        console.log(err);
        this.$toast.error(err.message, { position: 'top-center' });
      }
    },
  },

  computed: {
    isDisabled() {
      return !this.passwordCriteria || !this.valid || !this.gresponse;
    },

    socialAuthenticationEnabled() {
      return this.$store.getters[SETTINGS.getters.SETTINGS_VALUES](
        'enableSocialAuthentication'
      );
    },
  },
};
</script>

<template>
  <v-tab-item eager>
    <v-card-text>
      <v-form v-model="valid" ref="form">
        <v-container>
          <v-row>
            <v-col cols="12" v-if="socialAuthenticationEnabled">
              <discord-button></discord-button>
              <divider></divider>
            </v-col>
            <v-col cols="12" v-for="(input, idx) in inputs" :key="idx">
              <template v-if="input.type === 'password'">
                <v-text-field
                  filled
                  v-model="input.value"
                  @click:append="showPassword = !showPassword"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :label="input.label"
                  :type="showPassword ? 'text' : input.type"
                  :rules="input.rules"
                ></v-text-field>
                <a @click.prevent="$emit('showPwResetForm')"
                  >Forgot your password?</a
                >
              </template>
              <v-text-field
                v-else
                filled
                v-model="input.value"
                :label="input.label"
                :type="input.type"
                :rules="input.rules"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="py-0">
              <v-checkbox
                v-model="rememberMe"
                :label="'Remember Me'"
              ></v-checkbox>
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
      <v-btn
        text
        color="dark darken-1"
        :disabled="isDisabled"
        @click.prevent="signIn"
        >Submit</v-btn
      >
      <v-btn text color="dark darken-1" @click="reset">Reset</v-btn>
    </v-card-actions>
    <v-overlay absolute v-model="isSending">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-tab-item>
</template>

<script>
// import VueRecaptcha from 'vue-recaptcha';
import SETTINGS from '~/constants/settings/public.js';
import Divider from './Divider.vue';
import DiscordButton from '~/components/dialogs/DiscordButton';
import recaptcha from '~/mixins/recaptcha.js';
import {
  isRequired,
  isEmail,
  minLength,
  maxLength,
} from '~/utilities/validators.js';

export default {
  name: 'SigninForm',

  mixins: [recaptcha],

  components: { Divider, DiscordButton },

  data() {
    return {
      valid: false,
      isSending: false,
      showPassword: false,
      rememberMe: false,

      pattern: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,

      inputs: [
        {
          label: 'Email',
          value: '',
          type: 'text',

          rules: [
            isRequired('Email'),
            isEmail('Email'),
            // (v) => !!v || 'Email is required.',
            // (v) => (v && this.pattern.test(v)) || 'Email must be valid.',
          ],
        },
        {
          label: 'Password',
          value: '',
          type: 'password',

          rules: [
            isRequired('Password'),
            minLength('Password', 8),
            maxLength('Password', 50),
            // (v) => !!v || 'Password is required',
            // (v) =>
            //   (v && v.length > 8) ||
            //   'Password must be longer than 8 characters.',
            // (v) =>
            //   (v && v.length <= 50) ||
            //   'Password cannot be longer than 50 characters.',
          ],
        },
      ],
    };
  },

  methods: {
    // async loginWithDiscord() {
    //   try {
    //     await this.$auth.loginWith('bko');
    //   } catch (err) {
    //     this.$toast.error(err.response.data.message, {
    //       position: 'top-center',
    //     });
    //   }
    // },

    reset() {
      this.$recaptcha.reset();

      this.resetInputs();
    },

    resetInputs() {
      this.grecaptcha = null;
      this.$refs.form.reset();
    },

    async signIn() {
      if (!this.valid || !this.gresponse) return;
      this.isSending = true;

      const data = {
        email: this.inputs[0].value,
        password: this.inputs[1].value,
        gresponse: this.gresponse,
      };

      try {
        const resp = await this.$auth.loginWith('local', {
          data,
        });

        this.$toast.show("You've succesfully logged in.", {
          icon: 'check',
          position: 'top-right',
        });
      } catch (err) {
        const code = parseInt(err.response && err.response.status);
        const message = err.response.data.message || err;
        this.resetRecaptcha();
        this.$toast.error(`${code}: ${message}`, {
          position: 'top-center',
          duration: 3000,
        });
      } finally {
        this.isSending = false;
        this.gresponse = null;
      }
    },
  },

  computed: {
    isDisabled() {
      return !this.valid || !this.gresponse;
    },
    socialAuthenticationEnabled() {
      return this.$store.getters[SETTINGS.getters.SETTINGS_VALUES](
        'enableSocialAuthentication'
      );
    },
  },
};
</script>

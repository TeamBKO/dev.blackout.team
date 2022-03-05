<template>
  <v-container fluid fill-height>
    <v-row justify-center align-center fill-height>
      <v-spacer></v-spacer>
      <v-card light :max-width="500">
        <v-card-title>
          <v-btn text icon @click="$router.push({ name: 'index' })">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <span>Admin Login</span>
        </v-card-title>
        <v-tabs-items light v-model="tab">
          <v-tab-item eager>
            <v-form v-model="valid" ref="adminLoginForm">
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      filled
                      :label="'Email'"
                      :rules="[isRequired('Email'), isEmail('Email')]"
                      v-model="credentials.email"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <async-text-input
                      :label="'Password'"
                      :type="'password'"
                      :rules="[isRequired('Password')]"
                      v-model="credentials.password"
                    ></async-text-input>
                    <a @click.prevent="tab = 1">Forgot your password?</a>
                  </v-col>
                  <v-col cols="12">
                    <recaptcha
                      @error="onError"
                      @expired="resetRecaptcha"
                      @success="onSuccess"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-form>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="login" :disabled="isDisabled">Submit</v-btn>
              <v-btn text @click="resetForm">Reset</v-btn>
            </v-card-actions>
          </v-tab-item>
          <password-reset-form
            light
            :dark="false"
            @close="tab = 0"
          ></password-reset-form>
        </v-tabs-items>

        <v-overlay absolute v-model="isSending">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
      </v-card>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
import PasswordResetForm from '~/components/auth/PasswordResetForm.vue';
import AsyncTextInput from '~/components/inputs/AsyncTextInput.vue';
import recaptcha from '~/mixins/recaptcha';
import { isRequired, isEmail } from '~/utilities/validators.js';

export default {
  name: 'AdminPageLogin',
  layout: 'adminLogin',

  components: { PasswordResetForm, AsyncTextInput },

  mixins: [recaptcha],

  middleware: [
    ({ redirect, $auth, $permissions }) => {
      if ($auth.loggedIn && $auth.hasScope([$permissions.VIEW_ALL_ADMIN])) {
        redirect('/admin/dashboard');
      }
    },
  ],

  data() {
    return {
      tab: 0,
      valid: false,
      isSending: false,
      credentials: {
        email: '',
        password: '',
      },
    };
  },

  methods: {
    isRequired,
    isEmail,
    async login() {
      this.isSending = true;
      try {
        if (this.$auth.loggedIn) {
          await this.$axios.post('/auth/logout');
          this.$auth.setUser({});
          this.$auth.strategy.token.reset();
          this.$auth.strategy.refreshToken.reset();
        }

        const data = Object.assign({}, this.credentials, {
          gresponse: this.gresponse,
        });

        await this.$auth.loginWith('local', { data });
        this.$router.go('/admin/dashboard');
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

    resetForm() {
      this.$refs.adminLoginForm.reset();
      this.$recaptcha.reset();
    },
  },

  computed: {
    isDisabled() {
      return !this.gresponse || !this.valid;
    },
  },
};
</script>

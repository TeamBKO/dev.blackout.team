<template>
  <v-dialog v-model="show" :max-width="'600px'">
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }" />
    </template>
    <v-card class="auth">
      <v-toolbar>
        <v-tabs
          fixed-tabs
          v-model="tab"
          dark
          :hide-slider="hideSlider"
          @change="$recaptcha.reset()"
        >
          <v-tab :disabled="tab === 2">
            <span>Sign In</span>
          </v-tab>
          <v-tab :disabled="tab === 2" v-if="enableUserRegistration">
            <span>Sign Up</span>
            <v-btn small icon absolute top right @click.stop="show = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-tab>
          <!-- <v-tab style="display: none"></v-tab> -->
        </v-tabs>
      </v-toolbar>
      <v-tabs-items v-model="tab">
        <sign-in ref="signin" @showPwResetForm="showPwResetForm"></sign-in>
        <sign-up ref="signup" @success="onSuccess"></sign-up>
        <password-reset-form
          ref="pwreset"
          @close="hidePwResetForm"
        ></password-reset-form>
      </v-tabs-items>
    </v-card>
  </v-dialog>
</template>

<script>
import SETTINGS from '~/constants/settings/public.js';
import SignIn from './SigninForm.vue';
import SignUp from './SignupForm.vue';
import PasswordResetForm from './PasswordResetForm.vue';
export default {
  name: 'AuthDialog',

  components: { SignIn, SignUp, PasswordResetForm },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      tab: 0,
      hideSlider: false,
      open: false,
    };
  },

  beforeDestroy() {
    this.show = false;
    // if (window.recaptcha) {
    //   this.$recaptcha.reset();
    // }
  },

  watch: {
    open(v) {
      if (!v) {
        this.tab = 0;
        // this.$refs.signup.reset();
        // this.$refs.signin.reset();
        // this.$refs.pwreset.reset();
        this.$refs.signup.resetInputs();
        this.$refs.signin.resetInputs();
        this.$refs.pwreset.reset();
        if (window.grecaptcha) {
          this.$recaptcha.reset();
        }
        this.show = false;
      }
    },
  },

  methods: {
    showPwResetForm() {
      this.hideSlider = true;
      this.tab = 2;
    },

    hidePwResetForm() {
      this.tab = 0;
      this.hideSlider = false;
    },

    onSuccess() {
      this.show = false;
      this.$nextTick(() => {
        this.tab = 0;
      });
      const message =
        'Thank you for registering. An email has been dispatched with instructions on how to activate';
      this.$toast.show(message, {
        icon: 'check',
        position: 'top-center',
      });
    },
  },

  computed: {
    enableUserRegistration() {
      return this.$store.getters[SETTINGS.getters.SETTINGS_VALUES](
        'enableUserRegistration'
      );
    },
    show: {
      get() {
        return this.open || this.value;
      },
      set(value) {
        this.open = value;
        this.$emit('input', value);
      },
    },
  },
};
</script>

<style>
.auth {
  position: relative;
}
</style>

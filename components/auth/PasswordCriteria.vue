<template>
  <v-row align="center" justify="center" class="my-4">
    <v-alert border="left" :type="alertType">
      <v-list>
        <v-list-item v-for="(criteria, idx) in passwordCriteria" :key="idx">
          <v-list-item-icon>
            <v-icon :color="criteria.color" v-text="criteria.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-subtitle class="text-left">{{
              criteria.text
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-alert>
  </v-row>
</template>

<script>
export default {
  name: 'PasswordCriteria',

  props: {
    value: {
      type: Boolean,
    },
    input: {
      type: String,
      required: true,
    },
  },

  watch: {
    passAllCriteria(v) {
      this.$emit('input', v);
    },
  },

  computed: {
    hasLowerCase() {
      return /^(?=.*[a-z])/.test(this.input);
    },

    hasUpperCase() {
      return /^(?=.*[A-Z])/.test(this.input);
    },

    hasNumericCharacter() {
      return /^(?=.*[0-9])/.test(this.input);
    },

    hasSpecialCharacter() {
      return /(?=.*[!@#$%&_])/.test(this.input);
    },

    meetsLengthCriteria() {
      return /(?=.{8,})/.test(this.input);
    },

    passAllCriteria() {
      return this.passwordCriteria.every(({ color }) => color === 'success');
    },

    alertType() {
      return this.passAllCriteria ? 'success' : 'error';
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

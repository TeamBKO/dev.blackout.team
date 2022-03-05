<template>
  <v-dialog persistent v-model="open" :width="width">
    <template #activator="{ on }">
      <v-btn color="error" large block v-on="on">Delete Account</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <v-icon left>mdi-alert</v-icon>
        <span>Delete Account</span>
      </v-card-title>
      <v-card-text v-if="!awaitingConfirmation">
        <p>
          Deleting your account requires additional authentication and upon
          confirmation will auto logout your account.
        </p>
        <strong>Changes are irrevesible.</strong>
      </v-card-text>
      <v-card-text v-else>
        <p>An email has been dispatched with a pass code.</p>
        <v-text-field
          label="Enter code to proceed"
          v-model="code"
          filled
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="error" @click="selfTerminate">{{
          awaitingConfirmation ? 'Self Terminate' : 'Send Code'
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
export default {
  name: 'DeleteSelfButton',

  data() {
    return {
      awaitingConfirmation: false,
      open: false,
      isSending: false,
      code: '',
      width: 750,
    };
  },

  // watch: {
  //   open(oldVal, newVal) {
  //     if (!oldVal) {
  //       this.dispatchEmail();
  //     }
  //   },
  // },

  methods: {
    cancel() {
      this.open = false;
      this.$nextTick(() => {
        this.awaitingConfirmation = false;
        this.code = '';
      });
    },

    async dispatchEmail() {
      this.isSending = true;
      try {
        const { awaitingConfirmation } = (
          await this.$axios.post(`/users/delete/me`)
        ).data;
        this.awaitingConfirmation = awaitingConfirmation;
      } finally {
        this.isSending = false;
      }
    },

    async selfTerminate() {
      try {
        if (this.code) {
          await this.$axios.post(`/users/delete/me/${this.code}`);
          this.open = false;
          this.awaitingConfirmation = false;
          this.code = '';
          this.$auth.logout();

          return;
        }

        this.dispatchEmail();
      } catch (err) {
        this.$toast.error(err.response.data.message, {
          position: 'top-center',
        });
      }
    },
  },
};
</script>

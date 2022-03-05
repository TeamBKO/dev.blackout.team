<template>
  <v-dialog v-model="open" persistent :min-width="minWidth" :width="minWidth">
    <v-card>
      <v-card-title>
        <v-icon left v-text="icon"></v-icon>
        <span>An account change has occurred</span>
      </v-card-title>
      <v-card-text>
        <p>A change to your has occurred requiring you to relog.</p>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="logout">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import page from '~/constants/page/public.js';
export default {
  name: 'StatusDialog',

  props: {
    minWidth: {
      type: [Number, String],
      default: 400,
    },
  },

  data() {
    return {
      icon: 'mdi-alert',
    };
  },

  methods: {
    logout() {
      this.$auth.logout();
      this.$store.commit(page.mutations.TOGGLE_STATUS_DIALOG, false);
    },
  },

  computed: {
    open() {
      return this.$store.getters[page.getters.STATUS_DIALOG];
    },
  },
};
</script>

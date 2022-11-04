<template>
  <v-dialog v-model="open" :max-width="500">
    <template #activator="{ on }">
      <slot name="activator" v-bind="{ on }" />
    </template>
    <v-card>
      <v-toolbar dark>
        <v-toolbar-title>Discord Roles</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon><v-icon>mdi-refresh</v-icon></v-btn>
        <v-btn icon @click="open = false"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <discord-roles
        v-model="selectedRoles"
        :tabIsActive="open"
        :displayAlert="false"
      ></discord-roles>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text>Save</v-btn>
        <v-btn text>Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import DiscordRoles from '~/components/roles/DiscordRoles.vue';
export default {
  name: 'SettingDiscordRoles',

  components: { DiscordRoles },

  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      selectedRoles: [],
      open: false,
    };
  },

  methods: {
    async save() {
      try {
        const roles = await this.$axios.$post(`/bot/watch`, {
          roles: this.selectedRoles,
        });

        this.$emit('input', roles);

        this.$toast.success(`Changes saved.`, {
          position: 'top-center',
          duration: 5000,
        });
      } catch (err) {}
    },
  },
};
</script>

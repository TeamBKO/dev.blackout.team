<template>
  <v-row>
    <template v-for="item in items">
      <v-col cols="12" v-if="item.condition" :key="item.name">
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.label }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ item.desc }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-switch v-model="item.value"></v-switch>
          </v-list-item-action>
        </v-list-item>
      </v-col>
    </template>
  </v-row>
</template>

<script>
import isUndefined from 'lodash/isUndefined';
export default {
  name: 'RosterPermissions',

  props: {
    value: {
      type: Object,
    },
    permissions: {
      type: Object,
    },
  },

  watch: {
    value: {
      immediate: true,
      handler(permissions) {
        this.items.forEach((item) => {
          if (!isUndefined(permissions[item.name])) {
            item.value = permissions[item.name];
          }
        });
      },
    },
    items: {
      immediate: true,
      deep: true,
      handler: function () {
        this.$emit('change', this.computedPermissions);
      },
    },
  },

  data() {
    return {
      items: [
        {
          label: 'Add Members',
          desc: 'Add and/or Invite members to the roster.',
          name: 'can_add_members',
          value: false,
          condition: this.permissions.can_add_members,
        },
        {
          label: 'Edit Members',
          desc: 'Edit applicants & members. Grants member approval and rejection privilages. Change member permissions.',
          name: 'can_edit_members',
          value: false,
          condition: this.permissions.can_edit_members,
        },
        {
          label: 'Edit Member Ranks',
          desc: "Grants the privilage to change a member's current rank. Requires Edit Members to be enabled.",
          name: 'can_edit_member_ranks',
          value: false,
          condition: this.permissions.can_edit_member_ranks,
        },
        {
          label: 'Remove Members',
          desc: 'Requires you to be able to edit members. Removes applicants from pending status, and members from approval.',
          name: 'can_remove_members',
          value: false,
          condition: this.permissions.can_remove_members,
        },
        {
          label: 'Add Ranks',
          desc: 'Add a new rank to the roster.',
          name: 'can_add_ranks',
          value: false,
          condition: this.permissions.can_add_ranks,
        },
        {
          label: 'Edit Ranks',
          desc: 'Edit a current rank for the roster.',
          name: 'can_edit_ranks',
          value: false,
          condition: this.permissions.can_edit_ranks,
        },
        {
          label: 'Remove Ranks',
          desc: 'Requires you to be able to edit members. Deletes the rank from the roster.',
          name: 'can_remove_ranks',
          value: false,
          condition: this.permissions.can_remove_ranks,
        },
        {
          label: 'Edit Roster Details',
          desc: 'Allows you to change roster settings like roster banner, icon and more sensitive things like recruitment status.',
          name: 'can_edit_roster_details',
          value: false,
          condition: this.permissions.can_edit_roster_details,
        },
        {
          label: 'Delete Roster',
          desc: 'Closes the roster and is irrevesible.',
          name: 'can_delete_roster',
          value: false,
          condition: this.permissions.can_delete_roster,
        },
      ],
    };
  },

  computed: {
    computedPermissions() {
      return this.items.reduce((output, item) => {
        output[item.name] = item.value;
        return output;
      }, {});
    },
  },
};
</script>

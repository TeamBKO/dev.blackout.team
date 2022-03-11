<template>
  <v-menu v-model="computedValue" :close-on-content-click="false">
    <template #activator="{ on }">
      <slot name="activator" v-bind="{ on }" />
    </template>
    <v-list :dense="dense">
      <slot name="top" v-bind="permissions" />
      <v-list-item
        v-for="(action, idx) in actions"
        :key="idx"
        @click="$emit('changeStatus', action.emit)"
      >
        <v-list-item-icon>
          <v-icon>{{ action.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-subtitle>{{ action.label }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <slot name="bottom" v-bind="permissions" />
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'RosterActions',

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    permissions: {
      type: Object,
      default: () => {},
    },
    dense: {
      type: Boolean,
      default: false,
    },
    isApplicantTab: {
      type: Boolean,
      default: false,
    },
    isMemberTab: {
      type: Boolean,
      default: false,
    },
    isRejectedTab: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
    },
  },

  computed: {
    actionList() {
      return [
        {
          icon: 'mdi-check',
          label: 'Approve',
          name: 'can_edit_members',
          emit: 'approve',
          conditions: [this.isApplicantTab, this.isRejectedTab],
        },
        {
          icon: 'mdi-close',
          label: 'Reject',
          name: 'can_edit_members',
          emit: 'rejected',
          conditions: [this.isApplicantTab],
        },
        {
          icon: 'mdi-account-remove-outline',
          label: 'Remove',
          name: 'can_remove_members',
          emit: 'removed',
          conditions: [
            this.isApplicantTab,
            this.isMemberTab,
            this.item?.rank?.name !== 'Owner',
          ],
        },
      ];
    },
    actions() {
      return this.actionList.reduce((arr, item) => {
        if (this.permissions[item.name]) {
          let { conditions, ...i } = item;
          if (!Array.isArray(item.conditions)) {
            conditions = [item.conditions];
          }
          if (conditions && conditions.length) {
            const isTruthy = conditions.some((condition) => condition);
            if (!isTruthy) {
              return arr;
            }
          }
          arr.push(i);
        }
        return arr;
      }, []);
    },
    computedValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>

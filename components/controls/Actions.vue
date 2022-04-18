<template>
  <v-menu v-model="open" close-on-content-click>
    <template #activator="{ on, attrs }">
      <v-btn small icon v-on="on" v-bind="attrs">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>
    <v-list dense nav flat>
      <v-subheader>ACTIONS</v-subheader>
      <template v-for="(action, idx) in computedActions">
        <v-list-item
          role="button"
          :key="idx"
          @click="$emit(action.label)"
          v-if="!$scopedSlots[action.label]"
        >
          <v-list-item-content>
            <v-list-item-title>
              <v-icon left small v-text="action.icon"></v-icon>
              <span>{{ action.text }}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <slot
          :name="action.label"
          v-bind="{
            text: action.text,
            icon: action.icon,
            label: action.label,
            scope: action.scope,
            isDeletable,
          }"
        />
      </template>

      <slot />
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'Actions',
  props: {
    actions: {
      type: Array,
      default: () => [],
    },
    suffix: {
      type: String,
    },
    isDeletable: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      open: false,
      icon: 'mdi-dots-veritcal',
    };
  },

  computed: {
    computedActions() {
      // return this.actions.reduce((arr, action) => {
      //   if (this.$auth.hasScope(action.scope)) {
      //     if (!this.isDeletable && /^delete:(all|own)/.test(action.scope)) {
      //       return arr;
      //     }
      //     action.label = action.text.toLowerCase();
      //     action.text =
      //       action.text.charAt(0).toUpperCase() + action.text.slice(1);

      //     arr.push(action);
      //   }
      //   return output;
      // }, []);
      return this.actions.reduce((arr, action) => {
        if (this.$auth.hasScope(action.scope)) {
          if (!this.isDeletable && /^delete:(all|own)/.test(action.scope)) {
            return arr;
          }
          action.label = action.text.toLowerCase();
          action.text =
            action.text.charAt(0).toUpperCase() + action.text.slice(1);

          arr.push(action);
        }
        return arr;
      }, []);
    },
  },
};
</script>

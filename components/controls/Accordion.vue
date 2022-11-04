<template>
  <v-expansion-panel :class="rootClass" v-model="open">
    <v-expansion-panel-header
      hide-actions
      @click.native="open = !open"
      class="py-0 px-0"
      :style="headerStyles"
      :id="headerId"
    >
      <v-list-item class="pa-0" v-if="!$scopedSlots.header">
        <v-list-item-icon class="mr-0" v-if="!iconLeft">
          <v-btn icon>
            <v-icon :class="iconClass" :small="iconSmall"
              >mdi-chevron-right</v-icon
            >
          </v-btn>
        </v-list-item-icon>
        <slot name="icon-left"></slot>
        <v-list-item-content>
          <v-list-item-title v-if="!$scopedSlots.title">
            {{ title }}
          </v-list-item-title>
          <slot name="title" />
        </v-list-item-content>
        <v-list-item-icon class="ml-0" v-if="iconLeft">
          <v-btn icon>
            <v-icon :class="iconClass" :small="iconSmall"
              >mdi-chevron-right</v-icon
            >
          </v-btn>
        </v-list-item-icon>
        <v-list-item-action v-if="$scopedSlots.actions"> </v-list-item-action>
      </v-list-item>
      <slot name="header" v-bind="{ iconClass }" />
    </v-expansion-panel-header>
    <v-expansion-panel-content :class="contentClass">
      <slot />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';

export default {
  name: 'Accordion',

  props: {
    value: {
      type: Boolean,
    },
    title: {
      type: String,
    },
    iconSmall: {
      type: Boolean,
      default: false,
    },
    iconLeft: {
      type: Boolean,
      default: false,
    },
    headerHeight: {
      type: [Number, String],
    },
    rootClass: {
      type: [Array, Object, String],
    },
    contentClass: {
      type: [Array, Object, String],
    },
    headerId: {
      type: [String, Number],
    },
  },

  watch: {
    value: {
      immediate: true,
      handler: function (newVal, oldVal) {
        if (!isUndefined(newVal) && newVal !== oldVal) {
          this.open = newVal;
        }
      },
    },
  },

  data() {
    return {
      open: false,
    };
  },

  computed: {
    iconClass() {
      return ['panel-button', { active: this.open }];
    },

    headerStyles() {
      const height = this.headerHeight
        ? isString(this.headerHeight)
          ? this.headerHeight
          : `${this.headerHeight}px`
        : null;
      return {
        height,
        'min-height': height,
      };
    },
  },
};
</script>

<style scoped lang="scss">
.panel-button {
  transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &.active {
    transform: rotate(90deg);
  }
}

.v-expansion-panel-content::v-deep .v-expansion-panel-content__wrap {
  padding: 0 !important;
}
</style>

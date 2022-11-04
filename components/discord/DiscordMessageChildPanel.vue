<template>
  <v-expansion-panel class="pa-0" :style="rootStyles">
    <v-expansion-panel-header
      hide-actions
      @click.native="open = !open"
      class="pa-0"
    >
      <v-list-item class="pa-0">
        <v-list-item-icon class="mr-0">
          <v-btn icon>
            <v-icon :class="iconClass">mdi-chevron-right</v-icon>
          </v-btn>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-subtitle>
            {{ title.charAt(0).toUpperCase() + title.slice(1) }}
            <v-icon right color="#ff7373" small v-if="!computedValid"
              >mdi-alert-circle</v-icon
            >
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action v-if="showActions">
          <div class="d-flex">
            <v-spacer></v-spacer>
            <v-btn
              icon
              v-if="isMiddlePosition"
              class="mx-1"
              @click.stop="moveUp"
            >
              <v-icon small>mdi-chevron-up</v-icon>
            </v-btn>
            <v-btn id="move" icon @click.stop="move" v-if="hasMoreThanOne">
              <v-icon small>{{ moveIconState }}</v-icon>
            </v-btn>
            <v-btn
              id="duplicate"
              icon
              @click.stop="$emit('duplicate', position)"
              class="mx-1"
            >
              <v-icon small>mdi-content-duplicate</v-icon>
            </v-btn>
            <v-btn icon @click.stop="remove">
              <v-icon small>mdi-close</v-icon>
            </v-btn>
          </div>
        </v-list-item-action>
      </v-list-item>
    </v-expansion-panel-header>
    <v-expansion-panel-content class="px-0">
      <v-form lazy-validation v-model="computedValid">
        <slot v-bind="{ valid }" />
      </v-form>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import isUndefined from 'lodash/isUndefined';
import isBoolean from 'lodash/isBoolean';
export default {
  name: 'DiscordMessageChildPanel',

  props: {
    value: {
      type: Boolean,
      default: undefined,
      validator: (prop) => isUndefined(prop) || isBoolean(prop),
    },
    title: {
      type: String,
      default: '',
    },
    showActions: {
      type: Boolean,
      default: false,
    },
    position: {
      type: Number,
      default: 0,
    },
    isValid: {
      type: Boolean,
      default: undefined,
      validator: (prop) => isUndefined(prop) || isBoolean(prop),
    },
    maxNumOfPanels: {
      type: Number,
      default: 0,
    },
  },

  watch: {
    isValid: {
      immediate: true,
      handler: function (v) {
        if (!isUndefined(v)) {
          this.valid = v;
        }
      },
    },

    valid(v) {
      this.$emit('valid', v);
    },
  },

  data() {
    return {
      open: false,
      valid: true,
    };
  },

  methods: {
    updateColor(event) {
      this.$emit('update:color', color);
    },
    moveDown() {
      let to = this.position;
      let from = this.position;
      if (this.position === this.isInLastPosition) return;
      ++to;
      this.$emit('moveField', { from, to });
    },
    moveUp() {
      let to = this.position;
      let from = this.position;
      if (this.position === this.isInFirstPosition) return;
      --to;
      this.$emit('moveField', { from, to });
    },
    move() {
      this.isInFirstPosition || this.isMiddlePosition
        ? this.moveDown()
        : this.moveUp();
    },
    remove() {
      this.$emit('remove', this.position);
    },
  },

  computed: {
    computedValid: {
      get() {
        return !isUndefined(this.value) ? this.value : this.valid;
      },
      set(value) {
        if (!isUndefined(this.value)) {
          this.$emit('input', value);
        } else {
          this.valid = value;
        }
      },
    },
    rootStyles() {
      return {
        'border-bottom-left-radius': '0px',
        'border-bottom-right-radius': '0px',
      };
    },
    iconClass() {
      return ['chevron', { active: this.open }];
    },
    moveIconState() {
      return this.isInFirstPosition || this.isMiddlePosition
        ? 'mdi-chevron-down'
        : 'mdi-chevron-up';
    },
    hasMoreThanOne() {
      return this.maxNumOfPanels > 1;
    },
    isInFirstPosition() {
      return this.posiiton === 0;
    },
    isInLastPosition() {
      return this.position === this.maxNumOfPanels - 1 && this.maxNumOfPanels;
    },
    isMiddlePosition() {
      return (
        this.position > 0 &&
        this.position !== this.isInLastPosition &&
        this.maxNumOfPanels > 1
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.v-expansion-panel-content::v-deep .v-expansion-panel-content__wrap {
  padding: 0 !important;
}
</style>

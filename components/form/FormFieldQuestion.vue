<template>
  <v-row class="pb-4">
    <v-col md="12" sm="12">
      <div class="text--subtitle-1">
        <span>Question {{ num }}</span>
      </div>
      <div class="d-flex align-center">
        <div class="flex-grow-1 pr-5">
          <v-text-field
            v-model="computedValue"
            :label="label"
            :placeholder="label"
          >
            <template #prepend>
              <v-icon class="handle" small v-text="icon"></v-icon>
            </template>
          </v-text-field>
        </div>
        <form-select-menu
          small
          outlined
          v-model="computedType"
          @change="onChange"
          :medium="false"
          :items="types"
        ></form-select-menu>
        <v-btn icon @click="$emit('removeField', index)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <v-switch label="Optional" v-model="computedOptional"></v-switch>
      <v-row class="pl-12" v-if="field.options && field.options.length">
        <form-field-option
          v-for="(option, o) in field.options"
          v-model="field.options[o]"
          :idx="o"
          :key="o"
          :length="field.options.length - 1"
          @addOption="addOption(index)"
        >
          <template #default>
            <v-btn
              icon
              x-small
              @click.native.stop="removeOption(o)"
              v-if="field.options.length > 1"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </form-field-option>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import FormSelectMenu from './FormSelectMenu.vue';
import FormFieldOption from './FormFieldQuestionOption.vue';

import isAlphanumeric from '~/utilities/isAlphanumeric.js';
import isEqual from 'lodash/isEqual';

const { mapGetters, mapMutations } = createNamespacedHelpers('forms');

export default {
  name: 'FormFieldQuestion',

  components: {
    FormSelectMenu,
    FormFieldOption,
  },

  props: {
    value: {
      type: [String, Number, Boolean],
    },
    field: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
    },
    optional: {
      type: Boolean,
    },
    options: {
      type: [Array, Object],
    },
    num: {
      type: Number,
    },
    isDrag: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      icon: 'mdi-menu',
      isRequired: (v) =>
        (v.length && isAlphanumeric(v)) || 'Field is required.',
      types: [
        { icon: 'mdi-form-textbox', type: 'textfield', name: 'Short answer' },
        { icon: 'mdi-form-textarea', type: 'textarea', name: 'Long answer' },
        {
          icon: 'mdi-radiobox-marked',
          type: 'multiple',
          options: true,
          name: 'Multiple choice',
        },
        {
          icon: 'mdi-form-select',
          type: 'select',
          options: true,
          name: 'Select one',
        },
        {
          icon: 'mdi-checkbox-marked',
          type: 'checkbox',
          options: true,
          name: 'Checkboxes',
        },
      ],
    };
  },

  methods: {
    clearOptions(i) {
      this.$emit('clearOption', i);
    },

    addOption(i) {
      this.$emit('addOption', i);
    },

    removeOption(option) {
      this.$emit('removeOption', { idx: this.index, option });
    },

    onChange() {
      if (this.hasOptions) {
        if (!this.field.options || !this.field.options.length) {
          this.$emit('update:options', ['']);
        }
      } else {
        this.$emit('update:options', null);
      }
    },
  },

  computed: {
    label() {
      return `Question ${this.num}`;
    },
    index() {
      return this.num - 1;
    },
    hasOptions() {
      return this.types.some((item) => item.type === this.type && item.options);
    },
    // options() {
    //   return this.field.options;
    // },

    computedType: {
      get() {
        return this.type;
      },
      set(type) {
        this.$emit('update:type', type);
      },
    },
    computedValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
    computedOptional: {
      get() {
        return this.optional;
      },
      set(bool) {
        this.$emit('update:optional', bool);
      },
    },
  },
};
</script>

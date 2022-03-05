<template>
  <v-dialog v-model="open" :max-width="maxWidth">
    <template #activator="{ on }">
      <v-btn text v-on="on">
        <v-icon v-text="icon"></v-icon>
        <span>Add {{ buttonLabel }}</span>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span>Add {{ buttonLabel }}</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon v-text="closeIcon"></v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <slot name="card.text.top" />
        <v-form ref="form" v-model="valid">
          <async-text-input
            v-for="(item, idx) in items"
            @input="onInput($event, idx)"
            :rules="item.rules ? item.rules : []"
            :filled="false"
            :label="item.label"
            :value="item.value"
            :key="idx"
            :endpoint="item.endpoint"
            :validate="item.validate ? item.validate : false"
          ></async-text-input>
        </v-form>
        <slot name="card.text.bottom" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text :disabled="!valid" @click="$emit('save')">
          <span>Save</span>
        </v-btn>
        <v-btn text @click="$emit('reset')">
          <span>Cancel</span>
        </v-btn>
      </v-card-actions>
    </v-card>
    <slot />
  </v-dialog>
</template>

<script>
import capitalize from 'lodash/capitalize';
import pluralize from 'pluralize';
import isAlphanumeric from '~/utilities/isAlphanumeric.js';
import AsyncTextInput from '~/components/inputs/AsyncTextInput.vue';

export default {
  name: 'ItemDialog',

  components: { AsyncTextInput },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    items: {
      type: [Array, Object],
      default: () => [],
    },
    name: {
      type: String,
      default: 'Item',
    },
  },

  data() {
    return {
      icon: 'mdi-plus',
      closeIcon: 'mdi-close',
      maxWidth: 500,
      valid: false,
    };
  },

  methods: {
    close() {
      this.open = false;
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
      this.$emit('reset');
    },

    onInput(value, idx) {
      this.$emit('update', { value, idx });
    },
  },

  computed: {
    open: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    capitalizedName() {
      return capitalize(this.name);
    },

    buttonLabel() {
      return pluralize.singular(this.capitalizedName);
    },
  },
};
</script>

<template>
  <div class="v__checkboxes">
    <v-checkbox
      v-for="(item, idx) in items"
      multiple
      v-model="computedValue"
      hide-details
      :readonly="readonly"
      :label="item"
      :value="item"
      :key="idx"
      :error="hasErrors"
    ></v-checkbox>
    <div class="v-messages theme--light error--text" role="alert">
      <div class="v-messages__wrapper" v-if="hasErrors">
        <div class="v-messages__message">{{ errorMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import isBoolean from 'lodash/isBoolean';
export default {
  name: 'CheckboxContainer',

  props: {
    value: {
      type: [String, Number, Array],
    },
    items: {
      type: [Object, Array],
    },
    rules: {
      type: Array,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      errorMessage: '',
      hasErrors: false,
      internalValue: [],
    };
  },

  created() {
    if (this.rules && Array.isArray(this.rules)) {
      if (this.rules.some((rule) => !(rule instanceof Function))) {
        throw new Error('Rules must be an array composed of functions');
      } else {
        this.validate(this.value);
        this.$watch('internalValue', this.validate, { deep: true });
      }
    }
  },

  methods: {
    validate(val) {
      const rules = this.rules;
      for (let i = 0; i <= rules.length; i++) {
        const rule = rules[i];
        if (rule instanceof Function) {
          const result = rule(val);
          if (!isBoolean(result)) {
            this.hasErrors = true;
            this.errorMessage = result;
            break;
          } else {
            this.hasErrors = false;
            this.errorMessage = '';
          }
        }
      }
    },
  },

  computed: {
    computedValue: {
      get() {
        return this.value ? this.value : this.internalValue;
      },
      set(val) {
        console.log('computed', val);
        this.internalValue = val;
        this.$emit('input', val);
        this.$emit('change', val);
      },
    },
  },
};
</script>

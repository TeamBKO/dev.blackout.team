<script>
import debounce from 'lodash/debounce';
export default {
  name: 'CreateUserDialogInput',
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    isShown: {
      type: Boolean,
      default: false,
    },
    async: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
    },
    rules: {
      type: Array,
      default: () => [],
    },
    name: {
      type: [String, Boolean],
    },
    type: {
      type: String,
      default: 'input',
    },
    delay: {
      type: Number,
      default: 500,
    },

    filled: {
      type: Boolean,
      default: true,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    prefix: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      innerValue: this.value,
      originalValue: this.value,
      inputCheck: null,
      errorMessages: '',
      previous: '',
      showPassword: false,
    };
  },

  watch: {
    isShown(v) {
      if (!v) {
        this.errorMessages = '';
        this.innerValue = '';
        this.previous = '';
      }
    },

    innerValue(newVal, oldVal) {
      this.previous = oldVal;
      if (this.async) {
        if (newVal) {
          if (newVal === this.originalValue && this.originalValue) {
            this.errorMessages = '';
            return;
          }
          this.inputCheck(newVal);
          /** check to see if the new value is not true (empty),
           * and if the old value is true, it was dirty */
        } else if (!newVal && this.previous) {
          this.errorMessages = `${this.upperCaseLabel} is required.`;
        }
      }
    },

    value(v) {
      if (v !== this.innerValue) {
        this.innerValue = v;
      }

      if (!this.originalValue) {
        this.originalValue = v;
      }
    },
  },

  created() {
    if (this.async && this.name) {
      const url = `/validate/${this.name}`;
      this.inputCheck = debounce(async (v) => {
        const params = { value: v };
        try {
          const result = await this.$axios.get(url, { params });
          this.errorMessages = '';
        } catch (err) {
          this.errorMessages = err.response.data[0].msg
            ? err.response.data[0].msg
            : err.response.data;
        }
      }, this.delay);
    }
  },

  render(h) {
    const { value, route, async, rules, ...props } = this.$props;

    const on = { input: (v) => (this.computedValue = v) };

    if (!async && rules) {
      Object.assign(props, { rules });
    } else if (async) {
      Object.assign(props, { 'error-messages': this.errorMessages });
    }

    if (props.type === 'password') {
      Object.assign(props, {
        'append-icon': this.showPassword ? 'mdi-eye' : 'mdi-eye-off',
        type: this.showPassword ? 'text' : 'password',
      });

      Object.assign(on, {
        'click:append': (e) => (this.showPassword = !this.showPassword),
      });
    }

    Object.assign(props, { value: this.computedValue });

    return h('v-text-field', {
      on,
      props,
    });
  },

  computed: {
    normalizedLabel() {
      return this.label.toLowerCase();
    },
    upperCaseLabel() {
      return this.label.charAt(0).toUpperCase() + this.label.slice(1);
    },
    computedValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.innerValue = value;
        this.$emit('input', value);
      },
    },
  },
};
</script>

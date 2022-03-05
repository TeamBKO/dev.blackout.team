<script>
import debounce from 'lodash/debounce';
import VIcon from 'vuetify/lib';
export default {
  name: 'AsyncTextInput',
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    isShown: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
    },
    required: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: () => [],
    },
    endpoint: {
      type: [Object, String],
    },
    type: {
      type: String,
      default: 'text',
    },
    password: {
      type: Boolean,
      default: false,
    },
    validate: {
      type: Boolean,
      default: true,
    },
    delay: {
      type: Number,
      default: 500,
    },
    singleLine: {
      type: Boolean,
    },
    counter: {
      type: Boolean,
      default: false,
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
    readonly: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      innerValue: this.value,
      originalValue: this.value,
      errorMessages: '',
      previous: '',
      showPassword: false,

      isDirty: false,
      isTyping: false,
      isSending: false,
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

    isTyping(v) {
      this.$emit('update:typing', v);
      this.$emit('onTyping', v);
    },

    isSending(v) {
      this.$emit('update:sending', v);
      this.$emit('onSending', v);
    },

    isDirty(v) {
      this.$emit('update:dirty', v);
      this.$emit('onDirty', v);
    },

    errorMessages(v) {
      if (v) {
        this.$emit('update:valid', false);
      } else {
        this.$emit('update:valid', true);
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

  methods: {
    async inputCheck(v) {
      const params = { value: v };
      try {
        const result = await this.$axios.get(this.endpoint, { params });
        this.errorMessages = '';
      } catch (err) {
        this.errorMessages = err.response.data[0].msg
          ? err.response.data[0].msg
          : err.response.data;
      } finally {
        this.isSending = false;
      }
    },
  },

  mounted() {
    const isTyping = () => {
      this.isTyping = false;
    };

    const onInputCheck = debounce(this.inputCheck, this.delay);
    const debounceIsTyping = debounce(isTyping, 300);

    if (this.required && !this.value) {
      this.errorMessages = `${this.upperCaseLabel} is required.`;
    }

    if (this.validate) {
      this.$watch('innerValue', function (nv, ov) {
        this.isTyping = true;

        debounceIsTyping();
        if (nv === this.originalValue) {
          this.isDirty = false;
          this.errorMessages = '';
          return;
        } else {
          this.isDirty = true;
        }
        this.isSending = true;
        onInputCheck(nv);
      });

      return;
    }

    this.$watch('innerValue', function (nv, ov) {
      this.isTyping = true;
      debounceIsTyping();
      if (nv === this.originalValue) {
        this.isDirty = false;
        this.errorMessages = '';
        return;
      } else {
        this.isDirty = true;
      }
    });
  },

  render(h) {
    const { value, rules, ...props } = this.$props;

    const on = { input: (v) => (this.computedValue = v) };

    const nativeOn = { mousedown: (evt) => evt.stopPropagation() };

    if (!this.validate && rules) {
      Object.assign(props, { rules });
    } else if (this.validate) {
      Object.assign(props, { 'error-messages': this.errorMessages });
    }

    if (props.password || this.type === 'password') {
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
      nativeOn,
      props,
      attrs: this.$attrs,
    });
  },

  computed: {
    normalizedLabel() {
      return this.label ? this.label.toLowerCase() : '';
    },
    upperCaseLabel() {
      return this.label
        ? this.label.charAt(0).toUpperCase() + this.label.slice(1)
        : '';
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

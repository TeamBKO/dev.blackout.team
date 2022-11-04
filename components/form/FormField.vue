<script>
import cosmetic from '~/mixins/props/cosmetic.js';
import general from '~/mixins/props/general.js';
import select from '~/mixins/props/select.js';

import { hasSelected } from '~/utilities/validators.js';

import {
  VTextField,
  VTextarea,
  VSelect,
  VRadioGroup,
  VRadio,
  VCheckbox,
  VMenu,
  VDatePicker,
  VBtn,
} from 'vuetify/lib';

import CheckboxGroup from './FormCheckboxes.vue';

const generalProps = [
  'autofocus',
  'clearIcon',
  'counter',
  'counterValue',
  'loaderHeight',
  'loading',
  'messages',
  'persistentHint',
  'placeholder',
  'prefix',
  'prependIcon',
  'prependInnerIcon',
  'readonly',
  'reverse',
  'rules',
  'singleLine',
  'soloInverted',
  'success',
  'successMessages',
  'suffix',
  'validateOnBlur',
  'disabled',
  'error',
  'errorCount',
  'value',
  'fullWidth',
  'height',
  'hideDetails',
  'hint',
  'id',
  'label',
];

const cosmeticProps = [
  'appendIcon',
  'appendOuterIcon',
  'backgroundColor',
  'color',
  'dark',
  'dense',
  'filled',
  'flat',
  'light',
  'rounded',
  'shaped',
  'solo',
  'outlined',
];

const selectProps = [
  'eager',
  'itemColor',
  'itemDisabled',
  'itemText',
  'itemValue',
  'items',
  'multiple',
];

export default {
  name: 'FormField',

  components: {
    VTextField,
    VTextarea,
    VSelect,
    VRadioGroup,
    VRadio,
    VMenu,
    VBtn,
    VDatePicker,
    VCheckbox,
    CheckboxGroup,
  },

  mixins: [general, select, cosmetic],

  props: {
    value: {
      type: [String, Array, Number, Boolean],
    },
    field: {
      type: Object,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: () => [],
    },
    edit: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      internalValue: null,
      errors: '',
      generalProps,
      cosmeticProps,
      selectProps,

      activePicker: null,
      birthDayMenu: false,
      showPassword: false,

      isRequired: (v) => !!v || 'Field is required.',
    };
  },

  created() {
    if (this.field.type === 'checkbox') this.internalValue = [];
    else this.internalValue = '';
  },

  watch: {
    value(newVal, oldVal) {
      if (Array.isArray(newVal) && !newVal.length && this.type === 'checkbox') {
        this.errors = 'Field is required. Must select at least one.';
      } else {
        this.errors = '';
      }
    },
    birthDayMenu(val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'));
    },
  },

  methods: {
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');

      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    },

    onInput(v) {
      this.computedValue = v;
    },

    generateProps() {
      const textfield = [...this.cosmeticProps, ...this.generalProps];
      const selection = [...textfield, ...this.selectProps];
      const internalProps = { ...this.$props };
      return Object.entries(internalProps).reduce((output, [key, value]) => {
        const propsToCompareAgainst = this.hasOptions ? selection : textfield;
        if (propsToCompareAgainst.includes(key) && typeof value !== undefined) {
          Object.assign(output, { [key]: value });
        }
        return output;
      }, {});
    },

    genCheckboxGroup(_props) {
      const { items, ...props } = _props;

      const checkboxProps = {
        value: this.computedValue,
        items: this.field.options,
        rules: this.isOptional ? [] : [hasSelected(1)],
        readonly: this.readonly,
      };

      return this.$createElement('checkbox-group', {
        props: checkboxProps,
        on: { change: this.onInput },
      });
    },

    // genCheckboxes(_props) {
    //   const { items, ...props } = _props;

    //   const checkbox = (option) => {
    //     const checkboxProps = Object.assign({}, props, {
    //       inputValue: this.computedValue,
    //       value: option,
    //       multiple: this.multiple ? this.multiple : true,
    //       hideDetails: this.hideDetails ? this.hideDetails : true,
    //       errorMessages: this.errors,
    //       label: option,
    //     });

    //     const on = { change: (v) => this.$emit('input', v) };

    //     return this.$createElement('v-checkbox', {
    //       on,
    //       props: checkboxProps,
    //       class: 'my-0 py-2',
    //     });
    //   };

    //   const errorDiv = this.$createElement('div', { class: ['v-errors'] }, [
    //     this.$createElement('p', {}, [this.errors]),
    //   ]);

    //   return this.$createElement('div', { class: 'checkbox-group' }, [
    //     this.field.options.map(checkbox),
    //     errorDiv,
    //   ]);
    // },

    genBirthday(_props) {
      const menuProps = {
        'offset-y': true,
        'min-width': 'auto',
        transition: 'scale-transition',
        closeOnContentClick: false,
        value: this.birthDayMenu,
      };

      const menuEvents = {
        input: (v) => (this.birthDayMenu = v),
      };

      const textFieldProps = {
        value: this.computedValue,
        filled: this.$props.filled,
        label: this.field.label,
        readonly: true,
      };

      const menuScopedSlots = {
        activator: ({ on, attrs }) => {
          return this.$createElement('v-text-field', {
            props: textFieldProps,
            on: on,
            attrs,
          });
        },
      };

      const datePickerProps = {
        activePicker: this.activePicker,
        value: this.computedValue,
        min: '1950-01-01',
        max: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
      };

      const datePickerEvents = {
        'update:active-picker': (val) => (this.activePicker = val),
        change: (date) => {
          this.computedValue = date;
          this.$refs.birthday.save(date);
        },
      };

      return this.$createElement(
        'v-menu',
        {
          props: menuProps,
          scopedSlots: menuScopedSlots,
          on: menuEvents,
          ref: 'birthday',
        },
        [
          this.$createElement('v-date-picker', {
            props: datePickerProps,
            on: datePickerEvents,
          }),
        ]
      );
    },

    genRadios(_props) {
      const { items, label, ...props } = _props;
      const radioGroupProps = Object.assign({}, props, {
        rules: this.isOptional ? [] : [this.isRequired],
        value: this.computedValue,
        readonly: this.readonly,
      });

      if (this.rules && this.rules.length) {
        radioGroupsProps.rules = radioGroupProps.rules.concat(this.rules);
      }

      const radio = (option) => {
        const radioProps = { label: option, value: option };
        return this.$createElement('v-radio', { props: radioProps }, []);
      };

      const on = { change: (v) => this.$emit('input', v) };

      const componentOptions = {
        on,
        props: radioGroupProps,
      };

      return this.$createElement(
        'v-radio-group',
        componentOptions,
        this.field.options.map(radio)
      );
    },

    genSelect(_props) {
      const props = Object.assign({}, _props, {
        rules: this.isOptional ? [] : [this.isRequired],
        value: this.computedValue,
        items: this.hasOptions ? this.field.options : [],
        readonly: this.readonly,
      });

      if (this.field.label) {
        props.label = this.field.label;
      }

      if (this.rules && this.rules.length) {
        props.rules = props.rules.concat(this.rules);
      }

      const on = { input: (v) => this.$emit('input', v) };

      return this.$createElement('v-select', { props, on });
    },

    genInputField(input, isPassword = false, _props) {
      const props = Object.assign({}, _props, {
        rules: this.isOptional ? [] : [this.isRequired],
        value: this.computedValue,
        readonly: this.readonly,
      });

      if (this.field.label) {
        props.label = this.field.label;
      }

      if (this.rules && this.rules.length) {
        props.rules = props.rules.concat(this.rules);
      }

      const on = { input: (v) => this.$emit('input', v) };

      if (this.field.subType === 'password' || isPassword) {
        Object.assign(props, {
          type: this.showPassword ? 'text' : 'password',
          appendIcon: this.showPassword ? 'mdi-eye' : 'mdi-eye-off',
          label: this.field.label,
        });

        Object.assign(on, {
          'click:append': () => (this.showPassword = !this.showPassword),
        });
      }

      const options = { props, on };

      if (this.edit) {
        Object.assign(options.props, {
          appendOuterIcon: 'mdi-square-edit-outline',
        });
        Object.assign(options.on, {
          'click:append-outer': () => this.$emit('onEdit'),
        });
      }

      return this.$createElement(input, options, []);
    },

    genField(props) {
      switch (this.field.type) {
        case 'multiple':
          return this.genRadios(props);
          break;
        case 'checkbox':
          return this.genCheckboxGroup(props);
          break;
        case 'select':
          return this.genSelect(props);
          break;
        case 'textarea':
          return this.genInputField('v-textarea', false, props);
          break;
        case 'password':
          return this.genInputField('v-text-field', true, props);
          break;
        case 'birthday':
          return this.genBirthday();
          break;
        default:
          return this.genInputField('v-text-field', false, props);
      }
    },
  },

  computed: {
    computedValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.internalValue = value;
        this.$emit('input', value);
        this.$emit('change', value);
      },
    },

    hasOptions() {
      return this.field.options ? !!this.field.options.length : false;
    },

    isOptional() {
      return this.field.optional ? this.field.optional : true;
    },
  },

  render(h) {
    return this.genField(this.generateProps());
  },
};
</script>

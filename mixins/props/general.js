export default {
  props: {
    autofocus: { type: Boolean },

    clearIcon: { type: String },

    counter: { type: [String, Boolean, Number] },
    counterValue: { type: Function },

    loaderHeight: { type: [String, Number] },
    loading: { type: [String, Boolean] },
    messages: { type: [String, Array] },

    persistentHint: { type: Boolean },
    placeholder: { type: String },
    prefix: { type: String },
    prependIcon: { type: String },
    prependInnerIcon: { type: String },
    readonly: { type: Boolean },
    reverse: { type: Boolean },

    rules: { type: Array },

    singleLine: { type: Boolean },

    soloInverted: { type: Boolean },
    success: { type: [String, Array] },
    successMessages: { type: [String, Array] },
    suffix: { type: String },
    validateOnBlur: { type: Boolean },
    disabled: { type: Boolean, default: false },
    error: { type: Boolean },
    errorCount: { type: [String, Number] },
    value: { type: [String, Boolean, Function, Array, Object, Number] },
    fullWidth: { type: Boolean },
    height: { type: [String, Number] },
    hideDetails: { type: [String, Boolean] },
    hint: { type: String },
    id: { type: String },
    label: { type: String },
  },
};

export default {
  props: {
    eager: { type: Boolean },
    itemColor: { type: String },
    itemDisabled: { type: [String, Array, Function] },
    itemText: { type: [String, Array, Function] },
    itemValue: { type: [String, Array, Function] },
    items: { type: Array },
    multiple: { type: Boolean },
  },
};

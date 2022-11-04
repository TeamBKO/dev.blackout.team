<template>
  <v-dialog v-model="openDialog" persistent :max-width="width" :dark="dark">
    <template #activator="{ on }" v-if="$scopedSlots.activator">
      <slot name="activator" v-bind="{ on, length }" />
    </template>
    <v-card>
      <v-card-title>{{ computedTitle }}</v-card-title>
      <v-card-text>
        <p>Do you wish to proceed and delete the selected item(s)?</p>
        <p><strong>This action is irrevesible.</strong></p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="primary" @click="onDelete">OK</v-btn>
        <v-btn text @click="onCancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DeleteDialog',

  props: {
    length: {
      type: Number,
    },
    value: {
      type: Boolean,
      default: false,
    },
    width: {
      type: [Number, String],
      default: 500,
    },
    single: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    mini: {
      type: Boolean,
      default: false,
    },
    dark: {
      type: Boolean,
      default: false,
    },
    itemText: {
      type: String,
      default: 'name',
    },
    itemValue: {
      type: String,
      default: 'id',
    },
    title: {
      type: String,
      default: '',
    },
    item: {
      type: Object,
      default: () => {},
    },
  },

  watch: {
    // openDialog(v) {
    //   if (!v) {
    //     if (this.internalItem) {
    //       this.internalItem = null;
    //     }
    //   }
    // },

    item: {
      immediate: true,
      handler: function (item) {
        this.internalItem = item;
      },
    },
  },

  data() {
    return {
      open: false,
      icon: 'mdi-trash-can',
      internalItem: null,
    };
  },

  methods: {
    showDialog(item) {
      this.internalItem = item;
      this.open = true;
    },
    onDelete() {
      this.$emit(
        'delete',
        this.internalItem ? this.internalItem[this.itemValue] : null
      );
      this.openDialog = false;
    },
    onCancel() {
      this.$emit('cancel');
      this.openDialog = false;
    },
  },

  computed: {
    numOfItemsMarkedForDeletion() {
      return this.internalItem ? 1 : this.length;
    },

    computedTitle() {
      return this.title
        ? this.title
        : this.internalItem
        ? `Delete ${this.internalItem[this.itemText]}?`
        : `Delete ${this.numOfItemsMarkedForDeletion} item(s)`;
    },

    openDialog: {
      get() {
        return this.value || this.open;
      },
      set(value) {
        this.open = value;
        this.$emit('input', value);
      },
    },
  },
};
</script>

<template>
  <v-dialog v-model="openDialog" persistent :max-width="maxWidth">
    <template #activator="{ on }">
      <v-btn
        class="v-tab"
        text
        v-on="on"
        :disabled="disabled || !length"
        v-if="!mini"
      >
        <v-icon v-text="icon"></v-icon>
        <span>Delete {{ length }}</span>
      </v-btn>
      <v-btn
        class="v-tab"
        text
        v-on="on"
        :disabled="disabled || !length"
        v-else
      >
        <v-tooltip bottom>
          <template #activator="props">
            <v-icon v-text="icon" v-on="props.on" left></v-icon>
          </template>
          Delete
        </v-tooltip>
        <span>{{ length }}</span>
      </v-btn>
    </template>
    <v-card>
      <v-card-title
        >Delete {{ numOfItemsMarkedForDeletion }} item(s)</v-card-title
      >
      <v-card-text>
        <p>Do you wish to proceed and delete the selected item(s)?</p>
        <p><strong>This action is irrevesible.</strong></p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="primary" @click="deleteAll">OK</v-btn>
        <v-btn text @click="$emit('cancel')">Cancel</v-btn>
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
  },

  data() {
    return {
      maxWidth: 300,

      icon: 'mdi-trash-can',
    };
  },

  methods: {
    deleteAll() {
      this.$emit('deleteAll');
      this.$emit('input', false);
    },
  },

  computed: {
    numOfItemsMarkedForDeletion() {
      return this.single ? 1 : this.length;
    },

    canDelete() {
      return (
        this.$auth.loggedIn &&
        this.$auth.hasScope([this.$permissions.DELETE_ALL_MEDIA])
      );
    },

    openDialog: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>

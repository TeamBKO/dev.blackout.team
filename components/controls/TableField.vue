<template>
  <v-menu
    v-model="open"
    :min-width="minWidth"
    :class="rootClasses"
    :origin="origin"
    :transition="transition"
    :close-on-content-click="closeOnContentClick"
    :retain-focus="retainFocus"
    :no-click-animation="noClickAnimation"
  >
    <template #activator="{ on }">
      <span class="v--table-item-pointer" v-on="on">{{ displayValue }}</span>
    </template>
    <v-card :min-width="minWidth">
      <v-card-text @click.stop>
        <v-form v-model="valid">
          <v-select
            v-model="computedValue"
            v-if="items && items.length && !$scopedSlots.select"
            :items="items"
            :item-text="itemText"
            :item-value="itemValue"
          >
          </v-select>
          <slot
            name="select"
            v-bind="{ items, itemText, itemValue, value: computedValue }"
            v-else-if="$scopedSlots.select"
          />
          <v-text-field
            v-model="computedValue"
            v-else
            :loading="isSending"
            :error-messages="errorMessage"
            :label="label"
            :single-line="singleLine"
            :counter="counter"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text :disabled="isTyping" @click="reset">
          <span>Cancel</span>
        </v-btn>
        <v-btn text color="primary" :disabled="isDisabled" @click="save">
          <span>Save</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import debounce from 'lodash/debounce';
export default {
  name: 'TableDialogMenu',

  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    endpoint: {
      type: String,
    },
    items: {
      type: Array,
      default: () => [],
    },
    itemText: {
      type: String,
      default: 'text',
    },
    itemValue: {
      type: String,
      default: 'id',
    },
    label: {
      type: String,
      default: 'Edit',
    },
    singleLine: {
      type: Boolean,
      default: true,
    },
    large: {
      type: Boolean,
      default: true,
    },
    counter: {
      type: Boolean,
      default: true,
    },
    async: {
      type: Boolean,
      default: true,
    },
    validate: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      minWidth: '138px',
      origin: 'right top',
      transition: 'scroll-x-reverse-transition',
      closeOnContentClick: true,
      retainFocus: true,
      open: false,
      noClickAnimation: true,

      isSending: false,
      isTyping: false,
      isDirty: false,
      valid: false,

      originalValue: this.value,
      innerValue: '',
      errorMessage: '',
      inputCheck: null,
    };
  },

  created() {
    const onTypingEnd = () => {
      this.isTyping = false;
    };

    const disableOnTyping = debounce(onTypingEnd, 300);

    const inputCheck = async (v) => {
      const params = { value: v };
      const url = `/validate/${this.endpoint}`;
      this.isSending = true;
      try {
        const result = await this.$axios.get(url, { params });
        this.errorMessage = '';
      } catch (err) {
        this.errorMessage = err.response.data[0].msg
          ? err.response.data[0].msg
          : err.response.data;
      } finally {
        this.isSending = false;
      }
    };

    if (this.validate && !this.items.length) {
      const checkInput = debounce(inputCheck, 500);

      this.$watch('innerValue', function (v) {
        this.isTyping = true;
        disableOnTyping();
        if (v === this.originalValue) {
          this.isDirty = false;
          this.errorMessage = [];
          return;
        } else {
          this.isDirty = true;
        }
        if (this.open) {
          checkInput(v);
        }
      });

      return;
    }

    if (!this.items.length) {
      this.$watch('innerValue', function (v) {
        this.isTyping = true;
        disableOnTyping();
        if (v === this.originalValue) {
          this.isDirty = false;
          this.errorMessage = [];
          return;
        } else {
          this.isDirty = true;
        }
      });

      return;
    }

    this.$watch('innerValue', function (v) {
      if (v === this.originalValue) {
        this.isDirty = false;
      } else {
        this.isDirty = true;
      }
    });
  },

  methods: {
    save() {
      this.$emit('save', this.innerValue);
      this.open = false;
    },

    reset() {
      this.open = false;
      requestAnimationFrame(() =>
        this.$nextTick(() => {
          this.computedValue = this.value;
          this.errorMessage = [];
          this.isDirty = false;
        })
      );
    },
  },

  watch: {
    open(v) {
      if (!v) this.reset();
    },

    value: {
      immediate: true,
      handler: function (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.innerValue = newVal;
        }
        this.originalValue = oldVal ? oldVal : newVal;
      },
    },
  },
  computed: {
    rootClasses() {
      return [
        'v-edit-dialog',
        {
          'v-table-dialog-sm-and-down': this.$vuetify.breakpoint.smAndDown,
        },
      ];
    },

    displayValue() {
      if (this.items && this.items.length) {
        if (this.itemText !== 'text' && this.itemValue !== 'value') {
          const v = this.items.find(
            (item) => item[this.itemValue] === this.innerValue
          );
          if (v) return v[this.itemText];
        }
      }
      return this.innerValue;
    },

    computedValue: {
      get() {
        return this.innerValue;
      },
      set(value) {
        this.innerValue = value;
      },
    },

    isDisabled() {
      if (!this.items.length) {
        return !this.valid || this.isSending || this.isTyping || !this.isDirty;
      } else {
        return !this.isDirty;
      }
    },
  },
};
</script>

<style>
.v-table-dialog-sm-and-down {
  left: 0;
}

.v--table-item-pointer {
  cursor: pointer;
}
</style>

<template>
  <v-edit-dialog
    :large="large"
    @save="save"
    @cancel="reset"
    @close="reset"
    ref="dialog"
  >
    {{ computedValue }}
    <template v-slot:input>
      <v-text-field
        v-model="computedValue"
        :error-messages="errorMessage"
        :label="label"
        :single-line="singleLine"
        :counter="counter"
      ></v-text-field>
    </template>
  </v-edit-dialog>
</template>

<script>
import debounce from 'lodash/debounce';

export default {
  name: 'TableInput',
  props: {
    value: {
      type: String,
      default: '',
    },
    id: {
      type: [Number, String],
    },
    endpoint: {
      type: [Object, String],
    },
    name: {
      type: String,
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
  },
  data() {
    return {
      originalValue: this.value,
      innerValue: '',
      errorMessage: '',
      valid: false,
    };
  },

  created() {
    const url = `/validate/${this.endpoint}`;

    const inputCheck = async (v) => {
      const params = { value: v };
      try {
        const result = await this.$axios.get(url, { params });
        this.errorMessage = '';
      } catch (err) {
        this.errorMessage = err.response.data[0].msg
          ? err.response.data[0].msg
          : err.response.data;
      }
    };

    const checkInput = debounce(inputCheck, 500);

    this.$watch('innerValue', function (v) {
      if (v) {
        if (v === this.originalValue) {
          this.errorMessage = [];
          return;
        }
        checkInput(v);
      }
    });
  },

  methods: {
    save() {
      this.$emit('save', {
        id: this.id,
        name: this.name,
        value: this.innerValue,
      });
    },

    reset() {
      this.computedValue = this.originalValue;
    },
  },

  watch: {
    // innerValue: function (v) {
    //   if (v) {
    //     if (v === this.originalValue) {
    //       this.errorMessage = [];
    //       return;
    //     }
    //     this.inputCheck(v);
    //   }
    // },

    value(v) {
      if (v !== this.innerValue) {
        this.innerValue = v;
      }

      if (!this.originalValue) {
        this.originalValue = v;
      }
    },
  },
  computed: {
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

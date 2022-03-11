<template>
  <v-edit-dialog
    large
    @save="$emit('save', internalValue)"
    @cancel="reset"
    @close="reset"
    @open="getForms"
  >
    {{ item.name }}
    <template #input>
      <roster-form-select
        v-model="computedValue"
        :items.sync="items"
      ></roster-form-select>
    </template>
  </v-edit-dialog>
</template>

<script>
import FORMS from '~/constants/forms/public.js';
import RosterFormSelect from './RosterFormSelect';
export default {
  name: 'RosterTableField',
  components: { RosterFormSelect },

  props: {
    value: {
      type: [String, Number, Object],
    },
    item: {
      type: [Object, Number],
      default: () => {},
    },
  },

  data() {
    return {
      items: [],
      previousValue: 0,
      internalValue: 0,
    };
  },

  watch: {
    value: {
      immediate: true,
      handler: function (newValue, oldValue) {
        if (newValue) {
          if (newValue !== oldValue) {
            this.internalValue = newValue;
          }

          if (!oldValue) {
            this.previousValue = newValue;
          }
        }
      },
    },
  },

  methods: {
    async getForms() {
      if (!this.forms.length) {
        const { results } = await this.$store.dispatch(FORMS.actions.FETCH, {
          url: '/forms',
          loading: true,
        });

        if (this.item) {
          this.computedInternalForms = [this.item, ...results];
        } else {
          this.computedInternalForms = results;
        }
      } else {
        if (this.item) {
          this.computedInternalForms = [this.item, ...this.forms];
        } else {
          this.computedInternalForms = this.forms;
        }
      }
    },

    reset() {
      this.internalValue = this.previousValue;
    },
  },

  computed: {
    forms() {
      return this.$store.getters[FORMS.getters.ITEMS];
    },

    computedInternalForms: {
      get() {
        return this.items;
      },
      set(arr) {
        this.items = arr.map(({ id, name }) => ({ id, name }));
      },
    },

    computedValue: {
      get() {
        return this.internalValue;
      },
      set(value) {
        this.internalValue = value;
      },
    },
  },
};
</script>

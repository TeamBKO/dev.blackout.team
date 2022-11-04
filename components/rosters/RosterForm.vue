<template>
  <v-container v-if="fields">
    <v-row v-if="!readonly">
      <v-col cols="12">
        <p v-text="form.description"></p>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <v-text-field
          v-model="form.roster.name"
          label="Roster"
          :readonly="readonly"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row v-for="(field, idx) in form.fields" :key="idx">
      <v-col cols="12">
        <div class="text--subtitle-1 font-weight-medium">
          <span>Question {{ idx + 1 }}</span>
          <span class="required" v-if="!field.optional">*</span>
        </div>
        <p class="text--white">{{ field.value }}</p>
        <form-field
          :id="`question_${idx + 1}`"
          :field="field"
          :filled="true"
          :readonly="readonly"
          v-model="fields[`${field.type}_${field.id}`]"
        ></form-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <slot name="recaptcha" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FORM from '~/constants/forms/public.js';
import isNull from 'lodash/isNull';
import isObject from 'lodash/isObject';
import FormField from '~/components/form/FormField.vue';

export default {
  name: 'RosterForm',

  components: {
    FormField,
  },

  props: {
    value: {
      type: Array,
      default: () => [],
    },
    form: {
      type: Object,
      default: () => {},
      validator: (v) => isObject(v) || isNull(v),
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
    },
    open: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      fields: null,
      description: null,
      statusOptions: ['pending', 'approved', 'rejected'],

      isRequired: (v) => !!v || `Field is required.`,
    };
  },

  methods: {
    setContent(content) {
      if (content) {
        const fields = {};

        content.fields.forEach((field) => {
          const value = field.answer
            ? field.answer.value
            : field.type === 'checkbox'
            ? []
            : '';

          Object.assign(fields, {
            [`${field.type}_${field.id}`]: value,
          });
        });

        this.fields = fields;
        this.computedStatus = content.status;
      }
    },
  },

  watch: {
    form: {
      immediate: true,
      deep: true,
      handler: function (v) {
        if (v) this.setContent(v);
        else this.fields = null;
      },
    },

    toSave: {
      deep: true,
      handler: function (v) {
        this.$emit('input', this.toSave);
      },
    },
  },

  computed: {
    toSave() {
      return this.fields
        ? Object.entries(this.fields).map(([key, value]) => {
            // const id = parseInt(key.match(/\d{1,}/)[0], 10);
            const id = key.split('_')[1];
            return { id, value };
          })
        : [];
    },
  },
};
</script>

<style scoped>
.required {
  color: red;
}
</style>

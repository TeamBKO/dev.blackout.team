<template>
  <v-form v-model="isValid" ref="form">
    <v-container>
      <v-row>
        <v-col cols="12" md="12" sm="12">
          <v-text-field
            v-model="computedName"
            :rules="[
              isRequired('Name'),
              minLength('Name', 3),
              maxLength('Name', 50),
            ]"
            label="Name"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="12" sm="12">
          <v-textarea
            v-model="computedDescription"
            outlined
            label="Description"
            counter
          ></v-textarea>
        </v-col>
      </v-row>
      <draggable
        v-model="computedInternalFields"
        handle=".handle"
        group="fields"
        @start="drag = true"
        @end="onDragEnd"
      >
        <form-field-question
          v-for="(field, idx) in fields"
          v-model="field.value"
          :key="field.id ? field.id : field._key"
          :num="idx + 1"
          :field="field"
          :isDrag="drag"
          :type.sync="field.type"
          :useAsColumn.sync="field.use_as_column"
          :alias.sync="field.alias"
          :optional.sync="field.optional"
          :options.sync="field.options"
          @removeField="removeField"
          @removeOption="removeOption"
          @addOption="addOption"
        />
      </draggable>
      <v-row>
        <v-col cols="12">
          <form-add-field-button
            @click.native="addField"
          ></form-add-field-button>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import { nanoid } from 'nanoid';
import { isRequired, minLength, maxLength } from '~/utilities/validators';
import cloneDeep from 'lodash/cloneDeep';
import FormFieldQuestion from './FormFieldQuestion.vue';
import FormAddFieldButton from './FormAddFieldButton.vue';
import draggable from 'vuedraggable';
export default {
  name: 'FormTemplate',

  components: { FormAddFieldButton, FormFieldQuestion, draggable },

  props: {
    value: {
      type: Array,
      default: () => [],
      required: true,
    },
    open: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
  },

  data() {
    return {
      valid: false,
      drag: false,
      internalFields: [],
    };
  },

  watch: {
    // fields: {
    //   handler: function (arr) {
    //     if (this.drag) {
    //       console.log('changing');
    //       this.internalFields = arr;
    //     }
    //   },
    //   deep: true,
    //   immediate: true,
    // },
    // open(v) {
    //   if (!v) {
    //     this.internalFields = [];
    //   }
    // },
    open: {
      immediate: true,
      handler: function (v) {
        if (v) {
          this.internalFields = cloneDeep(this.fields);
        } else {
          this.internalFields = [];
        }
      },
    },
  },

  methods: {
    isRequired,
    minLength,
    maxLength,
    addField() {
      this.internalFields.push({
        _key: nanoid(),
        value: '',
        type: 'textfield',
        optional: true,
        use_as_column: false,
        alias: null,
        options: [],
      });
      this.fields = this.internalFields;
    },
    removeField(idx) {
      console.log('removing', idx);

      this.internalFields.splice(idx, 1);
      this.fields = this.internalFields;
    },
    addOption(idx) {
      const field = this.internalFields[idx];
      if (field) {
        field.options.push('');
        this.fields = this.internalFields;
      }
    },
    removeOption({ idx, option }) {
      const field = this.internalFields[idx];
      if (field) {
        field.options.splice(option, 1);
        this.fields = this.internalFields;
      }
    },

    onDragEnd() {
      this.$nextTick(() => setTimeout(() => (this.drag = false)), 50);
    },
  },

  computed: {
    computedName: {
      get() {
        return this.name;
      },
      set(value) {
        this.$emit('update:name', value);
      },
    },
    computedDescription: {
      get() {
        return this.description;
      },
      set(value) {
        this.$emit('update:description', value);
      },
    },

    computedInternalFields: {
      get() {
        return this.internalFields.map((field, idx) => {
          return { ...field, order: idx };
        });
      },
      set(value) {
        this.internalFields = value;
        this.fields = value;
      },
    },

    fields: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },

    isValid: {
      get() {
        return this.valid;
      },
      set(value) {
        this.valid = value;
        this.$emit('update:valid', value);
      },
    },
  },
};
</script>

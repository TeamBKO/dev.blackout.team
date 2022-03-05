<template>
  <v-dialog
    v-model="open"
    :max-width="maxWidth"
    :fullscreen="$vuetify.breakpoint.mobile"
  >
    <template #activator="{ on }">
      <v-btn text v-on="on">
        <v-icon left>mdi-plus</v-icon>
        <span>Add Form</span>
      </v-btn>
    </template>

    <v-card>
      <v-toolbar dark>
        <v-toolbar-title>
          <span>Create A Form</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="open = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-tabs fixed-tabs v-model="tab">
        <v-tab>
          <span>Form</span>
        </v-tab>
        <v-tab>
          <span>Preview</span>
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-card-text>
            <form-template
              v-model="fields"
              :name.sync="name"
              :description.sync="description"
              :valid.sync="valid"
              :open="open"
            ></form-template>
          </v-card-text>
        </v-tab-item>
        <v-tab-item>
          <v-card-text>
            <form-preview
              :name="name"
              :description="description"
              :fields="fields"
            ></form-preview>
          </v-card-text>
        </v-tab-item>
      </v-tabs-items>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text :disabled="isDisabled" @click="save">
          <span>Save</span>
        </v-btn>
        <v-btn text :disabled="isDisabled">
          <span>Reset</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import FORMS from '~/constants/forms/public.js';
import FormTemplate from './FormTemplate.vue';
import FormPreview from './FormPreview.vue';

import cloneDeep from 'lodash/cloneDeep';
import pickBy from 'lodash/pickBy';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';

export default {
  name: 'FormDialog',

  // props: {
  //   categories: {
  //     type: Array,
  //     default: () => [],
  //   },
  // },

  components: { FormTemplate, FormPreview },

  data() {
    return {
      name: '',
      description: '',

      valid: false,
      open: false,
      success: false,
      tab: null,
      maxWidth: '800px',
      fields: [],
      form: null,

      mode: 'add',
    };
  },

  watch: {
    open(v) {
      if (!v) {
        this.reset();
      }
    },
  },

  methods: {
    async save() {
      if (this.mode === 'add') {
        const data = Object.assign(
          {},
          {
            details: {
              name: this.name,
              description: this.description,
            },
          }
        );

        if (this.fields.length) {
          Object.assign(data, { fields: this.validFields });
        }

        this.$store.dispatch(FORMS.actions.ADD_ITEM, data);
      } else {
        const data = {};

        if (this.detailsToUpdate && Object.keys(this.detailsToUpdate).length) {
          Object.assign(data, { details: this.detailsToUpdate });
        }

        if (this.toAdd && this.toAdd.length) {
          Object.assign(data, { added: this.toAdd });
        }

        if (this.toUpdate && this.toUpdate.length) {
          Object.assign(data, { update: this.toUpdate });
        }

        if (this.toRemove.length) {
          Object.assign(data, { remove: this.toRemove });
        }
        try {
          // await this.editForm({ id: this.form.id, data });
          await this.$store.dispatch(FORMS.actions.UPDATE_ITEM, {
            id: this.form.id,
            payload: data,
          });
          this.open = false;
        } catch (err) {
          console.log(err);
        }
      }
    },

    reset() {
      this.form = null;
      this.tab = null;
      this.mode = 'add';
      this.clearForm();
    },

    clearForm() {
      this.fields = [];
      this.name = '';
      this.description = '';
    },

    async getForm(id) {
      try {
        const form = await this.$axios.$get(`/admin/forms/${id}`);
        return form;
      } catch (err) {
        return Promise.reject(err);
      }
    },

    async setEditableContent(id) {
      this.mode = 'edit';

      this.isSending = true;

      try {
        const form = await this.getForm(id);

        this.fields = form.fields;
        this.name = form.name;
        this.description = form.description;
        this.form = cloneDeep(form);
        this.open = true;
      } catch (err) {
        console.log(err);
      } finally {
        this.isSending = false;
      }
    },
  },

  computed: {
    validFields() {
      return this.fields.reduce((arr, field, idx) => {
        if (field.value) {
          const { options, _key, ...item } = field;
          const validOptions =
            options && options.length ? options.filter((o) => !!o) : null;
          arr.push({ ...item, order: idx, options: validOptions });
        }
        return arr;
      }, []);
    },

    formProperties() {
      return {
        name: this.name,
        description: this.description,
      };
    },

    isDisabled() {
      return this.tab > 0 || !this.valid;
    },

    toAdd() {
      return this.form && this.fields && this.fields.length
        ? this.fields.reduce((arr, field) => {
            const idx = this.form.fields.findIndex((f) => f.id === field.id);
            if (idx === -1 && field.value.length) {
              const { options, cache, ...content } = field;

              const validOptions =
                options && options.length
                  ? options.filter((o) => !!o)
                  : options;

              arr.push({ ...content, options: validOptions });
            }
            return arr;
          }, [])
        : [];
    },

    detailsToUpdate() {
      const form = pick(this.form, ['name', 'description']);
      const diff = pickBy(
        this.formProperties,
        (value, key) => !isEqual(form[key], value)
      );
      return Object.keys(diff).length ? diff : null;
    },

    toUpdate() {
      return this.form && this.fields
        ? this.form.fields.reduce((arr, f) => {
            const field = pick(
              this.fields.find(
                (fs) => fs.hasOwnProperty('id') && fs.id === f.id
              ),
              ['id', 'value', 'optional', 'options', 'type', 'order']
            );

            if (field) {
              const result = { id: field.id };

              let changed = pickBy(
                field,
                (value, key) => !isEqual(f[key], value)
              );

              const { options, ...content } = changed;

              const validOptions =
                options && options.length ? options.filter((o) => !!o) : null;

              const numOfChanged = Object.keys(changed).length;

              if (numOfChanged) {
                // arr.push({ id: field.id, ...content });
                Object.assign(result, content);

                if (validOptions && validOptions.length) {
                  Object.assign(result, { options: validOptions });
                }

                arr.push(result);
              }
            }

            return arr;
          }, [])
        : [];
    },

    toRemove() {
      return this.form && this.fields
        ? this.form.fields.reduce((arr, f) => {
            const idx = this.fields.findIndex(
              (field) => field.id && field.id === f.id
            );
            if (idx === -1) arr.push(f.id);
            return arr;
          }, [])
        : [];
    },
  },
};
</script>

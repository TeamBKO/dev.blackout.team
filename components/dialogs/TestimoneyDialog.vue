<template>
  <v-dialog v-model="open" :minWidth="minWidth" :maxWidth="minWidth">
    <template #activator="{ on }">
      <v-btn text v-on="on">
        <v-icon left>mdi-plus</v-icon>
        <span>Add Testimony</span>
      </v-btn>
    </template>
    <v-card v-if="internalItem">
      <v-toolbar dark>
        <v-toolbar-title>
          <span>Create New Testimony</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click.stop="closeTestimonyDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-list-item class="px-0">
              <v-list-item-avatar>
                <user-avatar
                  :item="{ ...inputFields, avatar }"
                  :size="40"
                  :nameKey="'author'"
                  :style="{ overflow: 'visible' }"
                  is-editable
                  @edit-profile-image="mediaDialog = true"
                ></user-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-text-field
                  label="Author"
                  v-model="internalItem.author"
                ></v-text-field>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12">
            <v-textarea
              label="Text"
              outlined
              v-model="internalItem.text"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="onSave">Save</v-btn>
        <v-btn @click="reset">Reset</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
export default {
  name: 'TestimonyDialog',

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      isSending: false,
      avatar: '',
      inputFields: {
        author: {
          label: 'Author',
          value: '',
          validators: [],
        },
        text: {
          label: 'Text',
          value: '',
          validators: [],
        },
      },
    };
  },

  watch: {
    value(v) {
      const { avatar, id, ...item } = cloneDeep(this.item);
      if (avatar) {
        this.avatar = avatar;
      }
      if (id) {
        this.id = id;
      }
      if (this.isEditMode) {
        if (v) {
          for (let key of item) {
            if (typeof this.inputFields[key] !== undefined) {
              this.inputFields[key].value = item[key];
            }
          }
          return;
        }
      }
      this.reset();
    },
  },

  methods: {
    reset() {
      this.avatar = null;
      this.id = null;
      for (let key of this.inputFields) {
        this.inputFields[key].value = '';
      }
    },
    async onSave() {
      let payload = {};
      for (let key of this.inputFields) {
        if (this.inputFields[key].value) {
          payload[key] = this.inputFields[key].value;
        }
      }

      if (this.avatar) {
        Object.assign(payload, { avatar: this.avatar });
      }

      let request;

      if (!this.isEditMode) {
        request = this.$axios.post('/testimoney', payload);
      } else {
        request = this.$axios.patch(`/testimoney/${this.id}`, payload);
      }

      this.isSending = true;

      try {
        const resp = (await request).data;
        this.$emit('onSuccess', resp);
        this.reset();
        this.$toast.success(this.isEditMode ? 'Saved changes.' : 'Saved.', {
          position: 'top-center',
        });
      } catch (err) {
        console.log(err);
        this.$toast.error(err.response.data.message || err.message, {
          position: 'top-center',
        });
      } finally {
        this.isSending = false;
      }
    },
  },

  computed: {
    isEditMode() {
      return !!this.id;
    },
    title() {
      this.isEditMode ? 'Create A Testimony' : 'Edit A Testimony';
    },
    open: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit('input', v);
      },
    },
  },
};
</script>

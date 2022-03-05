<template>
  <v-dialog v-model="open" :max-width="maxWidth">
    <template #activator="{ on }" v-if="button">
      <v-btn class="v-tab" text v-on="on" :height="buttonHeight">
        <span>Apply</span>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar prominent v-if="!isReadMode">
        <div class="d-flex align-center justify-center flex-grow-1 inherit">
          <v-select
            label="Category"
            :items="categories"
            :item-text="'name'"
            :item-value="'id'"
            v-model="category"
          ></v-select>
        </div>
        <v-btn x-small icon @click="open = false">
          <v-icon v-text="closeIcon"></v-icon>
        </v-btn>
      </v-toolbar>
      <v-toolbar dark v-else-if="isReadMode">
        <v-toolbar-title>
          <user-table-avatar
            :src="selectedForm.applicant.avatar"
            :username="selectedForm.applicant.username"
          ></user-table-avatar>
          <span>{{ applicant }}</span>
        </v-toolbar-title>
        <v-btn small absolute top right icon @click="open = false">
          <v-icon v-text="closeIcon"></v-icon>
        </v-btn>
      </v-toolbar>
      <template v-if="!submitted">
        <v-card-text>
          <v-form v-model="valid" ref="form">
            <recruit-form
              v-model="fields"
              ref="formApplication"
              :readonly="readonly"
              :form="selectedForm"
              :open="open"
              :status.sync="status"
            >
              <!-- <template #recaptcha v-if="!isReadMode">
                <recaptcha
                  ref="recaptcha"
                  :sitekey="siteKey"
                  :theme="'dark'"
                  @render="onRender"
                  @verify="onVerfiy"
                  @expired="resetRecaptcha"
                  @error="onError"
                ></vue-recaptcha>
              </template> -->
            </recruit-form>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="save" :disabled="isDisabled">Submit</v-btn>
          <v-btn text @click="$refs.form.reset()">Reset</v-btn>
        </v-card-actions>
      </template>
      <template v-else>
        <v-card-text>
          <v-container>
            <v-row align="center" justify="center">
              <v-col cols="12" class="text-center">
                <v-icon
                  :color="iconColor"
                  :size="iconSize"
                  v-text="submittedIcon"
                ></v-icon>
              </v-col>
              <v-col cols="12" class="text-center">
                <p class="headline">Thank you for submitted an application.</p>
                <p class="headline">We will get back to you soon.</p>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </template>
      <v-overlay v-model="isSending">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-card>
  </v-dialog>
</template>

<script>
import lists from '~/constants/lists/public.js';

import RecruitForm from './RecruitForm.vue';
import UserTableAvatar from '~/components/users/UserTableAvatar.vue';

export default {
  name: 'RecruitDialog',

  components: { RecruitForm, UserTableAvatar },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    button: {
      type: Boolean,
      default: false,
    },
    categories: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      closeIcon: 'mdi-close',
      maxWidth: '600px',
      valid: false,
      initialRequest: true,
      isSending: false,
      readonly: false,
      submitted: false,
      selectedForm: null,
      category: null,
      forms: [],
      fields: [],
      status: '',
      buttonHeight: '100%',
      iconSize: 120,
      submittedIcon: 'mdi-checkbox-marked-circle-outline',
      iconColor: 'mint',
      isInitialLoad: false,
    };
  },

  watch: {
    category(newId, oldId) {
      if (!oldId) return;
      this.setForm(newId);
    },

    open(v) {
      if (!v) {
        this.readonly = false;
        this.selectedForm = null;
        this.fields = [];
      } else {
        if (!this.readonly) {
          if (this.initialRequest) {
            this.setForm();
            this.initialRequest = false;
          } else {
            this.setForm(this.category);
          }
        }
      }
    },
  },

  methods: {
    async save() {
      const params = {
        form_id: this.selectedForm.id,
        category_id: this.category,
        fields: this.fields,
      };

      if (this.isReadMode) {
        const payload = {
          status: this.status,
        };

        try {
          await this.$store.dispatch(recruitment.actions.EDIT_FORM, {
            id: this.selectedForm.id,
            payload,
          });
          this.open = false;
          this.$toast.success('Saved changes.', { position: 'top-center' });
        } catch (err) {
          this.$toast.error(err.message, { position: 'top-center' });
        }

        return;
      }

      try {
        await this.$axios.post('/recruitment', params);
        this.submitted = true;
      } catch (err) {
        console.log(err);
      }
    },

    async setForm(id) {
      // let selectedForm = this.forms.find(
      //   (form) => form && id && form.category_id === id
      // );

      // if (!selectedForm) {
      //   const getForm = id ? this.getForm(id) : this.getForm();
      //   const results = await getForm;

      //   if (results.categories && results.categories.length) {
      //     this.categoryList = results.categories;
      //     if (results.category_id) this.category = results.category_id;
      //   }

      //   selectedForm = results.form;

      //   this.forms.push(selectedForm);
      // }

      const getForm = id ? this.getForm(id) : this.getForm();
      const results = await getForm;

      if (results?.categories?.length) {
        this.categories = results.categories;
        if (results?.category_id) this.category = results.category_id;
      }

      this.selectedForm = results.form;
    },

    async getForm(id) {
      this.isSending = true;

      const url = id
        ? this.readonly
          ? `/admin/recruitment/${id}`
          : `/recruitment/${id}`
        : '/recruitment';

      try {
        const results = await this.$axios.get(url);

        if (results.status === 203) {
          this.submitted = true;
        } else {
          this.submitted = false;
        }

        // if (this.submitted) this.submitted = false;

        return results.data;
      } catch (err) {
        console.log(err);
      } finally {
        this.isSending = false;
      }
    },

    async viewForm(id) {
      this.readonly = true;
      const form = await this.getForm(id);

      console.log(form);
      this.open = true;

      this.selectedForm = form;
    },
  },

  computed: {
    isReadMode() {
      return this.readonly && this.selectedForm;
    },
    applicant() {
      return Object.keys(this.selectedForm.applicant).length
        ? `${this.selectedForm.applicant.username}'s Application`
        : null;
    },
    isDisabled() {
      // return !this.readonly && (!this.gresponse || !this.valid);

      return !this.valid;
    },
    open: {
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

<style>
.inherit {
  height: inherit;
}

.no-scroll {
  overflow-y: hidden;
}

.scroll {
  overflow-y: auto;
}

.no-border {
  border-radius: 0;
}
</style>

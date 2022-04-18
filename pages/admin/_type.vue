<template>
  <v-container fluid>
    <v-row>
      <v-col md="6" sm="12"> </v-col>
      <v-col md="6" sm="12">
        <div class="d-flex align-center">
          <delete-dialog
            v-model="openDeleteDialog"
            v-if="canDeleteAll"
            @deleteAll="onDelete"
            @cancel="onCancel"
            :length="selectedItems.length"
            :single="single"
          ></delete-dialog>
          <item-dialog
            v-model="openAddItemDialog"
            v-if="canAddAll"
            @update="onInput"
            @save="save"
            @reset="reset"
            :items="inputFields[listType]"
            :name="listType"
          >
            <template #card.text.top v-if="isCategories">
              <media-dialog
                v-if="canViewMedia"
                v-model="openMediaDialog"
                v-bind="mediaOptions"
                @setImage="setCategoryImageBanner"
              >
                <template #activator="{ on, attrs }">
                  <div
                    v-on="on"
                    v-bind="attrs"
                    v-if="!categoryImageBanner"
                    :class="imageBannerClasses"
                  >
                    <v-icon x-large>mdi-image-off-outline</v-icon>
                    <p>Click here to select an image.</p>
                  </div>
                  <v-img :src="categoryImageBanner" v-else>
                    <v-btn fab absolute top right v-on="on" v-bind="attrs">
                      <v-icon>mdi-image-edit-outline</v-icon>
                    </v-btn>
                  </v-img>
                </template>
              </media-dialog>
            </template>
            <template #card.text.bottom>
              <template v-if="isTags">
                <v-menu
                  v-model="tagColorPickerMenu"
                  ref="colorPicker"
                  offset-x
                  :close-on-content-click="false"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-on="on"
                      v-bind="attrs"
                      readonly
                      v-model="tagColor"
                      :label="'Tag color'"
                    >
                      <template #prepend>
                        <v-icon medium :color="tagColor">mdi-circle</v-icon>
                      </template>
                    </v-text-field>
                  </template>
                  <v-card>
                    <v-card-text>
                      <v-color-picker v-model="tagColor" flat></v-color-picker>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn text @click="$refs.colorPicker.save()">Pick</v-btn>
                      <v-btn text @click="reset">Close</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </template>
              <template v-else-if="isCategories">
                <v-list-item class="px-0">
                  <v-list-item-content>
                    <v-list-item-subtitle>
                      Enable Recruitment
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-switch v-model="enable_recruitment"></v-switch>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </template>
            <v-overlay absolute v-model="isSending">
              <v-progress-circular
                indeterminate
                size="64"
              ></v-progress-circular>
            </v-overlay>
          </item-dialog>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          class="elevation-1"
          show-select
          hide-default-footer
          disable-pagination
          v-model="selectedItems"
          :items="items"
          :headers="headers"
          :item-key="'id'"
        >
          <template #item.name="{ item }" v-if="canUpdateAll">
            <table-field
              validate
              :endpoint="endPoint"
              :id="item.id"
              :value="item.name"
              @save="updateItem(item.id, 'name', $event)"
            ></table-field>
          </template>

          <template #item.actions="{ item }" v-if="displayActions">
            <table-actions
              :actions="actions"
              :suffix="$route.params.type"
              :isDeletable="item.is_deletable"
              @remove="setItemForRemoval(item.id)"
            ></table-actions>
          </template>
          <!-- <template #footer>
            <infinite-loading ref="loader" @infinite="onUpdate">
              <template #no-more>
                <v-btn text block>
                  <v-icon left>mdi-refresh</v-icon>
                  <span>Refresh</span>
                </v-btn>
              </template>
              <template #no-results>
                <v-btn text block>
                  <span>LOAD MORE</span>
                </v-btn>
              </template>
            </infinite-loading>
          </template> -->
        </v-data-table>
        <div
          class="d-flex justify-center align-center"
          v-intersect="onIntersect"
          v-if="items.length && hasMore"
        >
          <v-progress-circular
            intermediate
            v-if="loading"
          ></v-progress-circular>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
// import { createNamespacedHelpers } from 'vuex';
import { isRequired } from '~/utilities/validators';
import camelCase from 'lodash/camelCase';
import pluralize from 'pluralize';

import LISTS from '~/constants/lists/public.js';
import PAGE from '~/constants/page/public.js';

import itemManagement from '~/mixins/itemManagement.js';
import clearPage from '~/mixins/clearPage.js';

import ItemDialog from '~/components/dialogs/ItemDialog.vue';
import TableActions from '~/components/controls/Actions.vue';
import MediaDialog from '~/components/media/MediaDialog.vue';
import DeleteDialog from '~/components/dialogs/DeleteDialog.vue';
import TableField from '~/components/controls/TableField.vue';

import capitalize from 'lodash/capitalize';

// const { mapGetters, mapActions, mapMutations } =
//   createNamespacedHelpers('lists');

const types = /categories|tags/;

export default {
  name: 'Items',
  layout: 'admin',

  components: {
    ItemDialog,
    DeleteDialog,
    MediaDialog,
    TableActions,
    TableField,
  },

  mixins: [itemManagement(LISTS, 'openDeleteDialog')],

  validate({ params }) {
    return types.test(params.type);
  },

  middleware: [
    'auth',
    ({ $auth, $permissions, store, redirect, params }) => {
      const { VIEW_ALL_ADMIN } = $permissions;
      if (!$auth.hasScope(VIEW_ALL_ADMIN)) {
        return redirect('/');
      }

      const _params = params.type.toLowerCase();

      store.commit(PAGE.mutations.SET_TITLE, `View ${capitalize(params.type)}`);
      store.commit(LISTS.mutations.SET_TYPE, params.type);
      store.dispatch(LISTS.actions.CLEAR_ITEMS); //clear items before the next list is displayed.
      store.dispatch(LISTS.actions.FETCH, {
        type: _params,
      });
    },
  ],

  data() {
    return {
      icon: 'mdi-trash-can-outline',
      openDeleteDialog: false,
      openMediaDialog: false,
      tagColorPickerMenu: false,
      openAddItemDialog: false,
      enable_recruitment: false,
      isSending: false,
      tagColor: '',
      categoryImageBanner: '',
      imageBannerClasses:
        'mt-2 mb-3 d-flex flex-column justify-center align-center category-banner__no-image',

      mediaOptions: {
        fileSize: 120000,
        single: true,
        fullscreen: true,
      },

      inputFields: {
        tags: [
          {
            label: 'Tag name',
            column: 'name',
            value: '',
            validate: true,
            endpoint: '/validate/tags',
            // rules: [isRequired('Tag name')],
          },
        ],
        categories: [
          {
            label: 'Category name',
            column: 'name',
            value: '',
            validate: true,
            endpoint: '/validate/categories',
            // rules: [isRequired('Category name')],
          },
        ],
      },

      baseValues: {
        tagName: '',
        categoryName: '',
        tagColor: '',
        categoryImageBanner: '',
        enable_recruitment: false,
      },

      actions: [{ icon: 'mdi-delete', scope: 'delete', text: 'Remove' }],
    };
  },

  methods: {
    onInput({ value, idx }) {
      console.log({ value, idx });
      const input = this.inputFields[this.listType][idx];
      input.value = value;
    },

    setCategoryImageBanner(url) {
      this.categoryImageBanner = url;
    },

    async onUpdate(loader) {
      this.$store.dispatch(LISTS.actions.FETCH, {
        type: this.$route.params.type,
        loader,
      });
    },

    async getItem(id) {
      const listType = this.listType;
      const inputFields = this.selectedInputFields;

      this.isSending = true;

      try {
        const item = await this.$axios.$get(`/${listType}/${id}`);
        const cloned = { ...item };

        if (this.isCategories) {
          this.categoryImageBanner = item.image;
          this.enable_recruitment = item.enable_recruitment;
          this.baseValues.categoryImageBanner = cloned.image;
          this.baseValues.enable_recruitment = cloned.enable_recruitment;
        }

        if (this.isTags) {
          this.tagColor = item.color;
          this.baseValues.tagColor = cloned.color;
        }

        const name = pluralize.singular(`${listType}Name`);
        inputFields[0].value = item.name;
        this.baseValues[name] = cloned.item;

        // inputFields.forEach((input) => {
        //   const name = pluralize.singular(`${listType}Name`);
        //   input.value = item.name;
        //   this.baseValues[name] = cloned.name;
        // });

        this.openAddItemDialog = true;
      } catch (err) {
        console.log(err);
      } finally {
        this.isSending = false;
      }
    },

    reset() {
      const inputFields = this.selectedInputFields;

      if (this.isCategories) {
        this.categoryImageBanner = '';
        this.baseValues.categoryImageBanner = '';
        this.baseValues.enable_recruitment = false;
      }

      if (this.isTags) {
        this.tagColor = '';
        this.baseValues.tagColor = '';
      }

      inputFields[0].value = '';
    },

    async save() {
      let payload = {};
      const inputFields = this.selectedInputFields;
      const name = pluralize.singular(`${this.listType}Name`);

      if (this.isCategories) {
        if (this.categoryImageBanner !== this.baseValues.categoryImageBanner) {
          Object.assign(payload, { image: this.categoryImageBanner });
        }

        if (this.enable_recruitment !== this.baseValues.enable_recruitment) {
          Object.assign(payload, {
            enable_recruitment: this.enable_recruitment,
          });
        }
      }

      if (this.isTags) {
        if (this.tagColor !== this.baseValues.tagColor) {
          Object.assign(payload, { color: this.tagColor });
        }
      }

      inputFields.forEach((input) => {
        const label = camelCase(input.label);
        if (input.value !== this.baseValues[label]) {
          Object.assign(payload, { [input.column]: input.value });
        }
      });

      this.isSending = true;

      try {
        const item = await this.addItem(payload);
        this.$toast.success(`Successfully added: ${name}`, {
          position: 'top-center',
        });

        this.openAddItemDialog = false;
        requestAnimationFrame(() => this.nextTick(() => this.reset()));
      } catch (err) {
        console.log(err);
        this.$toast.error(err.message, {
          position: 'top-center',
        });
      } finally {
        this.isSending = false;
      }
    },
  },

  computed: {
    loading() {
      return this.$store.getters[LISTS.getters.LOADING];
    },

    hasMore() {
      return this.$store.getters[LISTS.getters.HAS_MORE];
    },

    endPoint() {
      return this.isCategories ? 'categories' : 'tags';
    },

    canViewMedia() {
      return this.$auth.hasScope([
        [this.$permissions.VIEW_ALL_MEDIA],
        [this.$permissions.VIEW_OWN_MEDIA],
      ]);
    },

    canAddAll() {
      return this.$auth.hasScope([
        this.$permissions[`ADD_ALL_${this.$route.params.type.toUpperCase()}`],
      ]);
    },

    canUpdateAll() {
      return this.$auth.hasScope([
        this.$permissions[
          `UPDATE_ALL_${this.$route.params.type.toUpperCase()}`
        ],
      ]);
    },

    canDeleteAll() {
      return this.$auth.hasScope([
        this.$permissions[
          `DELETE_ALL_${this.$route.params.type.toUpperCase()}`
        ],
      ]);
      // return this.isTags
      //   ? this.$auth.hasScope([this.$permissions.DELETE_ALL_TAGS])
      //   : this.$auth.hasScope([this.$permissions.DELETE_ALL_CATEGORIES]);
    },

    displayActions() {
      const privs = ['DELETE_ALL_', 'UPDATE_ALL_', 'ADD_ALL_'];

      return this.$auth.hasScope(
        privs.map((priv) => [
          this.$permissions[`${priv}${this.$route.params.type.toUpperCase()}`],
        ])
      );
      // const tagsPrivs = this.$auth.hasScope([
      //   [this.$permissions.DELETE_ALL_TAGS],
      //   [this.$permsisions.UPDATE_ALL_TAGS],
      //   [this.$permissions.ADD_ALL_TAGS],
      // ]);
      // const catPrivs = this.$auth.hasScope([
      //   [this.$permissions.DELETE_ALL_CATEGORIES],
      //   [this.$permsisions.UPDATE_ALL_CATEGORIES],
      //   [this.$permissions.ADD_ALL_CATEGORIES],
      // ]);

      // return this.isCategories ? catPrivs : tagPrivs;
    },

    isCategories() {
      return this.$route.params.type === 'categories';
    },

    isTags() {
      return this.$route.params.type === 'tags';
    },

    listType() {
      return this.$route.params.type;
    },

    validateName() {
      return this.$route.params.type;
      // return {
      //   name: this.$route.params.type,
      //   value: 'name',
      // };
    },

    selectedInputFields() {
      return this.inputFields[this.listType];
    },

    items() {
      return this.$store.getters[LISTS.getters.GET_ITEMS](this.listType);
    },

    headers() {
      const headers =
        this.items && this.items.length
          ? Object.keys(this.items[0]).flatMap((key) => {
              if (key === 'id') return [];
              return [
                {
                  text: key.toUpperCase(),
                  sortable: true,
                  value: key,
                },
              ];
            })
          : [];

      headers.push({
        text: this.$vuetify.breakpoint.mobile ? 'ACTIONS' : '',
        align: 'end',
        value: 'actions',
      });

      return headers;
    },
  },
};
</script>

<style scoped>
.category-banner__no-image {
  width: 100%;
  height: 200px;
  border: 2px dashed grey;
}
</style>

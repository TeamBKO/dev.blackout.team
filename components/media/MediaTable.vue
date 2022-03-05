<template>
  <v-data-table
    :items="items"
    :headers="headers"
    disable-filtering
    disable-pagination
    disable-sort
    hide-default-footer
  >
    <template #item.image="{ item }">
      <v-item #default="{ active, toggle }" :value="item.url">
        <v-img
          :class="{ 'is-selected': active }"
          :src="item.url"
          :width="150"
          :height="90"
          @click="select(toggle)"
        />
      </v-item>
    </template>
    <template #item.url="{ item }">
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-btn icon v-on="on" @click="copyToClipboard(item.url)">
            <v-icon>mdi-link</v-icon>
          </v-btn>
        </template>
        {{ item.url }}
      </v-tooltip>
    </template>
    <template #item.uploader="{ item }">
      <v-list-item class="px-0">
        <v-list-item-avatar>
          <user-avatar :item="item.uploader" :size="40" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ item.uploader.username }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <template #item.created_at="{ item }">
      {{ $dayjs(item.created_at).format('ddd, MMM D, YYYY') }}
    </template>
    <template #item.updated_at="{ item }">
      {{ $dayjs(item.updated_at).format('ddd, MMM D, YYYY') }}
    </template>
    <template #item.actions="{ item }">
      <media-table-actions :item="item" @share="$emit('share', item.id)">
        <template #bottom="{ canDelete }">
          <v-list-item v-if="canDelete">
            <v-list-item-action>
              <v-checkbox
                v-model="computedSelectedForDeletion"
                multiple
                dense
                :value="item.storage_key"
                :off-icon="'mdi-close'"
                :on-icon="'mdi-check'"
              ></v-checkbox>
            </v-list-item-action>
            <v-list-item-content class="pl-0">
              <v-list-item-title>Delete</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </media-table-actions>
    </template>
  </v-data-table>
</template>

<script>
import MediaTableActions from './MediaTableActions';
import UserAvatar from '~/components/avatar/ListAvatar.vue';
export default {
  name: 'MediaTable',

  components: {
    MediaTableActions,
    UserAvatar,
  },

  props: {
    items: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Array,
      default: () => [],
    },
    disableSelect: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      headers: [
        { text: 'IMAGE', align: 'start', sortable: false, value: 'image' },
        {
          text: 'UPLOADED BY',
          align: 'start',
          sortable: false,
          value: 'uploader',
        },
        { text: 'URL', align: 'start', sortable: false, value: 'url' },
        {
          text: 'CREATED AT',
          align: 'start',
          sortable: false,
          value: 'created_at',
        },
        {
          text: 'UPDATED AT',
          align: 'start',
          sortable: false,
          value: 'updated_at',
        },
        { text: '', align: 'end', sortable: false, value: 'actions' },
      ],
    };
  },

  methods: {
    select(toggle) {
      // if (this.avatarAlreadySet) return;
      if (this.disableSelect) return;
      toggle();
    },
    copyToClipboard(value) {
      navigator.clipboard.writeText(value);
      this.$toast.success('Copied to clipboard', { position: 'top-center' });
    },
  },

  computed: {
    computedSelectedForDeletion: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
};
</script>

<template>
  <v-list>
    <v-list-item @click.stop two-line v-for="(item, idx) in items" :key="idx">
      <v-list-item-content>
        <v-list-item-title
          ><span>{{ item.name }}</span></v-list-item-title
        >
        <v-list-item-subtitle>
          <v-list-item class="pa-0">
            <v-list-item-avatar :size="24">
              <v-img :src="item.author.avatar"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-subtitle
                >Author: {{ item.author.username }} -
                <em
                  >updated:
                  {{ $dayjs(item.updated_at).format('ddd, MMM D, YYYY') }}</em
                ></v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-list-item-subtitle>
      </v-list-item-content>
      <slot name="actions" v-bind="item" />
    </v-list-item>
    <slot name="append" />
  </v-list>
</template>

<script>
export default {
  name: 'DiscordMessageDraftList',

  props: {
    items: {
      type: [Array, Object],
      default: () => [],
    },
  },
};
</script>

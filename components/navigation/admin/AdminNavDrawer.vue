<template>
  <v-navigation-drawer app v-model="open" dark>
    <v-list nav>
      <nav-list-item
        :item="link"
        :key="idx"
        v-for="(link, idx) in links"
      ></nav-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import page from '~/constants/page/public.js';
import UserAvatar from '~/components/avatar/UserAvatar.vue';
import NavListItem from '~/components/navigation/NavListItem.vue';
export default {
  name: 'AdminNavDrawer',
  components: { UserAvatar, NavListItem },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    links: {
      type: [Object, Array],
      default: () => [],
    },
    title: {
      type: String,
    },
  },

  computed: {
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

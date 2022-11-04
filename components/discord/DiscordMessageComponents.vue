<template>
  <div class="discord-message-components">
    <div
      class="discord-message-action-row"
      v-for="(row, idx) in items"
      :key="idx"
    >
      <v-btn
        v-for="(item, i) in row.components"
        class="mb-2 mr-2 text-capitalize font-weight-regular text-caption"
        depressed
        :color="styleColor[`style_${item.style}`]"
        :key="i"
      >
        <template v-if="item.emoji">
          <v-icon>{{ item.emoji }}</v-icon>
          <span>{{ item.label }}</span>
        </template>
        <template v-else-if="item.style === 5">
          <span>{{ item.label }}</span>
          <v-icon right>mdi-open-in-new</v-icon>
        </template>
        <template v-else>
          {{ item.label }}
        </template>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DiscordMessageComponents',

  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      styleColor: {
        style_1: '#5865F2',
        style_2: '#43B581',
        style_3: '#4F545C',
        style_4: '#F04747',
        style_5: '#4F545C',
      },
    };
  },
};
</script>

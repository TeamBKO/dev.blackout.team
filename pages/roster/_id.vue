<template>
  <roster-container></roster-container>
</template>

<script>
import RosterContainer from '~/components/rosters/RosterContainer.vue';
export default {
  name: 'RosterPage',

  components: { RosterContainer },

  data() {
    return {
      from: null,
    };
  },
};
</script>

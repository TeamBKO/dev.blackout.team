<template>
  <v-container>
    <div class="text-center">
      <h4 class="text-h3">
        BKO is the #1 beloved community every where we go.
      </h4>
      <p>
        Don't believe us? Just read some discord comments from our
        <strike>victims</strike> fans!
      </p>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'Testimonies',

  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

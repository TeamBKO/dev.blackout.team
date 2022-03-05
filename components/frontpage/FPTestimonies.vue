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
    <v-row>
      <v-col cols="12" md="3" v-for="(item, idx) in items" :key="idx">
        <v-card>
          <v-card-title>
            <v-list-item class="grow">
              <v-list-item-avatar>
                <v-img :src="item.avatar"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ item.author }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card-title>
          <v-card-text>
            <p>{{ item.text }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
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

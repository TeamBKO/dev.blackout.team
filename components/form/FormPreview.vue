<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-textarea
          readonly
          v-model="description"
          outlined
          label="Description"
        ></v-textarea>
      </v-col>
    </v-row>
    <v-row v-for="(field, idx) in fields" :key="idx">
      <v-col cols="12">
        <div class="text--subtitle-1 font-weight-medium">
          <span>Question {{ idx + 1 }}</span>
        </div>
        <p class="text--white">{{ field.value }}</p>
        <form-field :field="field"></form-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FormField from './FormField.vue';

export default {
  name: 'FormPreview',

  components: { FormField },

  props: {
    fields: {
      type: Array,
      default: () => [],
    },
    description: {
      type: String,
    },
    name: {
      type: String,
    },
  },
};
</script>

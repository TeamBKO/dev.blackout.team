<template>
  <v-expansion-panel
    v-model="open"
    class="elevation-5"
    :style="parentPanelStyles"
  >
    <v-expansion-panel-header
      hide-actions
      @click.native="open = !open"
      class="py-0 px-0"
    >
      <v-list-item class="pa-0">
        <v-list-item-icon class="mr-0">
          <v-btn icon>
            <v-icon :class="iconClass">mdi-chevron-right</v-icon>
          </v-btn>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            <strong>Embeded {{ position + 1 }} --</strong>
            {{ embed.body.title.value }}
            <v-icon right color="#ff7373" small v-if="!isValid"
              >mdi-alert-circle</v-icon
            >
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <div class="d-flex">
            <v-spacer></v-spacer>
            <v-btn
              icon
              v-if="isMiddlePosition"
              :class="upIconClass"
              @click.stop="moveUp"
            >
              <v-icon small>mdi-chevron-up</v-icon>
            </v-btn>
            <v-btn icon @click.stop="move" v-if="hasMoreThanOne">
              <v-icon small>{{ moveIconState }}</v-icon>
            </v-btn>
            <v-tooltip top>
              <template #activator="{ on }">
                <v-btn
                  icon
                  v-on="on"
                  @click.stop="$emit('duplicate')"
                  class="mx-1"
                >
                  <v-icon small>mdi-content-duplicate</v-icon>
                </v-btn>
              </template>
              Duplicate
            </v-tooltip>
            <v-tooltip top>
              <template #activator="{ on }">
                <v-btn icon v-on="on" @click.stop="$emit('remove')">
                  <v-icon small>mdi-close</v-icon>
                </v-btn>
              </template>
              Remove
            </v-tooltip>
          </div>
        </v-list-item-action>
      </v-list-item>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-expansion-panels
        accordion
        flat
        multiple
        v-for="(panel, key) in embed"
        :key="key"
      >
        <discord-message-child-panel
          v-if="key === 'fields'"
          :is-valid="isValid"
          :title="key"
        >
          <v-container fluid>
            <discord-message-child-panel
              v-model="field.valid"
              class="px-3"
              show-actions
              v-for="(field, idx) in panel.items"
              :title="`Field ${idx + 1} -- ${field.name.value}`"
              :key="idx"
              :position="idx"
              :maxNumOfPanels="panel.items.length"
              @duplicate="$emit('duplicateField', idx)"
              @remove="$emit('removeField', idx)"
              @move="$emit('moveField', $event)"
            >
              <v-container fluid>
                <v-row>
                  <v-col cols="12">
                    <div class="d-flex">
                      <v-text-field
                        v-model="field.name.value"
                        label="Field name"
                        filled
                        :counter="256"
                        :rules="field.name.rules"
                      >
                      </v-text-field>
                      <v-checkbox
                        class="pl-3"
                        label="Inline"
                        v-model="field.inline"
                      ></v-checkbox>
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      ref="fieldBody"
                      v-model="field.value"
                      label="Field value"
                      filled
                      :counter="1024"
                    >
                      <template #append>
                        <discord-emoji-picker
                          @getEmoji="
                            getEmoji(
                              $refs.fieldBody[idx],
                              field,
                              'value',
                              'textarea',
                              $event
                            )
                          "
                        >
                          <template #activator="{ on }">
                            <v-btn v-on="on" icon>
                              <v-icon>mdi-emoticon</v-icon>
                            </v-btn>
                          </template>
                        </discord-emoji-picker>
                      </template>
                    </v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </discord-message-child-panel>
            <v-btn small primary @click="$emit('addField')"> Add Field </v-btn>
          </v-container>
        </discord-message-child-panel>

        <discord-message-child-panel
          :title="key"
          @valid="valid = $event"
          v-else
        >
          <v-container fluid>
            <v-row>
              <v-col
                v-for="(field, fieldName) in panel"
                v-bind="field.columns ? field.columns : undefined"
                :key="fieldName"
              >
                <v-menu
                  close-on-content-click
                  ref="menu"
                  v-if="field.type === 'v-color-picker'"
                >
                  <template #activator="{ on }">
                    <v-text-field
                      v-on="on"
                      v-bind="field.props"
                      v-model="field.value"
                    >
                      <template #append-outer>
                        <v-avatar
                          tile
                          :color="field.value"
                          size="24"
                        ></v-avatar>
                      </template>
                    </v-text-field>
                  </template>
                  <v-color-picker
                    dark
                    v-model="field.value"
                    @update:color="updateColor"
                  ></v-color-picker>
                </v-menu>
                <v-menu
                  v-else-if="field.type === 'v-date-picker'"
                  v-model="openDatePicker"
                  :close-on-content-click="false"
                  :return-value.sync="field.value"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                  ref="datePicker"
                >
                  <template #activator="{ on }">
                    <v-text-field
                      v-on="on"
                      v-bind="field.props"
                      v-model="field.value"
                      prepend-icon="mdi-calendar"
                      readonly
                    >
                    </v-text-field>
                  </template>
                  <v-date-picker v-model="field.value" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.datePicker.save(date)"
                    ></v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="openDatePicker = false"
                    ></v-btn>
                  </v-date-picker>
                </v-menu>
                <component
                  v-else
                  v-bind="field.props"
                  v-model="field.value"
                  :ref="`${key}_${fieldName}`"
                  :is="field.type"
                >
                  <template #append v-if="field.emoji && field.emoji.tag">
                    <discord-emoji-picker
                      @click.stop
                      @getEmoji="
                        getEmoji(
                          $refs[`${key}_${fieldName}`],
                          field,
                          'value',
                          field.emoji.tag,
                          $event
                        )
                      "
                    >
                      <template #activator="{ on }">
                        <v-btn v-on="on" icon>
                          <v-icon>mdi-emoticon</v-icon>
                        </v-btn>
                      </template>
                    </discord-emoji-picker>
                  </template>
                </component>
              </v-col>
            </v-row>
            <v-divider></v-divider>
          </v-container>
        </discord-message-child-panel>
      </v-expansion-panels>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import DiscordMessageChildPanel from './DiscordMessageChildPanel.vue';
import DiscordEmojiPicker from './DiscordEmojiPicker.vue';

export default {
  name: 'DiscordMessageEmbedPanel',

  components: {
    DiscordMessageChildPanel,
    DiscordEmojiPicker,
  },

  props: {
    value: {
      type: Boolean,
      default: true,
    },
    embed: {
      type: Object,
      default: () => {},
    },
    position: {
      type: Number,
      default: 0,
    },
    maxNumOfPanels: {
      type: Number,
    },
  },

  watch: {
    valid(v) {
      this.$emit('input', v);
    },
  },

  data() {
    return {
      open: false,
      openDatePicker: false,
      valid: true,
    };
  },

  methods: {
    getEmoji(ref, target, key, el, emoji) {
      let element;
      if (Array.isArray(ref)) {
        element = ref[0].$el.getElementsByTagName(el)[0];
      } else {
        element = ref.$el.getElementsByTagName(el)[0];
      }

      let startPos = element.selectionStart,
        endPos = element.selectionEnd,
        cursorPos = startPos,
        tmp = target[key];

      target[key] =
        tmp.substring(0, startPos) + emoji + tmp.substring(endPos, tmp.length);

      setTimeout(() => {
        cursorPos += emoji.length;
        element.selectionStart = element.selectionEnd = cursorPos;
      }, 10);
    },

    setValidity(value) {
      this.valid = value;
      this.embed.fields.valid = value;
    },
    addImageField() {
      if (this.embed.body.url.value) {
        if (this.embed.images.imageURLs.length === 4) return;
      } else {
        if (this.embed.images.imageURLs.length === 1) return;
      }

      this.$emit('addImage');
    },
    removeImage(idx) {
      this.embeds.image.imageURLS.splice(idx, 1);
    },
    updateColor(color) {
      this.embed.body.color.value = color.hex;
    },
    moveDown() {
      let position = this.position;
      if (position === this.isInLastPosition) return;
      position += 1;
      this.$emit('move', position);
    },
    moveUp() {
      let position = this.position;
      if (position === this.isInFirstPosition) return;
      position -= 1;
      this.$emit('move', position);
    },
    move() {
      this.isInFirstPosition || this.isMiddlePosition
        ? this.moveDown()
        : this.moveUp();
    },
  },

  computed: {
    hasInvalidField() {
      return this.embed.fields.items.length
        ? this.embed.fields.items.some((field) => !field.valid)
        : false;
    },

    isValid() {
      return this.valid && !this.hasInvalidField;
    },

    isFieldButtonDisabled() {
      return this.embed.fields.length === 10;
    },
    previewColor() {
      return { 'background-color': this.embed.body.color.value };
    },

    iconClass() {
      return ['chevron', { active: this.open }];
    },

    parentPanelStyles() {
      return { 'border-left': `solid 3px ${this.embed.body.color.value}` };
    },
    moveIconState() {
      return this.isInFirstPosition || this.isMiddlePosition
        ? 'mdi-chevron-down'
        : 'mdi-chevron-up';
    },
    upIconClass() {
      return [this.hasNextSibling ? 'mx-1' : null];
    },
    hasMoreThanOne() {
      return this.maxNumOfPanels > 1;
    },
    hasNextSibling() {
      return !this.isInLastPosition;
    },
    isInFirstPosition() {
      return this.position === 0;
    },
    isInLastPosition() {
      return this.position === this.maxNumOfPanels - 1 && this.hasMoreThanOne;
    },
    isMiddlePosition() {
      return this.position > 0 && this.hasNextSibling && this.hasMoreThanOne;
    },
  },
};
</script>
<style scoped>
.preview-color {
  border-radius: 40%;
  height: 42px;
  width: 42px;
  color: grey;
}

.v-expansion-panel-content::v-deep .v-expansion-panel-content__wrap {
  padding: 0 !important;
}
</style>

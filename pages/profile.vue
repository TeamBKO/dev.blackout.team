<template>
  <section id="user-settings" @mousedown="resetUsername">
    <v-container fluid class="pa-0">
      <v-img
        :src="src"
        eager
        :max-height="maxBannerHeight"
        :content-class="'profile-banner'"
      >
        <v-container>
          <v-list-item @mousedown.stop>
            <v-list-item-avatar
              :size="avatarSize"
              :style="{ overflow: 'visible' }"
            >
              <user-settings-avatar
                :showButton="enableMediaDialog"
                :size="avatarSize"
                :item="info"
                @update-avatar="showMediaDialog = true"
              ></user-settings-avatar>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                <div class="text-md-h3 text sm-and-down h5 text-shadow">
                  <div v-if="!editName">
                    <span> {{ info.username }}</span>
                    <v-btn icon @click="editName = true">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </div>
                  <v-form v-model="usernameValid" v-else>
                    <async-text-input
                      :endpoint="endpoint"
                      :filled="false"
                      validate
                      class="text-md-h3 input-username"
                      v-model="info.username"
                    >
                    </async-text-input>
                  </v-form>
                </div>
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action v-if="editName">
              <span>
                <v-btn
                  icon
                  @click="changeUsername"
                  :disabled="isUsernameButtonDisabled"
                >
                  <v-icon>mdi-check</v-icon>
                </v-btn>
                <v-btn icon @click="resetUsername">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </span>
            </v-list-item-action>
          </v-list-item>
        </v-container>
        <div class="fill-height bottom-gradient"></div>
      </v-img>
    </v-container>
    <v-container>
      <v-card rounded class="mt-n16 mx-auto fill-height" elevation="2">
        <v-tabs v-model="tab" vertical icons-and-text>
          <v-tab>Personal <v-icon>mdi-account-details</v-icon></v-tab>
          <v-tab>Contact <v-icon>mdi-card-account-mail</v-icon></v-tab>
          <v-tab>Security <v-icon>mdi-security</v-icon></v-tab>

          <v-tab-item
            v-for="(inputs, k) in inputFields"
            eager
            transition="fade-transition"
            :key="k"
          >
            <v-card flat>
              <v-card-title>{{
                k.charAt(0).toUpperCase() + k.slice(1)
              }}</v-card-title>
              <v-card-text>
                <v-form ref="form" v-model="isValid">
                  <v-row>
                    <v-col
                      cols="12"
                      v-for="(input, key) in inputs"
                      :key="key"
                      :md="input.columns.md"
                    >
                      <form-field
                        v-model="input.value"
                        :field="input.info"
                        :readonly="input.readOnly ? input.readOnly : false"
                        :rules="input.validators"
                        :edit="input.edit ? input.edit : false"
                        filled
                      ></form-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  text
                  @click="submit"
                  :disabled="isDisabled"
                  v-if="isPersonal || isSecurity"
                  >Save</v-btn
                >
                <update-email-dialog
                  v-model="openEmailDialog"
                  v-else
                  @onUpdate="submit"
                  :disabled="isDisabled"
                  :label="'Save'"
                  :data="inputFields.contact"
                ></update-email-dialog>
                <v-btn text @click="reset">Reset</v-btn>
              </v-card-actions>
            </v-card>
            <v-card flat>
              <v-card-title>Security</v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item class="px-0" two-line>
                    <v-list-item-content>
                      <v-list-item-title>Edit Email</v-list-item-title>
                      <v-list-item-subtitle
                        ><i>{{
                          inputFields.contact.email.value
                        }}</i></v-list-item-subtitle
                      >
                    </v-list-item-content>
                    <v-list-action><v-btn text>send code</v-btn></v-list-action>
                  </v-list-item>
                  <v-list-item class="px-0" two-line>
                    <v-list-item-content>
                      <v-list-item-title>Edit Password</v-list-item-title>
                      <v-list-item-subtitle
                        >Dispatches an email with a verification
                        code.</v-list-item-subtitle
                      >
                    </v-list-item-content>
                    <v-list-action><v-btn text>send code</v-btn></v-list-action>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
            <v-card flat>
              <v-card-title>Social</v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item class="px-0" two-line v-if="info.local">
                    <v-list-item-content>
                      <v-list-item-title>Discord</v-list-item-title>
                      <v-list-item-subtitle
                        >Linking your account to discord grants you the ability
                        to log in using discord
                        credentials</v-list-item-subtitle
                      >
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-btn :color="'#7289da'" @click="manageDiscordAccount">
                        <v-icon left>mdi-discord</v-icon>
                        <span>{{ discordButtonText }}</span>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                  <v-list-item class="px-0" two-line v-if="info.local">
                    <v-spacer></v-spacer>

                    <v-list-item-action>
                      <delete-self-button>
                        <template #activator="{ on }">
                          <v-btn text color="error" v-on="on"
                            ><v-icon left>mdi-trash-can-outline</v-icon
                            ><span>Delete Account</span></v-btn
                          >
                        </template>
                      </delete-self-button>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-container>

    <media-dialog
      v-if="enableMediaDialog"
      v-model="showMediaDialog"
      v-bind="mediaOptions"
      :key="'avatar'"
      :uploadEndpoint="'/upload-avatar'"
      @setImage="updateAvatarImage"
    ></media-dialog>
    <v-dialog persistent v-model="showDelinkDialog" :width="dialogWidth">
      <v-card>
        <v-card-title> Confirm Account Change </v-card-title>
        <v-card-text>
          <strong>
            Do you wish to delink your discord account from your site account?
          </strong>
          <p>
            Doing so will cause any discord mapped site roles and/or user
            changes to not be reflected on the site.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="delinkDiscordSocialAccount" color="primary">
            OK
          </v-btn>
          <v-btn @click="showDelinkDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import settings from '~/constants/settings/public.js';
import {
  isRequired,
  isEmail,
  isAlphanumeric,
  minLength,
} from '~/utilities/validators';

import UserSettingsAvatar from '~/components/avatar/UserSettingsAvatar.vue';
import DeleteSelfButton from '~/components/controls/DeleteSelfButton.vue';
import FormField from '~/components/form/FormField.vue';
import AsyncTextInput from '~/components/inputs/AsyncTextInput.vue';

import MediaDialog from '~/components/media/MediaDialog.vue';
import UpdateEmailDialog from '~/components/dialogs/UpdateEmailDialog.vue';

import cloneDeep from 'lodash/cloneDeep';
import snakeCase from 'lodash/snakeCase';
import camelCase from 'lodash/camelCase';
import qs from 'qs';

let _window = null;

export default {
  name: 'UserProfilePage',

  // transition: {
  //   name: 'fade',
  //   mode: 'in-out',
  // },

  components: {
    UserSettingsAvatar,
    MediaDialog,
    FormField,
    UpdateEmailDialog,
    AsyncTextInput,
    DeleteSelfButton,
  },

  middleware: [
    ({ $auth, redirect }) => {
      if (!$auth.loggedIn) redirect('/');
    },
  ],

  async asyncData(ctx) {
    const info = (await ctx.$axios.get('/users/me')).data;

    if (!info.birthday) {
      info.birthday = new Date().toISOString().substr(0, 10);
    } else {
      info.birthday = new Date(info.birthday).toISOString().substr(0, 10);
    }

    return {
      defaultUsername: info.username,
      discordLinked: !!info.discord_id,
      info,
    };
  },

  async mounted() {
    this.assignInitalValuesToFields(cloneDeep(this.info));

    const socket = this.$nuxtSocket({
      channel: '/index',
      reconnection: true,
      auth: {
        token: this.$auth.strategy.refreshToken.get(),
      },
    });

    socket.on('linked', () => {
      this.discordLinked = true;
      this.$toast.success('Discord account linked.', {
        position: 'top-center',
      });

      if (_window) {
        _window.close();
        _window = null;
      }
    });

    socket.on('conflict', (message) => {
      this.$toast.error(message, { position: 'top-center', duration: 3000 });
      if (_window) {
        _window.close();
        _window = null;
      }
    });

    socket.on('error', (message) => {
      this.$toast.error(message, { position: 'top-center' });
      if (_window) {
        _window.close();
        _window = null;
      }
    });
  },

  data() {
    return {
      info: null,

      valid: {
        personal: false,
        contact: false,
        security: false,
      },

      usernameValid: false,

      defaultUsername: '',

      editName: false,
      discordLinked: false,

      maxBannerHeight: 400,
      avatarSize: 120,
      dialogWidth: 650,

      mediaOptions: {
        fileSize: 72000,
        single: true,
        fullscreen: true,
      },

      endpoint: '/validate/username',

      tab: 0,
      tabs: ['personal', 'contact', 'security'],

      showMediaDialog: false,
      openEmailDialog: false,
      showDelinkDialog: false,

      baseURL: 'https://discord.com/api/oauth2/authorize',

      redirectUriData: {
        client_id: '689512721598775339',
        redirect_uri: 'http://localhost:3000/social/discord',
        response_type: 'code',
        grant_type: 'authorization_code',
        scope: 'identify email guilds',
      },

      windowOptions: {
        status: 0,
        toolbar: 0,
        menubar: 0,
        directories: 0,
        resizable: 0,
        scrollbars: 0,
        height: 750,
        width: 700,
      },

      src: 'https://images.ctfassets.net/j95d1p8hsuun/1ShvIkEIe3cvb5qKSguLdC/9bbac0c4239985ca540650ec240d765b/HOME_USP1_FightTheWorld_CPB-L-1920x720.jpg',

      inputFields: {
        personal: {
          firstName: {
            info: {
              label: 'First name',
              type: 'textfield',
            },
            value: '',
            columns: {
              md: 6,
            },
            validators: [
              isAlphanumeric('First name'),
              minLength('First name', 3),
            ],
          },
          lastName: {
            info: {
              label: 'Last name',
              type: 'textfield',
            },
            value: '',
            columns: {
              md: 6,
            },
            validators: [
              isAlphanumeric('Last name'),
              minLength('Last name', 3),
            ],
          },
          location: {
            info: {
              label: 'Location',
              type: 'textfield',
            },
            value: '',
            columns: {
              md: 6,
            },
            validators: [isAlphanumeric('Location')],
          },
          birthday: {
            info: {
              label: 'Birthday',
              type: 'birthday',
            },
            // value: '',
            value: new Date().toISOString().substr(0, 10),
            columns: {
              md: 3,
            },
            validators: [],
          },
          gender: {
            info: {
              label: 'Gender',
              type: 'select',
              options: ['Male', 'Female', 'Other'],
            },
            value: '',
            columns: {
              md: 3,
            },
            items: ['Male', 'Female', 'Other'],
            validators: [],
          },
          description: {
            info: {
              label: 'Description',
              type: 'textarea',
            },
            value: '',
            columns: {
              md: 6,
            },
            validators: [],
          },
        },
        contact: {
          email: {
            info: {
              label: 'Email',
              type: 'textfield',
            },
            readOnly: true,
            value: '',
            columns: {
              md: 6,
            },
            validators: [isRequired('Email'), isEmail('Email')],
            edit: true,
          },
          // confirmEmail: {
          //   info: {
          //     label: 'Confirm Email',
          //     type: 'text',
          //   },
          //   value: '',
          //   columns: {
          //     md: 6,
          //   },
          //   validators: [
          //     isEmail('Confirm email'),

          //     (v) =>
          //       (v && v === this.inputFields.contact.email.value) ||
          //       `Fields must match.`,
          //   ],
          // },
          // password: {
          //   info: {
          //     label: 'Enter password',
          //     type: 'textfield',
          //     subType: 'password',
          //   },
          //   // show: false,
          //   value: '',
          //   columns: {
          //     md: 6,
          //   },
          //   validators: [isRequired('Old password')],
          // },
        },
        security: {
          password: {
            info: {
              label: 'Password',
              type: 'textfield',
              subType: 'password',
            },
            show: false,
            value: '',
            columns: {
              md: 6,
            },
            validators: [isRequired('Old password')],
          },
          newPassword: {
            info: {
              label: 'Confirm password',
              type: 'textfield',
              subType: 'password',
            },
            show: false,
            value: '',
            columns: {
              md: 6,
            },
            validators: [isRequired('New password')],
          },
        },
      },
    };
  },
  methods: {
    manageDiscordAccount() {
      if (this.discordLinked) {
        this.showDelinkDialog = true;
      } else {
        this.linkSocialDiscordAccount();
      }
    },

    async linkSocialDiscordAccount() {
      const state = await this.$axios.$get(`/social/discord/state`);

      const stringified = qs.stringify(this.redirectUriData);
      const uri = this.baseURL.concat(`?${stringified}&state=${state}`);
      const options = Object.entries(this.windowOptions).reduce(
        (output, [key, val]) => {
          output = output.concat(`${key}=${val},`);
          return output;
        },
        ''
      );

      if (!_window || _window.closed) {
        _window = window.open(uri, 'discord', options);
      } else {
        _window.focus();
      }
    },

    async delinkDiscordSocialAccount() {
      this.showDelinkDialog = false;
      try {
        const resp = (await this.$axios.patch('/social/discord')).data;
        this.discordLinked = !!resp.discord_id;
        this.info.discord_id = resp.discord_id;
        this.$toast.success('De-linked Discord Account.', {
          position: 'top-center',
        });
      } catch (err) {
        console.log(err);
      }
    },

    reset() {
      this.inputFields[this.selectedTab].forEach((input) => (input.value = ''));
    },

    revertFieldsOnError() {
      for (let key of this.info) {
        const fields = this.inputFields[this.selectedTab];
        const _key = camelCase(key);
        if (fields.hasOwnProperty(_key)) {
          fields[_key].value = this.info[key];
        }
      }
    },

    async changeUsername() {
      const username = this.info.username;

      try {
        const resp = (
          await this.$axios.patch(`/users/update-username`, { username })
        ).data;

        console.log(resp);

        this.info.username = resp.username;

        this.$auth.setUser(
          Object.assign(cloneDeep(this.$auth.user), { username: resp.username })
        );

        this.defaultUsername = resp.username;
        this.editName = false;

        this.$toast.success('Changes saved.', { position: 'top-center' });
      } catch (err) {
        this.info.username = this.defaultUsername;
        this.editName = false;
        // this.$toast.show(err.response.data.message, {
        //   position: 'top-center',
        //   duration: 5000,
        // });
      }
    },

    resetUsername() {
      this.info.username = this.defaultUsername;
      this.editName = false;
    },

    async updateAvatarImage(url) {
      try {
        const { avatar } = (
          await this.$axios.patch('/users/update', { avatar: url })
        ).data;

        this.$auth.setUser(
          Object.assign(cloneDeep(this.$auth.user), { avatar })
        );

        this.info.avatar = avatar;

        this.$toast.success('Updated avatar.', { position: 'top-center' });
      } catch (err) {
        console.log(err);
        const message = err.response.datga.message || err.message;
        this.$toast.error(message, { position: 'top-center' });
      }
    },

    assignInitalValuesToFields(item) {
      this.inputFields.personal.firstName.value = item.first_name;
      this.inputFields.personal.lastName.value = item.last_name;
      this.inputFields.personal.location.value = item.location;
      this.inputFields.personal.birthday.value = new Date(item.birthday)
        .toISOString()
        .substr(0, 10);
      this.inputFields.personal.gender.value = item.gender;
      this.inputFields.personal.description.value = item.description;
      this.inputFields.contact.email.value = item.email;
    },

    async submit(data) {
      const endpoints = {
        personal: 'update',
        contact: `update/contact/${data.code}`,
        security: 'password-reset',
      };

      let fields = this.inputFields[this.selectedTab];
      let payload = Object.entries(fields).reduce((output, [key, item]) => {
        const k = snakeCase(key);
        if (item.value !== this.info[k]) output[snakeCase(k)] = item.value;
        return output;
      }, {});

      if (this.isContact) {
        Object.assign(payload, { email: data.email });
      }

      if (this.isSecurity) {
        Object.assign(payload, { type: 'change', email: this.info.email });
      }

      try {
        const results = (
          await this.$axios.patch(
            `/users/${endpoints[this.selectedTab]}`,
            payload
          )
        ).data;

        if (this.isPersonal) {
          Object.entries(results).forEach(([key, value]) => {
            this.info[key] = value;
          });
        }

        if (this.isContact) {
          if (results.email) {
            fields.email = results.email;
            this.info.email = results.email;
          }
          fields.confirmEmail.value = '';
          fields.password.value = '';
        }

        this.$toast.success('Saved changes.', {
          position: 'top-center',
          icon: 'check',
          duration: 5000,
        });
      } catch (err) {
        console.log(err);
        this.revertFieldsOnError();
        const message = err.response.data.message || err.message;
        this.$toast.error(message, { position: 'top-center' });
      }
    },
  },

  computed: {
    hasChanged() {
      const fields = this.inputFields[this.selectedTab];
      return Object.entries(fields).some(
        ([key, item]) => item.value && item.value !== this.info[snakeCase(key)]
      );
    },

    selectedTab() {
      return this.tabs[this.tab];
    },

    isDisabled() {
      return !(this.hasChanged && this.valid[this.selectedTab]);
    },

    isUsernameButtonDisabled() {
      return !this.usernameValid || this.info.username === this.defaultUsername;
    },

    isPersonal() {
      return this.selectedTab === 'personal';
    },

    isContact() {
      return this.selectedTab === 'contact';
    },

    isSecurity() {
      return this.selectedTab === 'security';
    },

    discordButtonText() {
      return this.discordLinked
        ? 'De-Link Discord Account'
        : 'Link Discord Account';
    },

    allowUserToDeleteAccount() {
      return this.$store.getters[settings.getters.SETTINGS_VALUES](
        'allowUsersToDeleteAccount'
      );
    },

    enableSocialAuthentication() {
      return this.$store.getters[settings.getters.SETTINGS_VALUES](
        'enableSocialAuthentication'
      );
    },

    canUpload() {
      return this.$auth.hasScope([
        [this.$permissions.ADD_ALL_MEDIA],
        [this.$permissions.ADD_OWN_MEDIA],
      ]);
    },

    canView() {
      return this.$auth.hasScope([
        [this.$permissions.VIEW_ALL_MEDIA],
        [this.$permissions.VIEW_OWN_MEDIA],
      ]);
    },

    enableMediaDialog() {
      return this.$auth.loggedIn && (this.canUpload || this.canView);
    },

    isValid: {
      get() {
        return this.valid[this.selectedTab];
      },
      set(val) {
        this.valid[this.selectedTab] = val;
      },
    },
  },
};
</script>

<style lang="scss">
.input-username {
  input {
    max-height: 70px !important;
  }
}

.profile-banner {
  display: flex;
  align-items: center;
}

.bottom-gradient {
  background-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.4) 0%,
    transparent 72px
  );
}
</style>

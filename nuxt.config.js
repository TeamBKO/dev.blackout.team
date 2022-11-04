import colors from 'vuetify/es5/util/colors';

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Blackout Gaming Community',
    title: 'Blackout',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/main.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/permissions.js',
    '~/plugins/settings.js',
    // { src: '~/plugins/vueMessages.js', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/dayjs',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/toast',
    '@nuxtjs/recaptcha',
    'nuxt-socket-io',
    'nuxt-route-meta',
  ],

  io: {
    autoConnect: false,
    sockets: [
      {
        name: 'main',
        url: 'http://localhost:5000',
      },
    ],
  },

  recaptcha: {
    version: 2,
    siteKey: '6LeMXSYTAAAAAH4mKMnph1jHnepNhX9O4bGk_Jjs',
  },

  dayjs: {
    locales: ['en'],
    defaultLocale: 'en',
    plugins: [
      'isToday',
      'isSameOrBefore',
      'isSameOrAfter',
      'isBetween',
      'weekday',
      'weekOfYear',
      'advancedFormat',
    ],
  },

  toast: {
    duration: 1500,
    singleton: true,
    // theme: 'primary-theme',
    position: 'bottom-center',
    action: {
      text: 'Close',
      onClick: (e, toastObject) => toastObject.goAway(0),
    },
    iconPack: 'mdi',
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: 'http://localhost:5000/api',
  },

  auth: {
    redirect: {
      login: '/',
      home: '/',
      callback: '/',
    },
    strategies: {
      bko: {
        scheme: '~/schemes/bko',
        clientId: '689512721598775339',
        codeChallengeMethod: '',
        token: {
          property: 'access_token',
          maxAge: 900,
          global: true,
        },
        refreshToken: {
          property: 'refresh_token',
          data: 'refresh_token',
          maxAge: 60 * 60 * 24 * 7,
        },
        user: {
          property: 'user',
          // autoFetch: false,
        },
        scope: ['identify', 'email'],
        redirectUri: `http://localhost:3000`,
        logoutRedirectUri: null,
        endpoints: {
          logout: { url: '/auth/logout', method: 'post' },
          user: { url: '/auth/user', method: 'get' },
          refresh: { url: '/auth/refresh', method: 'post' },
        },
      },

      local: {
        scheme: 'refresh',
        token: {
          property: 'access_token',
          maxAge: 900,
          global: true,
        },
        refreshToken: {
          property: 'refresh_token',
          data: 'refresh_token',
          maxAge: 60 * 60 * 24 * 7,
        },
        user: {
          property: 'user',
        },
        endpoints: {
          login: { url: '/auth/login', method: 'post' },
          refresh: { url: '/auth/refresh', method: 'post' },
          logout: { url: '/auth/logout', method: 'post' },
          user: { url: '/auth/user', method: 'get' },
        },
      },
    },
    plugins: [{ src: '~/plugins/hasScope.js' }, '~/plugins/onErrorCodes.js'],
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vuetify'],
    babel: {
      plugins: [['@babel/plugin-proposal-private-methods', { loose: true }]],
    },
  },
};

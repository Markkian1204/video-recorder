import colors from 'vuetify/es5/util/colors'

export default {
  ssr: false,

  head: {
    titleTemplate: '%s - Video Recorder',
    title: 'Video Recorder',
    htmlAttrs: { lang: 'en' },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Detect colors in real time using your device camera.' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  css: [],

  plugins: [],

  components: true,

  buildModules: ['@nuxtjs/vuetify'],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  axios: {
    baseURL: '/'
  },

  auth: {
    redirect: {
      login: '/welcome',              // Splash or welcome screen
      logout: '/welcome',             // After logout
      callback: '/callback',          // Auth0 callback URL
      home: '/home'                   // After successful login
    },
    cookie: {
      options: {
        secure: true,
        domain: '.vercel.app'         // Important for Vercel deployment
      }
    },
    strategies: {
      auth0: {
        domain: process.env.AUTH0_DOMAIN,
        clientId: process.env.AUTH0_CLIENT_ID,
        audience: '',
        redirectUri: process.env.AUTH0_REDIRECT_URI,
        logoutRedirectUri: process.env.AUTH0_LOGOUT_REDIRECT_URI,
        scope: ['openid', 'profile', 'email']
      }
    }
  },

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
          success: colors.green.accent3
        }
      }
    }
  },

  build: {},

  router: {
    middleware: [] // Add ['auth'] if you want to protect all routes by default
  }
}

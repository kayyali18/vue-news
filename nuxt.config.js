const pkg = require('./package')

module.exports = {
  mode: 'spa',
  router: {
    middleware: 'check-auth'
  },

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          '//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons'
      }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '	#ffbf00', height: '10px' },

  /*
  ** Global CSS
  */
  css: [
    {
      src: 'vue-material/dist/vue-material.min.css',
      lang: 'css'
    },
    {
      src: '~/assets/theme.scss',
      lang: 'scss'
    }
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '@/plugins/vue-material' },
    {
      src: '@/plugins/axios'
    },
    { src: '@/plugins/firestore' }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/proxy'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    credentials: true,
    proxy: true
  },
  /*
  ** Proxy module configuration
  * PathRewrite is a regex to select string
  * Sets it to empty string
  * because value as proxy is added to target,
  * we just wanna rename target to /api
  */
  proxy: {
    '/api': {
      target: 'https://newsapi.org/v2/',
      pathRewrite: { '^/api/': '' }
    },
    '/register/': {
      target:
        'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyD_-MD5xNRniFYwX-ofogvRZViz7XJQXoI',
      pathRewrite: { '^/register/': '' }
    },
    '/login/': {
      target:
        'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyD_-MD5xNRniFYwX-ofogvRZViz7XJQXoI',

      pathRewrite: { '^/login/': '' }
    }
  },
  /*
  ** Env configuration
  */
  env: {
    NEWS_API_KEY: '9b7378bf37a34c69b467de2a09627262'
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {}
  }
}

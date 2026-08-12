// This nameless function has access to context obj
// {$axios} works because it is registered in our modules
// in nuxt.config.js

export default function({ $axios }) {
  $axios.onRequest(config => {
    config.headers.common['Authorization'] = process.env.NEWS_API_KEY
  })
}

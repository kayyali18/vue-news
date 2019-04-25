<template>
  <main>
    <p>The Thinker</p>
    <ul v-for="headline in headlines" :key="headline.id">
      <li>{{headline}}</li>
    </ul>
  </main>
</template>


<script>
export default {
  // Has access to context object
  async asyncData({ app }) {
    const topHeadlines = await app.$axios.$get('/api/top-headlines?country=us')

    return { headlines: topHeadlines.articles }
  }
}
</script>

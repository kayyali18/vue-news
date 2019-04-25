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
    const topHeadlines = await app.$axios.$get(
      'https://newsapi.org/v2/top-headlines?country=us'
    )

    return { headlines: topHeadlines.articles }
  }
}
</script>

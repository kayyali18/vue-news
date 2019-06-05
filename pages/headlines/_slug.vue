<template>
  <div class="pages-layout md-layout md-alignment-center">

    <!-- Headline Markup -->
    <md-card class="md-layout-item md-size-75 md-small-size-80 md-xsmall-size-100">
      <md-card-media md-ratio="16:9">
        <img :src="headline.urlToImage" :alt="headline.title">
      </md-card-media>

      <md-card-header>
        <div class="md-title">
          <a :href="headline.url" target="_blank">{{headline.title}}</a>
        </div>

        <div>
          {{headline.source.name}}
          <md-icon>book</md-icon>
        </div>

        <span class="md-subhead">
          {{headline.author}}
          <md-icon>face</md-icon>
        </span>
      </md-card-header>

    <md-card-content>{{headline.content}}</md-card-content>
    </md-card>

    <!-- Back Button -->
    <md-button class="md-fab md-fab-bottom-right md-fixed md-primary" @click="$router.go(-1)">
      <md-icon>arrow_back</md-icon>
    </md-button>
  </div>
</template>

<script>
export default {
  async fetch({ store, params }) {
    await store.dispatch('loadHeadline', params.slug)
  },
  computed: {
    headline() {
      return this.$store.getters.headline
    }
  }
}
</script>

<style lang="scss">
.pages-layout {
  margin: 5em 0;

  md-card-media {
    height: 300px;
  }
}
</style>

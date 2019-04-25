<template>
  <main class="md-layout md-alignment-center landing-page">
    <!-- App Content -->

    <div class="md-layout-item md-size-95">
      <md-content class="md-layout md-gutter gutter">
        <ul v-for="headline in headlines" :key="headline.id" class="md-layout-item md-large-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100">
          <md-card class="md-card" md-with-hover>
            <md-ripple>

              <md-card-media md-ratio="16:9">
                <img :src="headline.urlToImage" :alt="headline.title">
              </md-card-media>

              <md-card-header>
                <div class="md-title">
                  <a :href="headline.url" target="_blank">{{headline.title}}</a>
                </div>

                <div>
                  {{headline.source.name}}
                  <md-icon class="small-icon">book</md-icon>
                </div>

                <div class="md-subhead" v-if="headline.author">
                  {{headline.author}}
                  <md-icon class="small-icon">face</md-icon>
                </div>

                <div class="md-subhead">
                  {{headline.publishedAt}}
                  <md-icon class="small-icon">alarm</md-icon>
                </div>
              </md-card-header>

              <md-card-content>
                {{headline.description}}
              </md-card-content>

              <md-card-actions>
                <md-button class="md-icon-button">
                  <md-icon>bookmark</md-icon>
                </md-button>
                <md-button class="md-icon-button">
                  <md-icon>message</md-icon>
                </md-button>
              </md-card-actions>

            </md-ripple>
          </md-card>
        </ul>
      </md-content>
    </div>
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

<style lang="scss">
@import '~assets/theme.scss';

.landing-page {
  .gutter {
    /* background: $gold; */
    padding: 1rem;
  }

  .md-card {
    margin-top: 1em;
  }

  .small-icon {
    font-size: 18px !important;
  }
}
</style>

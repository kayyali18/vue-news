<template>
  <main class="md-layout md-alignment-center landing-page">
    <!-- Top Navigation -->
    <md-toolbar class="fixed-toolbar" elevation="1">
      <md-button @click="showLeftSidepanel = true" class="md-icon-button">
        <md-icon>menu</md-icon>
      </md-button>

      <nuxt-link class="md-primary md-title header" to="/">
        <h1>The Thinker</h1>
      </nuxt-link>

      <div class="md-toolbar-section-end">
        <template v-if="isAuthenticated">
          <md-button>
            <md-avatar><img :src="user.avatar" :alt="user.email"></md-avatar>
            {{user.email}}
          </md-button>
          <md-button @click="logoutUser">Logout</md-button>
        </template>

        <template v-else>
        <md-button @click="$router.push('/login')">Login</md-button>
        <md-button @click="$router.push('/register')">Register</md-button>
        </template>
        <md-button class="md-accent" @click="showRightSidepanel = true">
          Categories
        </md-button>
      </div>
    </md-toolbar>

    <!-- Personal News Feed (Left - Drawer) -->
    <md-drawer md-fixed :md-active.sync="showLeftSidepanel">
      <md-toolbar md-elevation="1">
        <span class="md-title">Personal Feed</span>
      </md-toolbar>

      <md-progress-bar v-if="loading" md-mode="indeterminate"></md-progress-bar>

      <md-field class="side-padding">
        <label class="side-padding" for="country">Country</label>
        <md-select @input="changeCountry" :value="country" name="country" id="country">
          <md-option value="ae">Arabia</md-option>
          <md-option value="ca">Canada</md-option>
          <md-option value="gb">United Kingdom</md-option>
          <md-option value="us">United States</md-option>
        </md-select>
      </md-field>


      <!-- Feed Content -->
      <md-list class="md-triple-line" v-for="headline in feed" :key="headline.id">
        <md-list-item>
          <md-avatar><img :src="headline.urlToImage" :alt="headline.title"></md-avatar>

          <div class="md-list-item-text">
            <span><a :href="headline.url" target="_blank">{{headline.title}}</a></span>
            <span>{{headline.source.name}}</span>
            <span>View Comments</span>
          </div>

          <md-button class="md-icon-button md-list-action"><md-icon class="md-accent">delete</md-icon></md-button>
        </md-list-item>
        <md-divider class="md-inset"></md-divider>
      </md-list>
    </md-drawer>

    <!-- News Categories (Right - Drawer)  -->

    <md-drawer class="md-right" md-fixed :md-active.sync="showRightSidepanel">
      <md-toolbar :md-elevation="1">
        <span class="md-title">News Categories</span>
      </md-toolbar>

      <md-progress-bar v-if="loading" md-mode="indeterminate"></md-progress-bar>

      <md-list>
        <md-subheader class="md-primary">Categories</md-subheader>

        <md-list-item v-for="newsCategory in newsCategories" :key="newsCategory.name" @click="loadCategory(newsCategory.path)">
          <md-icon :class="newsCategory.path == category ? 'md-primary' : ''">{{newsCategory.icon}}</md-icon>
          <span class="md-list-item-text">{{newsCategory.name}}</span>
        </md-list-item>
      </md-list>
    </md-drawer>

    <!-- Headlines -->

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
                <md-button @click="addHeadlineToFeed(headline)" class="md-icon-button">
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
  data: () => ({
    showLeftSidepanel: false,
    showRightSidepanel: false,
    newsCategories: [
      { name: 'Top Headlines', path: '', icon: 'today' },
      { name: 'Technology', path: 'technology', icon: 'keyboard' },
      { name: 'Business', path: 'business', icon: 'business_center' },
      { name: 'Entertainment', path: 'entertainment', icon: 'weekend' },
      { name: 'Health', path: 'health', icon: 'fastfood' },
      { name: 'Science', path: 'science', icon: 'fingerprint' },
      { name: 'Sports', path: 'sports', icon: 'pool' }
    ]
  }),
  // Has access to context object
  async fetch({ store }) {
    await store.dispatch(
      'loadHeadlines',
      `/api/top-headlines?country=${store.state.country}&category=${
        store.state.category
      }`
    )

    await store.dispatch('loadUserFeed')
  },
  watch: {
    async country() {
      await this.$store.dispatch(
        'loadHeadlines',
        `/api/top-headlines?country=${this.country}&category=${this.category}`
      )
    }
  },
  computed: {
    category() {
      return this.$store.getters.category
    },
    country() {
      return this.$store.getters.country
    },
    feed() {
      return this.$store.getters.feed
    },
    headlines() {
      return this.$store.getters.headlines
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    },
    loading() {
      return this.$store.getters.loading
    },
    user() {
      return this.$store.getters.user
    }
  },
  methods: {
    async addHeadlineToFeed(headline) {
      if (this.user) {
        await this.$store.dispatch('addHeadlineToFeed', headline)
      }
    },
    changeCountry(country) {
      this.$store.commit('setCountry', country)
    },
    async loadCategory(category) {
      this.$store.commit('setCategory', category)
      await this.$store.dispatch(
        'loadHeadlines',
        `/api/top-headlines?country=${this.country}&category=${this.category}`
      )
    },
    logoutUser() {
      this.$store.dispatch('logoutUser')
    }
  }
}
</script>

<style lang="scss">
@import '~assets/theme.scss';

.landing-page {
  /* background-color: $background-gray; */

  .header {
    height: 100px;
    display: flex;
    align-items: center;

    h1 {
      color: $deep-orange;
      font-family: 'Tangerine', cursive;
      font-size: calc(56px + 0.3vw);
      margin: 0;
    }
  }
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

  .fixed-toolbar {
    position: sticky;
    top: 0;

    z-index: 4;
  }

  .side-padding {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>

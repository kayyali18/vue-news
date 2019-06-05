import md5 from 'md5'
import slugify from 'slugify'
import db from '@/plugins/firestore'
import { saveUserData, clearUserData } from '@/utils/'

export const state = () => ({
  category: '',
  country: 'us',
  feed: [],
  headline: null,
  headlines: [],
  loading: false,
  token: '',
  user: null
})

// ------- Mutations -------

export const mutations = {
  clearFeed: state => (state.feed = []),
  clearToken: state => (state.token = ''),
  clearUser: state => (state.user = null),
  setCategory(state, category) {
    state.category = category
  },
  setCountry(state, country) {
    state.country = country
  },
  setFeed(state, headlines) {
    state.feed = [...headlines]
  },
  setHeadline(state, headline) {
    state.headline = headline
  },
  setHeadlines(state, headlines) {
    state.headlines = headlines
  },
  setLoading(state, loading) {
    state.loading = loading
  },
  setToken(state, token) {
    state.token = token
  },
  setUser(state, user) {
    state.user = user
  },
  pushToFeed(state, headline) {
    state.feed.push(headline)
  }
}

// ------- Actions -------

export const actions = {
  async addHeadlineToFeed({ state }, headline) {
    const feedRef = db
      .collection(`users/${state.user.email}/feed`)
      .doc(headline.title)

    await feedRef.set(headline)
  },
  async authenticateUser({ commit }, userPayload) {
    try {
      // Loading
      commit('setLoading', true)

      // Register User
      const authUserData = await this.$axios.$post(`/${userPayload.action}/`, {
        email: userPayload.email,
        password: userPayload.password,
        returnSecureToken: userPayload.returnSecureToken
      })

      let user

      if (userPayload.action === 'register') {
        // Get user avatar by hashing their email
        const avatar = `http://gravatar.com/avatar/${md5(
          authUserData.email
        )}?d=identicon`

        user = { email: authUserData.email, avatar }
        // Put user in Database
        await db
          .collection('users')
          .doc(userPayload.email)
          .set(user)
      } else {
        // Get user credentials
        const loginRef = db.collection('users').doc(userPayload.email)
        const loggedInUser = await loginRef.get()

        // Set user to logged in data
        user = loggedInUser.data()
      }

      // Create user obj and commit
      commit('setUser', user)

      // Set token
      commit('setToken', authUserData.idToken)

      // Loading
      commit('setLoading', false)

      // Save user
      saveUserData(authUserData, user)
    } catch (error) {
      console.error(error)

      // Loading
      commit('setLoading', false)
    }
  },
  async loadHeadline({ commit }, headlineSlug) {
    const headlineRef = db.collection('headlines').doc(headlineSlug)

    await headlineRef.get().then(doc => {
      if (doc.exists) {
        const headline = doc.data()
        commit('setHeadline', headline)
      }
    })
  },
  async loadHeadlines({ commit }, apiUrl) {
    commit('setLoading', true)
    const { articles } = await this.$axios.$get(apiUrl)
    const headlines = articles.map(article => {
      const slug = slugify(article.title, {
        replacement: '-',
        remove: /[^a-zA-Z0-9 -]/g,
        lower: true
      })
      const headline = { ...article, slug }
      return headline
    })
    commit('setLoading', false)
    commit('setHeadlines', headlines)
  },
  async loadUserFeed({ state, commit }) {
    // Check if user exists first
    if (state.user) {
      const feedRef = db.collection(`users/${state.user.email}/feed`)

      await feedRef.onSnapshot(querySnapshot => {
        let headlines = []
        querySnapshot.forEach(doc => {
          // commit('pushToFeed', doc.data())
          headlines.push(doc.data())
          commit('setFeed', headlines)
        })

        if (querySnapshot.empty) {
          headlines = []
          commit('setFeed', headlines)
        }
      })
    }
  },
  logoutUser({ commit }) {
    commit('clearToken')
    commit('clearUser')
    commit('clearFeed')
    clearUserData()
  },
  async removeHeadlineFromFeed({ state }, headline) {
    const headlineRef = db
      .collection(`users/${state.user.email}/feed`)
      .doc(headline.title)

    await headlineRef.delete()
  },
  async saveHeadline(context, headline) {
    const headlineRef = db.collection('headlines').doc(headline.slug)

    let headlineId

    // Check if document exists with headline
    await headlineRef.get().then(doc => {
      if (doc.exists) {
        headlineId = doc.id
      }
    })

    if (!headlineId) {
      // Set in firestore
      await headlineRef.set(headline)
    }
  },
  async sendComment({ state, commit }, comment) {
    const commentsRef = db.collection(
      `headlines/${state.headline.slug}/comments`
    )

    commit('setLoading', true)
    await commentsRef.doc(comment.id).set(comment)
    await commentsRef.get().then(querySnapshot => {
      let comments = []
      let updatedHeadline
      querySnapshot.forEach(doc => {
        comments.push(doc.data())
        updatedHeadline = { ...state.headline, comments }
      })
      commit('setHeadline', updatedHeadline)
    })
    commit('setLoading', false)
  },
  setLogoutTimer({ dispatch }, interval) {
    // Logout user when token expires
    setTimeout(() => dispatch('logoutUser'), interval)
  }
}

// ------- Getters -------

export const getters = {
  category: state => state.category,
  country: state => state.country,
  feed: state => state.feed,
  headline: state => state.headline,
  headlines: state => state.headlines,
  isAuthenticated: state => !!state.token,
  loading: state => state.loading,
  user: state => state.user
}

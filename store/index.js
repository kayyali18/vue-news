import md5 from 'md5'
import db from '@/plugins/firestore'
import { saveUserData, clearUserData } from '@/utils/'

export const state = () => ({
  category: '',
  country: 'us',
  headlines: [],
  loading: false,
  token: '',
  user: null
})

// ------- Mutations -------

export const mutations = {
  clearToken: state => (state.token = ''),
  clearUser: state => (state.user = null),
  setCategory(state, category) {
    state.category = category
  },
  setCountry(state, country) {
    state.country = country
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
  }
}

// ------- Actions -------

export const actions = {
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
  async loadHeadlines({ commit }, apiUrl) {
    commit('setLoading', true)
    const { articles } = await this.$axios.$get(apiUrl)
    commit('setLoading', false)
    commit('setHeadlines', articles)
  },
  setLogoutTimer({ dispatch }, interval) {
    // Logout user when token expires
    setTimeout(() => dispatch('logoutUser'), interval)
  },
  logoutUser({ commit }) {
    commit('clearToken')
    commit('clearUser')
    clearUserData()
  }
}

// ------- Getters -------

export const getters = {
  category: state => state.category,
  country: state => state.country,
  headlines: state => state.headlines,
  isAuthenticated: state => !!state.token,
  loading: state => state.loading,
  user: state => state.user
}

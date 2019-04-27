export const state = () => ({
  category: '',
  country: 'us',
  headlines: [],
  loading: false,
  token: ''
})

// ------- Mutations -------

export const mutations = {
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
  }
}

// ------- Actions -------

export const actions = {
  async authenticateUser({ commit }, userPayload) {
    try {
      commit('setLoading', true)
      const authUserData = await this.$axios.$post('/register/', userPayload)
      commit('setToken', authUserData.idToken)
      commit('setLoading', false)
    } catch (error) {
      console.error(error)
      commit('setLoading', false)
    }
  },
  async loadHeadlines({ commit }, apiUrl) {
    commit('setLoading', true)
    const { articles } = await this.$axios.$get(apiUrl)
    commit('setLoading', false)
    commit('setHeadlines', articles)
  }
}

// ------- Getters -------

export const getters = {
  category: state => state.category,
  country: state => state.country,
  headlines: state => state.headlines,
  isAuthenticated: state => !!state.token,
  loading: state => state.loading
}

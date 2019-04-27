export const state = () => ({
  headlines: [],
  category: '',
  loading: false
})

// ------- Mutations -------

export const mutations = {
  setCategory(state, category) {
    state.category = category
  },
  setHeadlines(state, headlines) {
    state.headlines = headlines
  },
  setLoading(state, loading) {
    state.loading = loading
  }
}

// ------- Actions -------

export const actions = {
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
  headlines: state => state.headlines,
  loading: state => state.loading
}

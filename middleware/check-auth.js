// Executed before every page entry

import { getUserFromCookie, getUserFromLocalStorage } from '@/utils'

/**
 *
 * @param {object} context The context object available from Nuxt by default
 *
 * Commits appropriate user credentials to store
 */

// Has access to context
export default function({ store, req }) {
  // If something taking place on server and there is no req
  if (process.server && !req) return

  // If something taking place on server

  // Get user from cookie from request
  // Else get from local storage
  const userData = process.server
    ? getUserFromCookie(req)
    : getUserFromLocalStorage()

  if (!userData) return
  else if (!userData.jwt || Date.now() > userData.expiresIn) {
    store.commit('clearToken')
    store.commit('clearUser')
  } else {
    store.commit('setToken', userData.jwt)
    store.commit('setUser', { email: userData.user, avatar: userData.avatar })
    const timeToLogout = userData.expiresIn - Date.now()
    store.dispatch('setLogoutTimer', timeToLogout)
  }
}

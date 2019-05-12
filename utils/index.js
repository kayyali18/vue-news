import Cookie from 'js-cookie'

/**
 *
 * @param {object} authUserData The authUserData from firebase
 * @param {object} user The user POJO with it's creds and values
 */

export const saveUserData = ({ idToken, expiresIn }, { email, avatar }) => {
  // Get expiration in seconds
  const tokenExpiration = Date.now() + expiresIn * 1000

  // Save data to localStorage
  localStorage.setItem('jwt', idToken)
  localStorage.setItem('expiresIn', tokenExpiration)
  localStorage.setItem('user', email)
  localStorage.setItem('avatar', avatar)

  // Set cookies!
  Cookie.set('jwt', idToken)
  Cookie.set('expiresIn', tokenExpiration)
  Cookie.set('user', email)
  Cookie.set('avatar', avatar)
}

/**
 *
 * @param {object} req Server request on page load
 *
 * @return {object}   Returns POJO containing all headers and user creds
 */

export const getUserFromCookie = req => {
  // No cookie header? return
  if (!req.headers.cookie) return

  // Get jwt from the header if it starts with jwt
  const jwtCookie = req.headers.cookie
    .split(';')
    .find(c => c.trim().startsWith('jwt='))

  const expiresInCookie = req.headers.cookie
    .split(';')
    .find(c => c.trim().startsWith('expiresIn'))

  const userCookie = req.headers.cookie
    .split(';')
    .find(c => c.trim().startsWith('user='))

  const avatarCookie = req.headers.cookie
    .split(';')
    .find(c => c.trim().startsWith('avatar='))

  // If 1 doesn't exist it's incomplete
  if (!jwtCookie || !expiresInCookie || !userCookie || !avatarCookie) return

  // Split by =
  const jwt = jwtCookie.split('=')[1]
  const expiresIn = expiresInCookie.split('=')[1]
  const user = userCookie.split('=')[1]
  const avatar = avatarCookie.split('=')[1]

  return { jwt, expiresIn, user, avatar }
}

export const getUserFromLocalStorage = () => {
  if (localStorage) {
    const jwt = localStorage.getItem('jwt')
    const expiresIn = localStorage.getItem('expiresIn')
    const user = localStorage.getItem('user')
    const avatar = localStorage.getItem('avatar')

    return { jwt, expiresIn, user, avatar }
  }
}

export const clearUserData = () => {
  if (!process.server) {
    localStorage.removeItem('jwt')
    localStorage.removeItem('expiresIn')
    localStorage.removeItem('user')
    localStorage.removeItem('avatar')
  }

  // If something taking place on server we can't access local storage but can remove cookies
  Cookie.remove('jwt')
  Cookie.remove('expiresIn')
  Cookie.remove('user')
  Cookie.remove('avatar')
}

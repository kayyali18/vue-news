import Cookie from 'js-cookie'

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

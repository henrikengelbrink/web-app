import auth0 from 'auth0-js'
import jwtDecode from 'jwt-decode'

const Cookie = process.client ? require('js-cookie') : undefined

export default (context, inject) => {
  inject('auth', new AuthService(context))
}

const authConfig = {
  DOMAIN: 'authkeeet.eu.auth0.com',
  CLIENT_ID: 'vb6queQy3UsCXSPhsOmWrqe4XWnyKCmp',
  AUDIENCE: 'https://management.service.keeet.io',
  REDIRECT_PATH: '/auth/callback'
}

class AuthService {
  constructor({ store }) {
    this.store = store
    this.webAuth = null

    if (process.client) {
      this.baseRedirectUri = window.location.origin + authConfig.REDIRECT_PATH
      this.webAuth = new auth0.WebAuth({
        domain: authConfig.DOMAIN,
        redirectUri: this.baseRedirectUri,
        clientID: authConfig.CLIENT_ID,
        responseType: 'id_token',
        scope: 'openid profile email',
        audience: authConfig.AUDIENCE
      })
    }
  }

  // Starts the user login flow
  login(redirectUrl) {
    this.webAuth.authorize({
      redirectUri: (redirectUrl) ? `${this.baseRedirectUri}?redirectUrl=${redirectUrl}` : this.baseRedirectUri
    })
  }

  // Handles the callback request from Auth0
  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.webAuth.parseHash((err, authResult) => {
        if (err) {
          reject(err)
        } else {
          this.localLogin(authResult)
          resolve(authResult.idToken)
        }
      })
    })
  }

  renewTokens() {
    return new Promise((resolve, reject) => {
      if (process.server) {
        reject(Error('checkSession can only be executed on client-side'))
        return
      }
      this.webAuth.checkSession({}, (err, authResult) => {
        if (err) {
          reject(err)
        } else {
          this.localLogin(authResult)
          resolve(authResult)
        }
      })
    })
  }

  renewTokensOrRedirectToLogin(redirect, redirectUrl) {
    return new Promise((resolve, reject) => {
      this.renewTokens().then(resolve).catch(() => {
        redirect(`/auth/login?redirectUrl=${encodeURI(redirectUrl)}`)
        reject(Error('server side request (no checkSession usable) OR third party cookies disabled (no silent login)'))
      })
    })
  }

  localLogin(authResult) {
    Cookie.set('auth', authResult.idToken)
    this.store.commit('setAccessToken', authResult.idToken)
  }

  logOut() {
    this.store.commit('setAccessToken', null)
    Cookie.remove('auth')
    this.webAuth.logout({
      returnTo: window.location.origin
    })
  }

  isAuthenticated() {
    const accessToken = this.store.state.accessToken
    return (
      accessToken !== null &&
      Date.now() < jwtDecode(accessToken).exp * 1000
    )
  }
}
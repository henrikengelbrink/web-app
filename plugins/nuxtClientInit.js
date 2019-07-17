import { isAuthUrl, isExternalUrl } from '../utils/urlUtils'

export default (context) => {
  fetchUserIfLoggedIn(context)
  // TODO: enable again
  // window.setInterval(() => {
  //   fetchUserIfLoggedIn(context)
  // }, 10000)

  setCssVh()
  window.addEventListener('resize', setCssVh)
}

function setCssVh() {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

const SESSION_USER_ROLE = 'SESSION_USER_ROLE'

function fetchUserIfLoggedIn({ store, redirect, route, app: { $fetch, $auth } }) {
  if (!store.state.accessToken || isAuthUrl(route) || isExternalUrl(route)) {
    return
  }

  $fetch([{ name: 'USER', forced: true }]).then(() => {
    const { accessToken, user } = store.state
    const sessionUserRole = window.localStorage.getItem(SESSION_USER_ROLE)
    if (accessToken && user.role !== sessionUserRole) {
      window.localStorage.setItem(SESSION_USER_ROLE, user.role)
      $auth.renewTokens().catch(() => {
        redirect(`/auth/login?redirectUrl=${encodeURI(window.location.pathname)}`)
      })
    }
  })
}
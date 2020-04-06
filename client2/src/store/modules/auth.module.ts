import { Institution, User } from '@/api/SwaggerApi'
import { config } from '@/config'
import router, { AppRoute, navigationRoutes } from '@/router'
import { parseJwt } from '@/util'
import Api, { removeBearerToken, setBearerToken } from '@/api'
import Notification from '@/util/notification'
import { Actions, createMapper, Getters, Module, Mutations } from 'vuex-smart-module'
import { InstitutionType } from '@/models'

interface JwtData {
  roles: InstitutionType[];
  exp: number;
  [key: string]: any;
}

class AuthState {
  jwtToken: string | undefined = undefined
  jwtData: JwtData | undefined = undefined
  user: User | undefined = undefined
  institution: Institution | undefined = undefined
}

class AuthGetters extends Getters<AuthState> {
  isAuthenticated(): boolean {
    return !!this.state.jwtToken // add is valid check expire date
  }

  roles() {
    return this.state.jwtData?.roles || []
  }

  routes(): AppRoute[] {
    return navigationRoutes
      .filter(r => (config.showAllViews ||
        this.roles().some(a => r.meta?.navigationInfo?.authorities.includes(a))))
  }

  institutionUsers() {
    return this.state.institution?.users?.map(user => ({
      ...user,
      role: user.authorities?.length === 2 ? user.authorities[1].authority : '',
    }))
  }
}

class AuthMutations extends Mutations<AuthState> {
  loginSuccess(jwtToken: string) {
    this.state.jwtToken = jwtToken
    this.state.jwtData = parseJwt(jwtToken)
    setBearerToken(jwtToken)
  }

  logoutSuccess() {
    this.state.jwtToken = undefined
    this.state.jwtData = undefined
    removeBearerToken()
  }

  setAuthenticatedInstitution(institution: Institution) {
    this.state.institution = institution
  }

  setUser(user: User) {
    this.state.user = user
  }
}

class AuthActions extends Actions<AuthState, AuthGetters, AuthMutations, AuthActions> {
  async login(payload: { username: string; password: string }) {
    // # TODO loading animation, encrypt jwt
    const token: string | undefined = (await Api.auth.signInUserUsingPost({
      username: payload.username,
      password: payload.password,
    })).jwtToken
    if (token) {
      this.commit('loginSuccess', token)
      this.dispatch('getAuthenticatedInstitution')
      this.dispatch('getAuthenticatedUser')
      window.localStorage.setItem('token', '' + token)
      router.push({ name: 'app' })
    }
  }

  async logout() {
    // # TODO logout request
    this.commit('logoutSuccess')
    window.localStorage.clear()
    // # TODO empty state
    router.push({ name: 'login' })
  }

  async init() {
    const jwtToken = window.localStorage.token
    if (jwtToken) {
      const decoded = parseJwt(jwtToken)
      const now = new Date()
      const tokenExpireDate = new Date(decoded.exp * 1000)
      if (tokenExpireDate > now) {
        this.commit('loginSuccess', jwtToken)
        this.dispatch('getAuthenticatedInstitution')
        this.dispatch('getAuthenticatedUser')
      } else {
        // this.commit('tokenExpired')
        const notification = {
          message: 'Session Expired',
          description: 'Ihre Sitzung ist abgelaufen',
        }
        Notification.info(notification)
        window.localStorage.clear()
      }
    }
  }

  async getAuthenticatedInstitution() {
    try {
      const institution = await Api.auth.getInstitutionUsingGet()
      this.commit('setAuthenticatedInstitution', institution)
    } catch (err) {
      Notification.error({
        message: '',
        description: 'Institution konnte nicht geladen werden',
      })
    }
  }

  async getAuthenticatedUser() {
    try {
      const user = await Api.auth.currentUserUsingGet()
      this.commit('setUser', user)
    } catch (err) {
      Notification.error({
        message: '',
        description: 'Nutzer konnte nicht geladen werden',
      })
    }
  }
}

export const authModule = new Module({
  state: AuthState,
  getters: AuthGetters,
  mutations: AuthMutations,
  actions: AuthActions,
})

export const authMapper = createMapper(authModule)
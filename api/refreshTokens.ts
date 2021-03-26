import AsyncStorage from '@react-native-async-storage/async-storage'
import RefreshTokenBody from './bodies/RefreshTokenBody'
import AuthResponse from './responses/AuthResponse'

import { err } from '../logging/logger'
import call from './call'
import store from '../redux/store'
import { setAccessTokenAction, setRefreshTokenAction } from '../redux/actions/tokenActions'
import history from '../routing/history'

export const refreshTokens = async (): Promise<boolean> => {
  try {
    const authResponse = await call<RefreshTokenBody>({
      endpoint: '/auth/refresh-token',
      method: 'POST',
      body: {
        refresh_token: await AsyncStorage.getItem('refresh_token'),
      },
    })

    if (authResponse.status === 200) {
      const authData = await authResponse.json()
      const auth = (authData as AuthResponse)
      const {
        access_token: accessToken,
        refresh_token: refreshToken,
      } = auth

      await AsyncStorage.setItem('access_token', accessToken)
      await AsyncStorage.setItem('refresh_token', refreshToken)
      store.dispatch(setAccessTokenAction(accessToken))
      store.dispatch(setRefreshTokenAction(refreshToken))

      return true
    }
  } catch (e) {
    console.error(e)
    err(e)
  }

  await AsyncStorage.clear()
  history.push('/login')

  return false
}

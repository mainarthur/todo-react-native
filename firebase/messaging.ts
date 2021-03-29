import messaging from '@react-native-firebase/messaging'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { requestFirebaseToken } from '../redux/actions/appActions'
import store from '../redux/store'
import { createAsyncAction } from '../redux/helpers'

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission()
  const enabled = (authStatus === messaging.AuthorizationStatus.AUTHORIZED
    || authStatus === messaging.AuthorizationStatus.PROVISIONAL)

  if (enabled) {
    const token = await messaging().getToken()
    if (!await AsyncStorage.getItem('token_sent')) {
      try {
        await createAsyncAction(store.dispatch, requestFirebaseToken({
          token,
        }))
        await AsyncStorage.setItem('token_sent', 'true')
        console.log(token)
      } catch (err) {
        console.log(err)
        await AsyncStorage.removeItem('token_sent')
      }
    }
  }
}

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage)
})

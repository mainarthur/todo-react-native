import messaging from '@react-native-firebase/messaging'

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission()
  const enabled = (authStatus === messaging.AuthorizationStatus.AUTHORIZED
    || authStatus === messaging.AuthorizationStatus.PROVISIONAL)

  if (enabled) {
    console.log('Authorization status:', authStatus)
    console.log('Token', messaging().getToken())
  }
}

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage)
})

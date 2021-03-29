import { createAction } from '../helpers'
import { AppAction } from '../constants'
import User from '../../models/User'
import UserPayload from '../types/payloads/UserPayload'
import FirebasePayload from '../types/payloads/FirebasePayload'

export const setUserAction = createAction<User>(AppAction.SET_USER)

export const requestUserAction = createAction<UserPayload>(AppAction.REQUEST_USER)
export const requestFirebaseToken = createAction<FirebasePayload>(AppAction.REQUEST_FIREBASE_TOKEN)

import {
  takeEvery,
} from 'redux-saga/effects'

import { api } from '../../api/api'
import Response from '../../api/Response'
import UserResponse from '../../api/responses/UserResponse'
import User from '../../models/User'
import { AppAction } from '../constants'
import AsyncAction from '../types/AsyncAction'
import FirebasePayload from '../types/payloads/FirebasePayload'
import UserPayload from '../types/payloads/UserPayload'

function* userRequested(action: AsyncAction<User, UserPayload>) {
  const { payload, next } = action

  try {
    const userResponse: UserResponse = yield api<UserResponse, {}>({
      endpoint: `/user${payload ? `?id=${payload.id}` : ''}`,
    })

    if (userResponse.status) {
      const { result: user } = userResponse

      next(null, user)
    } else {
      next(userResponse.error)
    }
  } catch (err) {
    console.log(err)
    next(err)
  }
}

function* tokenRequest(action: AsyncAction<{}, FirebasePayload>) {
  const {
    payload,
    next,
  } = action

  const tokenResponse: Response = yield api<Response, FirebasePayload>({
    endpoint: '/user/firebase',
    method: 'POST',
    body: payload,
  })

  if (tokenResponse.status) {
    next(null)
  } else {
    next(tokenResponse.error)
  }
}

function* watchApp() {
  yield takeEvery(AppAction.REQUEST_FIREBASE_TOKEN, tokenRequest)
  yield takeEvery(AppAction.REQUEST_USER, userRequested)
}

export default watchApp

import AsyncStorage from '@react-native-async-storage/async-storage'
import Request from './Request'

import { err } from '../logging/logger'

const API_URL: string = 'http://api.todolist.local'

export default async function call<B>(opts: Request<B>): Promise<ReturnType<typeof fetch>> {
  let {
    method, headers,
  } = opts

  const {
    endpoint: url, body,
  } = opts

  if (!method) {
    method = 'GET'
  }

  if (!headers) {
    headers = {}
  }
  const accessToken = await AsyncStorage.getItem('access_token')
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  try {
    const res = await fetch(`${API_URL}${url}`, {
      method: method.toUpperCase(),
      body: typeof body === 'object' ? JSON.stringify(body) : undefined,
      mode: 'cors',
      headers: {
        'Content-type': 'application/json',
        ...headers,
      },
    })

    return res
  } catch (e) {
    err(e)
    throw e
  }
}

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useHistory } from 'react-router'

import {
  Body,
  Container, Content, Text,
} from 'native-base'
import { io } from 'socket.io-client'

import { createAsyncAction } from './redux/helpers'
import { RootState } from './redux/reducers'
import User from './models/User'
import { requestUserAction, setUserAction } from './redux/actions/appActions'
import { setAccessTokenAction, setRefreshTokenAction } from './redux/actions/tokenActions'
import { ENDPOINT, initSocket } from './socket.io'

const App = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useSelector((state: RootState) => state.app)
  const { accessToken, refreshToken } = useSelector((state: RootState) => state.tokens)
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    if (accessToken === '' || refreshToken === '') {
      (async () => {
        const storageAccessToken = await AsyncStorage.getItem('access_token')
        const storageRefreshToken = await AsyncStorage.getItem('refresh_token')
        if (!storageAccessToken || !storageRefreshToken) {
          history.push('/login')
          return
        }
        dispatch(setAccessTokenAction(storageAccessToken))
        dispatch(setRefreshTokenAction(storageRefreshToken))
      })()
    }
  }, [accessToken, refreshToken, dispatch, history])

  useEffect(() => {
    if (!user || isLoading) {
      setIsLoading(true);
      (async () => {
        try {
          const loadedUser = await createAsyncAction<User>(dispatch, requestUserAction())
          setIsLoading(false)
          dispatch(setUserAction(loadedUser))
        } catch (err) {
          console.log(err)
        }
      })()
    }
  }, [user, dispatch, isLoading])

  useEffect(() => {
    const socket = io(ENDPOINT, {
      extraHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    initSocket(socket)
    return () => {
      socket.disconnect()
    }
  }, [accessToken])

  if (!user) {
    return (
      <Container>
        <Content>
          <Body>
            <Text>Loading</Text>
          </Body>
        </Content>
      </Container>
    )
  }

  return (
    <Container>
      <Content>
        <Text>{JSON.stringify(user)}</Text>
      </Content>
    </Container>
  )
}

export default App

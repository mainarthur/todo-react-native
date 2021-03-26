import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useHistory } from 'react-router'

import {
  Container, Content, Text,
} from 'native-base'

import { createAsyncAction } from './redux/helpers'
import ToDoAppBar from './common/ToDoAppBar/ToDoAppBar'
import { RootState } from './redux/reducers'
import User from './models/User'
import { requestUserAction, setUserAction } from './redux/actions/appActions'

const App = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useSelector((state: RootState) => state.app)
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    (async () => {
      if (await AsyncStorage.getItem('access_token') == null) {
        history.push('/login')
      }
    })()
  }, [])

  useEffect(() => {
    if (!user || isLoading) {
      setIsLoading(true);
      (async () => {
        try {
          const loadedUser = await createAsyncAction<User>(dispatch, requestUserAction())
          dispatch(setUserAction(loadedUser))
        } finally {
          setIsLoading(false)
        }
      })()
    }
  }, [user, dispatch])

  if (!user) {
    return (
      <Container>
        <Content contentContainerStyle={{ justifyContent: 'center', flex: 1 }}>
          <Text>Loading</Text>
        </Content>
      </Container>
    )
  }

  return (
    <Container>
      <ToDoAppBar />
      <Content>
        <Text>{JSON.stringify(user)}</Text>
      </Content>
    </Container>
  )
}

export default App

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  Container, Content, Text,
} from 'native-base'

import ToDoAppBar from './common/ToDoAppBar/ToDoAppBar'
import { RootState } from './redux/reducers'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useHistory } from 'react-router'

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

  if (!user) {
    return null
  }

  return (
    <Container>
      <ToDoAppBar />
      <Content>
        <Text>App</Text>
      </Content>
    </Container>
  )
}

export default App

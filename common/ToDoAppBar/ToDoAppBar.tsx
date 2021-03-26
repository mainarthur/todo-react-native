import React, { useCallback } from 'react'
import {
  Header, Body, Title, Right, Button,
} from 'native-base'
import Icon from 'react-native-vector-icons/AntDesign'
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { RootState } from '../../redux/reducers'
import { deleteTokensAction } from '../../redux/actions/tokenActions'

const ToDoAppBar = () => {
  const { accessToken, refreshToken } = useSelector((state: RootState) => state.tokens)
  const dispatch = useDispatch()

  const isLogined = !!accessToken && !!refreshToken

  const onLogoutPress = useCallback(async () => {
    await AsyncStorage.removeItem('access_token')
    await AsyncStorage.removeItem('refresh_token')
    dispatch(deleteTokensAction())
  }, [accessToken, refreshToken, dispatch])

  return (
    <Header>
      <Body>
        <Title>To-Do List</Title>
      </Body>
      { isLogined && (
        <Right>
          <Button transparent onPress={onLogoutPress}>
            <Icon name="logout" color="#fff" />
          </Button>
        </Right>
      )}
    </Header>
  )
}

export default ToDoAppBar

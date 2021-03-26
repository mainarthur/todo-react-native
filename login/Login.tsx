import React, { useCallback, useEffect, useState } from 'react'
import { NativeSyntheticEvent, TextInputChangeEventData, ToastAndroid } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import {
  Button,
  Container,
  Content,
  Form,
  Input,
  Item,
  Label,
  Text,
} from 'native-base'
import { Link, useHistory } from 'react-router-native'

import { createAsyncAction } from '../redux/helpers'
import { loginRequestAction } from '../redux/actions/authActions'
import authStyles from '../common/authStyles'
import { RootState } from '../redux/reducers'

const Login = () => {
  const { accessToken, refreshToken } = useSelector((state: RootState) => state.tokens)
  const history = useHistory()

  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const disabled = isLoading

  const dispatch = useDispatch()

  const onEmailChange = useCallback((e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setEmailValue(e.nativeEvent.text)
  }, [setEmailValue])

  const onPasswordChange = useCallback((e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setPasswordValue(e.nativeEvent.text)
  }, [setPasswordValue])

  const onButtonPress = useCallback(async () => {
    const email = emailValue.trim()
    const password = passwordValue.trim()

    try {
      setIsLoading(true)
      await createAsyncAction(dispatch, loginRequestAction({
        email,
        password,
      }))
    } catch (err) {
      ToastAndroid.show('Login problem', ToastAndroid.SHORT)
    } finally {
      setIsLoading(false)
    }
  }, [emailValue, passwordValue, isLoading])

  useEffect(() => {
    if (accessToken !== '' && refreshToken !== '') {
      history.push('/')
    }
  }, [accessToken, refreshToken, history])

  return (
    <Container>
      <Content contentContainerStyle={authStyles.content}>
        <Form>
          <Item floatingLabel>
            <Label>Email</Label>
            <Input value={emailValue} onChange={onEmailChange} disabled={disabled} />
          </Item>
          <Item floatingLabel>
            <Label>Password</Label>
            <Input
              secureTextEntry
              value={passwordValue}
              onChange={onPasswordChange}
              disabled={disabled}
            />
          </Item>
        </Form>
        <Button full rounded style={authStyles.button} onPress={onButtonPress} disabled={disabled}>
          <Text>
            Login
          </Text>
        </Button>
        <Link to="/register">
          <Text style={authStyles.redirectText}>
            Register if you don&apos;t have an account yet.
          </Text>
        </Link>
      </Content>
    </Container>
  )
}

export default Login

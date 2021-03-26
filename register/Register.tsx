import {
  Container, Content, Form, Item, Label, Input, Button, Text,
} from 'native-base'
import React, { useCallback, useEffect, useState } from 'react'
import { NativeSyntheticEvent, TextInputChangeEventData, ToastAndroid } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-native'
import authStyles from '../common/authStyles'
import { registerRequestAction } from '../redux/actions/authActions'
import { createAsyncAction } from '../redux/helpers'
import { RootState } from '../redux/reducers'

const Register = () => {
  const { accessToken, refreshToken } = useSelector((state: RootState) => state.tokens)
  const history = useHistory()

  const [emailValue, setEmailValue] = useState('')
  const [nameValue, setNameValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const disabled = isLoading

  const dispatch = useDispatch()

  const onEmailChange = useCallback((e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setEmailValue(e.nativeEvent.text)
  }, [setEmailValue])

  const onNameChange = useCallback((e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setNameValue(e.nativeEvent.text)
  }, [setNameValue])

  const onPasswordChange = useCallback((e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setPasswordValue(e.nativeEvent.text)
  }, [setPasswordValue])

  const onButtonPress = useCallback(async () => {
    const email = emailValue.trim()
    const password = passwordValue.trim()
    const name = nameValue.trim()

    try {
      setIsLoading(true)
      await createAsyncAction(dispatch, registerRequestAction({
        email,
        password,
        name,
      }))
    } catch (err) {
      ToastAndroid.show('Register problem', ToastAndroid.SHORT)
    } finally {
      setIsLoading(false)
    }
  }, [nameValue, emailValue, passwordValue, isLoading])

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
            <Label>Name</Label>
            <Input value={nameValue} onChange={onNameChange} disabled={disabled} />
          </Item>
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
            Register
          </Text>
        </Button>
        <Link to="/login">
          <Text style={authStyles.redirectText}>Already have an account?Login</Text>
        </Link>
      </Content>
    </Container>
  )
}

export default Register

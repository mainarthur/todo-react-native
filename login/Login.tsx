import React, { useCallback, useState } from 'react'
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native'
import { useDispatch } from 'react-redux'
import {
  Button,
  Container,
  Content,
  Form,
  Input,
  Item,
  Label,
  Text,
  Toast,
} from 'native-base'
import ToDoAppBar from '../common/ToDoAppBar/ToDoAppBar'
import { createAsyncAction } from '../redux/helpers'
import { loginRequestAction } from '../redux/actions/authActions'

const Login = () => {
  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')

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
      await createAsyncAction(dispatch, loginRequestAction({
        email,
        password,
      }))
    } catch (err) {
      Toast.show({
        text: 'Login problem',
      })
    }
  }, [emailValue, passwordValue])

  return (
    <Container>
      <ToDoAppBar />
      <Content contentContainerStyle={{ justifyContent: 'center', flex: 1 }}>
        <Form>
          <Item floatingLabel>
            <Label>Email</Label>
            <Input value={emailValue} onChange={onEmailChange} />
          </Item>
          <Item floatingLabel>
            <Label>Password</Label>
            <Input value={passwordValue} onChange={onPasswordChange} />
          </Item>
        </Form>
        <Button full rounded style={{ marginTop: 32 }} onPress={onButtonPress}>
          <Text>
            Login
          </Text>
        </Button>
      </Content>
    </Container>
  )
}

export default Login

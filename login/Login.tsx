import React, { useCallback, useState } from "react"
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native'
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
import ToDoAppBar from '../common/ToDoAppBar/ToDoAppBar'

const Login = () => {
  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')

  const onEmailChange = useCallback((e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setEmailValue(e.nativeEvent.text)
  }, [setEmailValue])

  const onPasswordChange = useCallback((e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setPasswordValue(e.nativeEvent.text)
  }, [setPasswordValue])

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
        <Button full rounded style={{ marginTop: 32 }}>
          <Text>
            Login
          </Text>
        </Button>
      </Content>
    </Container>
  )
}

export default Login

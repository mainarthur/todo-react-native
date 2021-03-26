import React, { useCallback, useState } from 'react'
import {
  Item,
  Input,
  Text,
  CardItem,
  Button,
  Body,
  Card,
} from 'native-base'
import { NativeSyntheticEvent, TextInputChangeEventData, ToastAndroid } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import styles from './styles'
import { RootState } from '../../redux/reducers'
import Board from '../../models/Board'
import { createAsyncAction } from '../../redux/helpers'
import { requestNewToDoAction } from '../../redux/actions/toDoActions'

interface Props {
  board: Board
}

const AddToDoCard = ({ board }: Props) => {
  const [toDoTaskValue, setToDoTaskValue] = useState('')

  const { user } = useSelector((state: RootState) => state.app)
  const dispath = useDispatch()

  const onTaskChange = useCallback((e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setToDoTaskValue(e.nativeEvent.text)
  }, [setToDoTaskValue])

  const onAddPress = useCallback(async () => {
    try {
      await createAsyncAction<Board>(dispath, requestNewToDoAction({
        body: {
          text: toDoTaskValue,
          boardId: board.id,
        },
        user,
      }))
      setToDoTaskValue('')
    } catch (err) {
      ToastAndroid.show('Name is required', ToastAndroid.LONG)
    }
  }, [toDoTaskValue, dispath, user, board])

  return (
    <Card>
      <CardItem>
        <Body>
          <Item>
            <Input
              value={toDoTaskValue}
              onChange={onTaskChange}
              placeholder="New Task"
            />
          </Item>
          <Button full onPress={onAddPress}>
            <Text>Add ToDo</Text>
          </Button>
        </Body>
      </CardItem>
    </Card>
  )
}

export default AddToDoCard

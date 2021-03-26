import React, { useCallback } from 'react'
import {
  Text, CheckBox, Left, Body, Right, ListItem, Button,
} from 'native-base'
import Icon from 'react-native-vector-icons/AntDesign'
import { useDispatch, useSelector } from 'react-redux'
import { ToastAndroid } from 'react-native'
import ToDo from '../../models/ToDo'
import styles from './styles'
import { LoadingPart } from '../../common/constants'
import { createAsyncAction } from '../../redux/helpers'
import { RootState } from '../../redux/reducers'
import { requestDeleteToDosAction, requestUpdateToDoAction } from '../../redux/actions/toDoActions'

interface Props {
  toDo: ToDo
}

const ToDoCard = ({ toDo }: Props) => {
  const {
    text,
    id,
    boardId,
    done,
    loadingPart,
  } = toDo

  const disabled = loadingPart !== LoadingPart.NONE

  const { user } = useSelector((state: RootState) => state.app)
  const dispacth = useDispatch()

  const onStatusChange = useCallback(async () => {
    try {
      await createAsyncAction(dispacth, requestUpdateToDoAction({
        user,
        body: {
          id,
          boardId,
          done: !done,
        },
      }))
    } catch (err) {
      ToastAndroid.show('ToDo Update error', ToastAndroid.LONG)
    }
  }, [boardId, dispacth, done, id, user])

  const onDeletePress = useCallback(async () => {
    try {
      await createAsyncAction(dispacth, requestDeleteToDosAction({
        user,
        body: {
          boardId,
          todos: [id],
        },
      }))
    } catch (err) {
      ToastAndroid.show('ToDo delete error', ToastAndroid.LONG)
    }
  }, [boardId, dispacth, id, user])

  return (
    <ListItem icon>
      <Left>
        <CheckBox disabled={disabled} checked={done} onPress={onStatusChange} />
      </Left>
      <Body>
        <Text style={done ? styles.doneText : {}}>
          {text}
        </Text>
      </Body>
      <Right>
        <Button transparent disabled={disabled} onPress={onDeletePress}>
          <Icon name="delete" size={16} />
        </Button>
      </Right>
    </ListItem>
  )
}

export default ToDoCard

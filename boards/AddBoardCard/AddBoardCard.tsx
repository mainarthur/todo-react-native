import React, { useCallback, useState } from 'react'
import {
  Item,
  Input,
  Text,
  CardItem,
  Button,
  Body,
} from 'native-base'
import { NativeSyntheticEvent, TextInputChangeEventData, ToastAndroid } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import styles from './styles'
import { RootState } from '../../redux/reducers'
import Board from '../../models/Board'
import { createAsyncAction } from '../../redux/helpers'
import { requestNewBoardAction } from '../../redux/actions/boardsActions'

const AddBoardCard = () => {
  const [boardNameValue, setBoardNameValue] = useState('')

  const { user } = useSelector((state: RootState) => state.app)
  const dispath = useDispatch()

  const onNameChange = useCallback((e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setBoardNameValue(e.nativeEvent.text)
  }, [setBoardNameValue])

  const onAddPress = useCallback(async () => {
    try {
      await createAsyncAction<Board>(dispath, requestNewBoardAction({
        body: {
          name: boardNameValue,
        },
        user,
      }))
      setBoardNameValue('')
    } catch (err) {
      ToastAndroid.show('Name is required', ToastAndroid.LONG)
    }
  }, [boardNameValue, dispath, user])

  return (
    <>
      <CardItem>
        <Item>
          <Input
            placeholder="Board name"
            style={styles.input}
            maxLength={20}
            value={boardNameValue}
            onChange={onNameChange}
          />
        </Item>
      </CardItem>
      <CardItem footer>
        <Body>
          <Button full rounded onPress={onAddPress}>
            <Text>Add Board</Text>
          </Button>
        </Body>
      </CardItem>
    </>
  )
}

export default AddBoardCard

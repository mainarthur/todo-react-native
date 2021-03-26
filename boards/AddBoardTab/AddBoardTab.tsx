import React, { useCallback, useState } from 'react'
import {
  Content, Item, Input, Button, Text,
} from 'native-base'
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import styles from './styles'
import { RootState } from '../../redux/reducers'
import Board from '../../models/Board'
import { createAsyncAction } from '../../redux/helpers'
import { requestNewBoardAction } from '../../redux/actions/boardsActions'

const AddBoardTab = () => {
  const [boardNameValue, setBoardNameValue] = useState('')

  const { user } = useSelector((state: RootState) => state.app)
  const dispath = useDispatch()

  const onNameChange = useCallback((e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setBoardNameValue(e.nativeEvent.text)
  }, [setBoardNameValue])

  const onAddPress = useCallback(async () => {
    await createAsyncAction<Board>(dispath, requestNewBoardAction({
      body: {
        name: boardNameValue,
      },
      user,
    }))
  }, [boardNameValue, dispath, user])

  return (
    <Content padder>
      <Item>
        <Input
          placeholder="Board name"
          style={styles.input}
          maxLength={20}
          value={boardNameValue}
          onChange={onNameChange}
        />
      </Item>
      <Button full rounded style={styles.button} onPress={onAddPress}>
        <Text>Add</Text>
      </Button>
    </Content>
  )
}

export default AddBoardTab

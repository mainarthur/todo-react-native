import * as React from 'react'
import {
  FC,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Content,
  ScrollableTab, Tab, TabHeading, Tabs, Text,
} from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons'

import Board from '../../models/Board'
import { RootState } from '../../redux/reducers'
import { createAsyncAction } from '../../redux/helpers'
import { requestBoardsAction } from '../../redux/actions/boardsActions'
import AddBoardTab from '../AddBoardTab'

const BoardPage: FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isBoardsLoaded, setIsBoardsLoaded] = useState(false)
  const [isLoadError, setIsLoadError] = useState(false)

  const boards = useSelector((state: RootState) => state.boards)
  const { user } = useSelector((state: RootState) => state.app)

  const dispatch = useDispatch()

  const renderTabBar = useCallback(() => <ScrollableTab />, [])

  const loadBoards = useCallback(async () => {
    try {
      await createAsyncAction<Board[]>(dispatch, requestBoardsAction(user))

      setIsBoardsLoaded(true)

      if (isLoadError) {
        setIsLoadError(false)
      }
    } catch (err) {
      if (!isLoadError) {
        setIsLoadError(true)
      }
    } finally {
      setIsLoading(false)
    }
  }, [user, dispatch, isLoadError])

  useEffect(() => {
    if (user && !isLoading && !isBoardsLoaded) {
      setIsLoading(true)
      loadBoards()
    }
  }, [user, isLoading, isBoardsLoaded, loadBoards])

  const tabs = (boards ?? []).map((board) => (
    <Tab heading={board.name} key={board.id}>
      <Content padder>
        <Text>{JSON.stringify(board)}</Text>
      </Content>
    </Tab>
  ))

  tabs.push(
    <Tab heading={<TabHeading><Icon name="add" color="#fff" size={16} /></TabHeading>}>
      <AddBoardTab />
    </Tab>,
  )

  return (
    <Tabs renderTabBar={renderTabBar}>
      {tabs}
    </Tabs>
  )
}

export default BoardPage

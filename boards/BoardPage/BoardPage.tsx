import React, {
  useEffect,
  useState,
  useCallback,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Card,
  CardItem,
  Content,
  Text,
} from 'native-base'

import Board from '../../models/Board'
import { RootState } from '../../redux/reducers'
import { createAsyncAction } from '../../redux/helpers'
import { requestBoardsAction } from '../../redux/actions/boardsActions'
import AddBoardCard from '../AddBoardCard'
import ToDoList from '../ToDoList'

const BoardPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isBoardsLoaded, setIsBoardsLoaded] = useState(false)
  const [isLoadError, setIsLoadError] = useState(false)

  const boards = useSelector((state: RootState) => state.boards)
  const { user } = useSelector((state: RootState) => state.app)

  const dispatch = useDispatch()

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
    <Card key={board.id}>
      <CardItem header bordered>
        <Text>{board.name}</Text>
      </CardItem>
      <ToDoList board={board} />
    </Card>
  ))

  tabs.push(
    <Card key="add-board-tab">
      <AddBoardCard />
    </Card>,
  )

  return (
    <Content>{tabs}</Content>
  )
}

export default BoardPage

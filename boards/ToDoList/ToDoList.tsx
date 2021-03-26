import React, {
  useEffect,
  useState,
  useCallback,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Body,
  Button,
  Card,
  CardItem,
  Input,
  Item,
  Text,
} from 'native-base'

import Board from '../../models/Board'
import { RootState } from '../../redux/reducers'
import { createAsyncAction } from '../../redux/helpers'
import ToDoCard from '../ToDoCard'
import { requestTodosAction, setTodosAction } from '../../redux/actions/toDoActions'
import AddToDoCard from '../AddToDoCard'
import ToDo from '../../models/ToDo'

interface Props {
  board: Board
}

const ToDoList = ({ board }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isBoardsLoaded, setIsBoardsLoaded] = useState(false)
  const [isLoadError, setIsLoadError] = useState(false)

  const { todos } = useSelector(
    (state: RootState) => state.boards.find((stateBoard) => stateBoard.id === board.id),
  )
  const { user } = useSelector((state: RootState) => state.app)

  const dispatch = useDispatch()

  const loadTodos = useCallback(async () => {
    try {
      await createAsyncAction<ToDo[]>(dispatch, requestTodosAction({
        boardId: board.id,
        user,
      }))
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
  }, [user, dispatch, isLoadError, board])

  useEffect(() => {
    if (user && board && !isLoading && !isBoardsLoaded) {
      setIsLoading(true)
      loadTodos()
    }
  }, [user, isLoading, isBoardsLoaded, loadTodos, board])

  console.log(todos)

  return (
    <>
      {(todos ?? []).map((toDo) => (
        <ToDoCard key={toDo.id} toDo={toDo} />
      ))}
      <AddToDoCard board={board} />
    </>
  )
}

export default ToDoList

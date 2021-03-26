import { takeEvery, put } from 'redux-saga/effects'
import { api } from '../../api/api'
import AddUserToBoardBody from '../../api/bodies/AddUserToBoardBody'
import DeleteBoardBody from '../../api/bodies/DeleteBoardBody'
import NewBoardBody from '../../api/bodies/NewBoardBody'
import UpdateBoardBody from '../../api/bodies/UpdateBoardBody'
import Response from '../../api/Response'
import AddUserToBoardResponse from '../../api/responses/AddUserToBoardResponse'
import BoardsResponse from '../../api/responses/BoardsResponse'
import DeleteBoardResponse from '../../api/responses/DeleteBoardResponse'
import NewBoardResponse from '../../api/responses/NewBoardResponse'
import UpdateBoardResponse from '../../api/responses/UpdateBoardResponse'
import Board from '../../models/Board'
import User from '../../models/User'
import { getSocket } from '../../socket.io'
import {
  addBoardAction,
  deleteBoardAction,
  deleteStoredBoardAction,
  setBoardsAction,
  storeNewBoardAction,
  storeUpdatedBoardAction,
  updateBoardAction,
} from '../actions/boardsActions'
import { BoardAction } from '../constants'
import Action from '../types/Action'
import AsyncAction from '../types/AsyncAction'
import BodyPayload from '../types/payloads/BodyPayload'

function* requestBoards(action: AsyncAction<Board[], User>) {
  const {
    next,
  } = action

  try {
    const boardsResponse: BoardsResponse = yield api<BoardsResponse, {}>({
      endpoint: '/board',
    })

    if (boardsResponse.status) {
      const { results: boards } = boardsResponse

      yield put(setBoardsAction(boards.filter((board) => !board.deleted)))
      next(null, boards)
    } else {
      next(boardsResponse.error)
    }
  } catch (err) {
    return next(err)
  }
  return null
}

function* requestNewBoard(action: AsyncAction<Board, BodyPayload<NewBoardBody>>) {
  const {
    next,
    payload: {
      body,
      user,
    },
  } = action

  try {
    const boardResponse: NewBoardResponse = yield api<NewBoardResponse, NewBoardBody>({
      body,
      endpoint: '/board',
      method: 'POST',
    })

    if (boardResponse.status) {
      const { result: board } = boardResponse

      yield put(storeNewBoardAction({
        user,
        body: board,
      }))
      const socket = getSocket()

      if (socket) {
        socket.emit('new-board', board)
      }

      next(null, board)
    } else {
      next(boardResponse.error)
    }
  } catch (err) {
    next(err)
  }
}

function* requestDeleteBoard(action: AsyncAction<Board, BodyPayload<DeleteBoardBody>>) {
  const {
    next,
    payload: {
      body,
      user,
    },
  } = action

  try {
    const deleteResponse: DeleteBoardResponse = yield api<Response, DeleteBoardBody>({
      body,
      endpoint: '/board',
      method: 'DELETE',
    })

    if (deleteResponse.status) {
      const { result: board } = deleteResponse
      const socket = getSocket()

      yield put(deleteStoredBoardAction({
        user,
        body: board,
      }))

      if (socket) {
        socket.emit('delete-board', board)
      }

      next(null, board)
    } else {
      next(deleteResponse.error)
    }
  } catch (err) {
    next(err)
  }
}

function* requestAddUserToBoard(action: AsyncAction<Board, BodyPayload<AddUserToBoardBody>>) {
  const {
    next,
    payload: {
      body,
      user,
    },
  } = action

  try {
    const updateResponse: AddUserToBoardResponse = yield api<Response, AddUserToBoardBody>({
      endpoint: '/board/user',
      method: 'POST',
      body,
    })

    if (updateResponse.status) {
      const { result: board } = updateResponse
      const socket = getSocket()

      yield put(storeUpdatedBoardAction({
        user,
        body: board,
      }))

      if (socket) {
        socket.emit('add-user', board)
        socket.emit('update-board', board)
      }

      next(null, board)
    } else {
      next(updateResponse.error)
    }
  } catch (err) {
    next(err)
  }
}

function* requestUpdateBoard(action: AsyncAction<Board, BodyPayload<UpdateBoardBody>>) {
  const {
    next,
    payload: {
      body,
      user,
    },
  } = action

  try {
    const updateResponse: UpdateBoardResponse = yield api<UpdateBoardResponse, UpdateBoardBody>({
      endpoint: '/board',
      method: 'PATCH',
      body,
    })

    if (updateResponse.status) {
      const { result: board } = updateResponse
      const socket = getSocket()

      yield put(storeUpdatedBoardAction({
        user,
        body: board,
      }))

      if (socket) {
        socket.emit('update-board', board)
      }

      next(null, board)
    } else {
      next(updateResponse.error)
    }
  } catch (err) {
    next(err)
  }
}

function* storeBoard(action: Action<BodyPayload<Board>>) {
  const {
    payload: {
      body: board,
    },
    type,
  } = action

  if (type === BoardAction.STORE_NEW_BOARD) {
    yield put(addBoardAction(board))
  } else {
    yield put(updateBoardAction(board))
  }
}

function* deleteStoredBoard(action: Action<BodyPayload<Board>>) {
  const {
    payload: {
      body: board,
    },
  } = action

  yield put(deleteBoardAction(board))
}

function* watchBoards() {
  yield takeEvery(BoardAction.DELETE_STORED_BOARD, deleteStoredBoard)
  yield takeEvery([BoardAction.STORE_NEW_BOARD, BoardAction.STORE_UPDATED_BOARD], storeBoard)
  yield takeEvery(BoardAction.REQUEST_BOARDS, requestBoards)
  yield takeEvery(BoardAction.REQUEST_UPDATE_BOARD, requestUpdateBoard)
  yield takeEvery(BoardAction.REQUEST_DELETE_BOARD, requestDeleteBoard)
  yield takeEvery(BoardAction.REQUEST_NEW_BOARD, requestNewBoard)
  yield takeEvery(BoardAction.REQUEST_ADD_USER_TO_BOARD, requestAddUserToBoard)
}

export default watchBoards

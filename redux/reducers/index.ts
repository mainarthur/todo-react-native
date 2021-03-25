import { combineReducers } from 'redux'

import appReducer from './appReducer'
import boardsReducer from './boardsReducer'
import tokensReducer from './tokensReducer'

const rootReducer = combineReducers({
  tokens: tokensReducer,
  app: appReducer,
  boards: boardsReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer

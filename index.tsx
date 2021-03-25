import React from 'react'
import { AppRegistry } from 'react-native'
import { NativeRouter, Route, Router } from 'react-router-native'
import { Provider as ReduxStoreProvider } from 'react-redux'
import App from './App'
import { name as appName } from './app.json'
import Login from './login/Login'
import Register from './register/Register'
import history from './routing/history'
import store from './redux/store'

const main = () => (
  <ReduxStoreProvider store={store}>
    <Router history={history}>
      <NativeRouter>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </NativeRouter>
    </Router>
  </ReduxStoreProvider>
)

AppRegistry.registerComponent(appName, () => main)

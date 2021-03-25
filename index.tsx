import { AppRegistry } from 'react-native'
import { NativeRouter, Route, Router } from 'react-router-native'
import App from './App'
import { name as appName } from './app.json'
import Login from './login/Login'
import Register from './register/Register'
import history from './routing/history'

const main = () => <Router history={history}>
  <NativeRouter>
    <Route exact path="/" component={App} />
    <Route path="/login" component={Login} />
    <Route path="/register" component={Register} />
  </NativeRouter>
</Router>

AppRegistry.registerComponent(appName, () => main)

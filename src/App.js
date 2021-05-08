import React from 'react'
import {BrowserRouter as Router, Redirect, Route, Switch,} from "react-router-dom"
import Chat from './Chat'
import Settings from './Settings'


function PrivateRoute({component: Component, ...rest}) {
  return (
    <Route
      {...rest}
      render={props =>
        localStorage.getItem("pubkey") ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/settings",
              state: {from: props.location}
            }}
          />
        )
      }
    />
  );
}

const App = () => {
  return (
    <Router>

      <Switch>
        <Route path="/settings">
          <Settings/>
        </Route>
        <PrivateRoute path="/" component={Chat}/>
      </Switch>
    </Router>
  );
}

export default App;

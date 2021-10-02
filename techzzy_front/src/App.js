import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import "bootswatch/dist/sandstone/bootstrap.min.css";
import Home from "./components/home/index.js";
import React from 'react';

export const ApiContext = React.createContext('http://localhost:8000');

function App() {
  return (
    <ApiContext.Provider value="http://localhost:8000">
      <Router>
        <Switch>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </ApiContext.Provider>
  );
}

export default App;

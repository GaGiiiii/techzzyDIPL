import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import "bootswatch/dist/sandstone/bootstrap.min.css";
import Home from "./components/home/index.js";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

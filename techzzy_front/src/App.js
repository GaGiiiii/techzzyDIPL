import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "bootswatch/dist/sandstone/bootstrap.min.css";
import Home from "./components/home/Home";
import Product from './components/product/Product';
import Login from './components/login/Login';
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export const ApiContext = React.createContext();
export const CurrentUserContext = React.createContext(null);

function App() {
  const [products, setProducts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const api = "http://localhost:8000";

  useEffect(() => {
    axios({
      method: 'GET',
      url: `${api}/api/products`,
    }).then(res => {
      setProducts(res.data.products);
    }).catch(err => console.log(err));
  }, []);

  return (
    <ApiContext.Provider value="http://localhost:8000">
      <CurrentUserContext.Provider value={{currentUser, setCurrentUser}}>
        <Router>
          <Switch>
            <Route path="/products/:productID">
              <Product products={products} />
            </Route>
            <Route path="/login">
              <Login products={products} />
            </Route>
            <Route path="/">
              <Home products={products} />
            </Route>
          </Switch>
        </Router>
      </CurrentUserContext.Provider>
    </ApiContext.Provider>
  );
}

export default App;

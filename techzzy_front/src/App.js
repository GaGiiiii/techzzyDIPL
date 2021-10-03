import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import "bootswatch/dist/sandstone/bootstrap.min.css";
import Home from "./components/home/Home";
import Product from './components/product/Product';
import React from 'react';
import { useState, useEffect } from 'react';

export const ApiContext = React.createContext('http://localhost:8000');

function App() {
  const [products, setProducts] = useState([]);
  const api = "http://localhost:8000";
  const axios = require('axios');

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
      <Router>
        <Switch>
          <Route path="/products/:productID">
            <Product products={products} />
          </Route>
          <Route path="/">
            <Home products={products} />
          </Route>
        </Switch>
      </Router>
    </ApiContext.Provider>
  );
}

export default App;

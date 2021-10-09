import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "bootswatch/dist/sandstone/bootstrap.min.css";
import Home from "./components/home/Home";
import Product from './components/product/Product';
import Login from './components/login/Login';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { isLoggedIn } from './Helpers';
import Dashboard from './components/dashboard/Dashboard';
import Cart from './components/cart/Cart';

export const ApiContext = React.createContext();
export const CurrentUserContext = React.createContext(null);
export const FlashMessageContext = React.createContext(null);
export const ProductsInCartContext = React.createContext(null);

function App() {
  const [products, setProducts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [flashMessage, setFlashMessage] = useState(null);
  const [productsInCart, setProductsInCart] = useState([]);

  const api = "http://localhost:8000/api";

  useEffect(() => {
    setCurrentUser(isLoggedIn());
    axios.get(`${api}/products`).then(res => {
      setProducts(res.data.products);
    }).catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (currentUser) {
      axios.get(`${api}/users/${currentUser.id}/cart`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      }).then(res => {
        setProductsInCart(res.data.products);
      }).catch(err => console.log(err));
    }
  }, [currentUser])

  return (
    <ApiContext.Provider value="http://localhost:8000/api">
      <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
        <ProductsInCartContext.Provider value={{ productsInCart, setProductsInCart }}>
          <FlashMessageContext.Provider value={{ flashMessage, setFlashMessage }}>
            <Router>
              <Switch>
                <Route path="/products/:productID">
                  <Product products={products} />
                </Route>
                <Route path="/dashboard">
                  <Dashboard products={products} />
                </Route>
                <Route path="/login">
                  <Login products={products} />
                </Route>
                <Route path="/cart">
                  <Cart products={products} />
                </Route>
                <Route path="/">
                  <Home products={products} />
                </Route>
              </Switch>
            </Router>
          </FlashMessageContext.Provider>
        </ProductsInCartContext.Provider>
      </CurrentUserContext.Provider>
    </ApiContext.Provider>
  );
}

export default App;

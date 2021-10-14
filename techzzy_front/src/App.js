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
import Products from './components/products/Products';
import ScrollToTop from './components/ScrollToTop';
import Register from './components/register/Register';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Admin from './components/admin/Admin';

export const ApiContext = React.createContext();
export const CurrentUserContext = React.createContext(null);
export const FlashMessageContext = React.createContext(null);
export const ProductsInCartContext = React.createContext(null);
export const ProductsContext = React.createContext(null);

function App() {
  const [products, setProducts] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => isLoggedIn());
  const [flashMessage, setFlashMessage] = useState(null);
  const [productsInCart, setProductsInCart] = useState([]);

  const api = "http://localhost:8000/api";

  useEffect(() => {
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
    <PayPalScriptProvider options={{ 'client-id': 'AZTTSjbiEU5RyGlyMSCxqn0LifK02-cl1VJi1cPgFT4XaVZUcUPW5DEWQMQ_MPjHZ7qEbmALthMGcDTk', currency: 'EUR' }}>
      <ApiContext.Provider value="http://localhost:8000/api">
        <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
          <ProductsContext.Provider value={{ products, setProducts }}>
            <ProductsInCartContext.Provider value={{ productsInCart, setProductsInCart }}>
              <FlashMessageContext.Provider value={{ flashMessage, setFlashMessage }}>
                <Router>
                  <ScrollToTop>
                    <Switch>
                      <Route path="/products/:productID">
                        <Product />
                      </Route>
                      <Route path="/products">
                        <Products />
                      </Route>
                      <Route path="/admin">
                        <Admin />
                      </Route>
                      <Route path="/dashboard">
                        <Dashboard />
                      </Route>
                      <Route path="/register">
                        <Register />
                      </Route>
                      <Route path="/login">
                        <Login />
                      </Route>
                      <Route path="/cart">
                        <Cart />
                      </Route>
                      <Route path="/">
                        <Home />
                      </Route>
                    </Switch>
                  </ScrollToTop>
                </Router>
              </FlashMessageContext.Provider>
            </ProductsInCartContext.Provider>
          </ProductsContext.Provider>
        </CurrentUserContext.Provider>
      </ApiContext.Provider>
    </PayPalScriptProvider>
  );
}

export default App;

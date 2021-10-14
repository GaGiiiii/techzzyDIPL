import React, { useContext, useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import Footer from '../Footer'
import NavbarC from '../NavbarC'
import './cart.css';
import { ApiContext, CurrentUserContext, FlashMessageContext, ProductsInCartContext } from '../../App';
import { Link, Redirect } from 'react-router-dom';
import CartItem from './CartItem';
import AlertC from '../AlertC';
import { PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';


export default function Cart() {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const { productsInCart, setProductsInCart } = useContext(ProductsInCartContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartFlashMessage, setCartFlashMessage] = useState(null);
  const [orderID, setOrderID] = useState(null);
  const api = useContext(ApiContext);
  const { setFlashMessage } = useContext(FlashMessageContext);

  useEffect(() => {
    if (!currentUser) {
      return <Redirect to="/" />
    }

    axios.get(`${api}/users/${currentUser.id}/cart`, {
      headers: {
        Authorization: `Bearer ${currentUser.token}`
      }
    }).then(res => {
      setProductsInCart(res.data.products);
    }).catch(err => console.log(err));
  }, [currentUser, setProductsInCart, api]);

  useEffect(() => {
    let totalP = 0;
    productsInCart.forEach(product => {
      totalP += parseFloat(product.price) * parseFloat(product.count);
    });
    setTotalPrice(totalP);
  }, [productsInCart]);

  function createOrder(data, actions) {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: Math.round((totalPrice + totalPrice * 0.1) * 100) / 100,
          },
        },
      ],
    }).then((orderID) => {
      setOrderID(orderID);

      return orderID;
    });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(function (details) {
      setFlashMessage({ type: 'success', message: `Transaction completed by ${details.payer.name.given_name}!` }) // Add Flash Message
      savePayment(details);
      console.log(details)

    });
  }

  function savePayment(details) {
    console.log(details)
    axios.post(`${api}/payments`, { order_id: details.id, user_id: currentUser.id, price: Math.round((totalPrice + totalPrice * 0.1) * 100) / 100, products: productsInCart }, {
      headers: {
        Authorization: `Bearer ${currentUser.token}`
      }
    }).then(response => {
      console.log(response.data);
      let newUser = { ...currentUser };
      newUser.cart.product_carts = [];
      setCurrentUser(newUser);
      setProductsInCart([]);
      console.log(newUser);
      console.log(currentUser);
    }).catch((error) => {
      console.log("Payment Save Error");
    });
  }

  return (
    <>
      <NavbarC />

      <Container className="mb-5">
        <div className="d-flex justify-content-between mt-5 first-row mb-5">
          <div>
            <h1 className="fw-bold my-cart">My Cart</h1>
          </div>
          <div>
            <Link to='/products'><button className="btn btn-primary">Continue Shopping</button></Link>
          </div>
        </div>

        {cartFlashMessage && <AlertC cartAlert={true} flashMessage={cartFlashMessage} setFlashMessage={setCartFlashMessage} />}

        <Row>
          <Col xs={8}>
            {productsInCart && productsInCart.map(product => (
              <CartItem product={product} key={product.id} totalPrice={totalPrice} setTotalPrice={setTotalPrice} setCartFlashMessage={setCartFlashMessage} />
            ))}
          </Col>
          <Col xs={4}>
            <div className="total-div shadow payment-col">
              <h5><strong className="fw-bold">SUBTOTAL:</strong> <span className="subtotal-price-span">{totalPrice.toLocaleString()}</span> &euro;</h5>
              <h5><strong>SHIPPING:</strong> <span>0 &euro;</span></h5>
              <h5><strong>TAX:</strong> <span className="tax-span">{(Math.round(totalPrice * 0.1 * 100) / 100).toLocaleString()}</span> &euro;
                (10%)</h5>
              <h5 className="totalG2"><strong>TOTAL:</strong> <span
                className="total-price-span">{(Math.round((totalPrice + totalPrice * 0.1) * 100) / 100).toLocaleString()}</span> &euro;
              </h5>
              {/* <button className="btn btn-primary btn-lg checkout-btn">Checkout</button> */}
              {productsInCart.length > 0 && <PayPalButtons style={{ marginTop: `10px` }} createOrder={createOrder} onApprove={onApprove} forceReRender={[totalPrice]} />}
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  )
}

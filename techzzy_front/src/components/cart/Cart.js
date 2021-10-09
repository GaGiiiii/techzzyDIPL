import React, { useContext, useEffect, useState } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap';
import Footer from '../Footer'
import NavbarC from '../NavbarC'
import './cart.css';
import { CurrentUserContext, ApiContext } from '../../App';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import CartItem from './CartItem';
import AlertC from '../AlertC';

export default function Cart({ products }) {
  const { currentUser } = useContext(CurrentUserContext);
  const [productsInCart, setProductsInCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const api = useContext(ApiContext);
  const [cartFlashMessage, setCartFlashMessage] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      return <Redirect to="/" />
    }
  }, [currentUser])

  useEffect(() => {
    if (currentUser) {
      axios.get(`${api}/users/${currentUser.id}/cart`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      }).then(res => {
        setProductsInCart(res.data.products);
        let totalP = 0;
        res.data.products.forEach(product => {
          totalP += parseFloat(product.price) * parseFloat(product.count);
        });
        setTotalPrice(totalP);
      }).catch(err => console.log(err));
    }
  }, [currentUser, api]);



  return (
    <>
      <NavbarC products={products} />

      <Container className="mb-5">
        <div className="d-flex justify-content-between mt-5 first-row mb-5">
          <div>
            <h1 className="fw-bold my-cart">My Cart</h1>
          </div>
          <div>
            <a href="{{ url('/products') }}">
              <button className="btn btn-primary">Continue Shopping</button>
            </a>
          </div>
        </div>

        {cartFlashMessage && <AlertC flashMessage={cartFlashMessage} setFlashMessage={setCartFlashMessage} />}

        <Row>
          <Col xs={8}>
            {productsInCart && productsInCart.map(product => (
             <CartItem product={product} key={product.id} totalPrice={totalPrice} setTotalPrice={setTotalPrice} setCartFlashMessage={setCartFlashMessage} />
            ))}
          </Col>
          <Col xs={4}>
            <div className="total-div shadow payment-col">
              <h5><strong className="fw-bold">SUBTOTAL:</strong> <span className="subtotal-price-span">{totalPrice.toLocaleString()}</span> RSD</h5>
              <h5><strong>SHIPPING:</strong> <span>0 RSD</span></h5>
              <h5><strong>TAX:</strong> <span className="tax-span">{(Math.round(totalPrice * 0.1 * 100) / 100).toLocaleString()}</span> RSD
                (10%)</h5>
              <h5 className="totalG2"><strong>TOTAL:</strong> <span
                className="total-price-span">{(Math.round((totalPrice + totalPrice * 0.1) * 100) / 100).toLocaleString()}</span> RSD
              </h5>
              <button className="btn btn-primary btn-lg checkout-btn">Checkout</button>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  )
}

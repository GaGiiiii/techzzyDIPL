import React, { useContext, useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import Footer from '../Footer'
import NavbarC from '../NavbarC'
import './cart.css';
import { CurrentUserContext, ProductsInCartContext } from '../../App';
import { Link, Redirect } from 'react-router-dom';
import CartItem from './CartItem';
import AlertC from '../AlertC';

export default function Cart() {
  const { currentUser } = useContext(CurrentUserContext);
  const { productsInCart } = useContext(ProductsInCartContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartFlashMessage, setCartFlashMessage] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      return <Redirect to="/" />
    }
  }, [currentUser])

  useEffect(() => {
    let totalP = 0;
    productsInCart.forEach(product => {
      totalP += parseFloat(product.price) * parseFloat(product.count);
    });
    setTotalPrice(totalP);
  }, [productsInCart]);

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

import React, { useContext, useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import Footer from '../Footer'
import NavbarC from '../NavbarC'
import './cart.css';
import { CurrentUserContext, ApiContext } from '../../App';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export default function Cart({ products }) {
  const { currentUser } = useContext(CurrentUserContext);
  const [productsInCart, setProductsInCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const api = useContext(ApiContext);

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
          totalP += parseFloat(product.price);
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
            <h1 className="fw-bold">My Cart</h1>
          </div>
          <div>
            <a href="{{ url('/products') }}">
              <button className="btn btn-primary">Continue Shopping</button>
            </a>
          </div>
        </div>

        <Row>
          <Col xs={8}>
            {productsInCart && productsInCart.map(product => (
              <div key={product.id} className="row cart-row">
                <div className="col">
                  <div className="shadow d-flex cart-item">
                    <div className="product-img-div">
                      <a href="{{ url('/products') . '/' . $cart->product->id }}"><img className="product-img"
                        src={product.img}
                        alt="Image Error" />
                      </a>
                    </div>
                    <div className="cart-body flex-fill">
                      <h2 className="card-title mb-0"> <a href="{{ url('/products') . '/' . $cart->product->id }}">{product.name}</a>
                      </h2>
                      <h6 className="card-title mb-0">{product.category.name}</h6>
                      <h6 className="card-title">Stock: {product.stock}</h6>
                      <div className="mt-2 price">
                        <span className="current-count-span">{product.count}</span> x
                        <span className="original-product-price">{product.price}</span>
                        RSD
                      </div>
                      <div className="quantity">
                        <ul className="quantity-ul">
                          <li data-cart-id="{{ $cart->id }}"
                            className="btn btn-outline-primary fw-bold li-minus"><i
                              className="fas fa-minus"></i></li>
                          <li className="btn btn-outline-primary fw-bold li-current">{product.count}
                          </li>
                          <li data-cart-id="{{ $cart->id }}"
                            className="btn btn-outline-primary fw-bold li-plus"><i className="fas fa-plus"></i>
                          </li>
                          {/* <!-- Button trigger modal --> */}
                          <li data-bs-toggle="modal" data-bs-target="#exampleModal{{ $cart->id }}"
                            className="btn
                                            btn-outline-primary fw-bold li-delete">
                            <i className="fas fa-trash"></i>
                          </li>
                          {/* <!-- Modal --> */}
                          {/* <div className="modal fade" id="exampleModal{{ $cart->id }}"
                            aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5 className="modal-title" id="exampleModalLabel">Are you sure
                                    that
                                    you want to remove
                                    <strong>"{{ $cart-> product -> name}}"</strong> from cart?
                                  </h5>
                                  <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                                </div>
                                <div className="modal-footer">
                                  <form className="d-inline"
                                    action="{{ url('/carts2') }}/{{ $cart->id }}"
                                    method="POST">
                                    @csrf
                                    @method('DELETE')
                                    <button className="btn btn-danger">YES</button>
                                  </form>
                                  <button type="button" className="btn btn-secondary"
                                    data-bs-dismiss="modal">No</button>
                                </div>
                              </div>
                            </div>
                          </div> */}
                        </ul>
                      </div>
                      <div className="total fw-bold">Total:
                        <span
                          className="total-product-price">{(Math.round(product.count * product.price * 100) / 100).toLocaleString()}</span>
                        RSD
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Col>
          <div className="col-4">
            <div className="total-div shadow payment-col">
              <h5><strong>SUBTOTAL:</strong> <span
                className="subtotal-price-span">{totalPrice.toLocaleString()}</span> RSD</h5>
              <h5><strong>SHIPPING:</strong> <span>0 RSD</span></h5>
              <h5><strong>TAX:</strong> <span className="tax-span">{(Math.round(totalPrice * 0.1 * 100) / 100).toLocaleString()}</span> RSD
                (10%)</h5>
              <h5 className="totalG2"><strong>TOTAL:</strong> <span
                className="total-price-span">{(Math.round((totalPrice + totalPrice * 0.1) * 100) / 100).toLocaleString()}</span> RSD
              </h5>
              <button className="btn btn-primary btn-lg checkout-btn">Checkout</button>
            </div>
          </div>
        </Row>
      </Container>
      <Footer />
    </>
  )
}

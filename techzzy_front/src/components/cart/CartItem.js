import React, { useContext, useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import axios from 'axios';
import { ApiContext, CurrentUserContext } from '../../App';

export default function CartItem({ product, totalPrice, setTotalPrice }) {
  const [quantity, setQuantity] = useState(0);
  const api = useContext(ApiContext);
  const { currentUser } = useContext(CurrentUserContext);

  useEffect(() => {
    setQuantity(product.count);
  }, []);

  function qtyUp() {
    if ((quantity + 1) <= product.stock) {
      setQuantity(quantity + 1);
      setTotalPrice(parseFloat(totalPrice) + parseFloat(product.price));
      axios.put(`${api}/product_carts/${product.pcID}`, { count: quantity + 1 }, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      }).then(response => {
        console.log(response.data);
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  function qtyDown() {
    if ((quantity - 1) > 0) {
      setQuantity(quantity - 1);
      setTotalPrice(parseFloat(totalPrice) - parseFloat(product.price));
      axios.put(`${api}/product_carts/${product.pcID}`, { count: quantity - 1 }, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      }).then(response => {
        console.log(response.data);
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  return (
    <Row key={product.id} className="cart-row">
      <Col>
        <div className="shadow d-flex cart-item">
          <div className="product-img-div">
            <a href="{{ url('/products') . '/' . $cart->product->id }}"><img className="product-img"
              src={product.img}
              alt="Image Error" />
            </a>
          </div>
          <Card.Body className="cart-body flex-fill">
            <Card.Title className="card-title mb-0"> <a href="{{ url('/products') . '/' . $cart->product->id }}">{product.name}</a></Card.Title>
            <Card.Title className="card-title mb-0">{product.category.name}</Card.Title>
            <Card.Title className="card-title">Stock: {product.stock}</Card.Title>
            <div className="mt-2 price">
              <span className="current-count-span">{quantity}</span> x
              <span className="original-product-price"> {(Math.round(product.price * 100) / 100).toLocaleString()} </span>
              RSD
            </div>
            <div className="quantity">
              <ul className="quantity-ul">
                <li onClick={() => qtyDown()} className="btn btn-outline-primary fw-bold li-minus"><i className="fas fa-minus"></i></li>
                <li className="btn btn-outline-primary fw-bold li-current">{product.count}</li>
                <li onClick={() => qtyUp()} className="btn btn-outline-primary fw-bold li-plus"><i className="fas fa-plus"></i></li>
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
                className="total-product-price"> {(Math.round(quantity * product.price * 100) / 100).toLocaleString()} </span>
              RSD
            </div>
          </Card.Body>
        </div>
      </Col>
    </Row>
  )
}

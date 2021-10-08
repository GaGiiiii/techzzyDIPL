import React, { useState, useContext } from 'react'
import { Card, Button } from 'react-bootstrap'
import axios from 'axios';
import { ApiContext, CurrentUserContext } from '../../App';

export default function ProductInfo({ product }) {
  const [quantity, setQuantity] = useState(1);
  const api = useContext(ApiContext);
  const {currentUser} = useContext(CurrentUserContext);

  function qtyUp() {
    if ((quantity + 1) <= product.stock) {
      setQuantity(quantity + 1);
    }
  }

  function qtyDown() {
    if ((quantity - 1) > 0) {
      setQuantity(quantity - 1);
    }
  }

  function addToCart(e) {
    e.preventDefault();
    axios.post(`${api}/product_carts`, { product_id: product.id, count: quantity }, {headers: {
      Authorization: `Bearer ${currentUser.token}`
    }}).then(response => {
      // let user = response.data.user; // Get user
      // user.token = response.data.token; // Get token and set it to user
      // login(user); // Add User to Local Storage
      // setCurrentUser(response.data.user); // Set Global State
      // history.push('/dashboard'); // Redirect
      // setFlashMessage({ type: 'success', message: `Login successful. Welcome back ${user.username}!` }) // Add Flash Message
      console.log(response.data);
    }).catch((error) => {
      console.log(error);
    });
  }

  return (
    <Card className="product-card">
      <Card.Body>
        <Card.Title className="fw-bold product-title">{product.name}</Card.Title>
        <div className="mt-3">
          <p className="fw-bold m-0">
            <i className="fas fa-star"></i>
            &nbsp;10/10
          </p>
          <p className="fw-bold m-0">
            <i className="fas fa-tag"></i>
            <span className="original-price-span">&nbsp;{(Math.round(product.price * 100) / 100).toLocaleString()} {quantity > 1 ? `X${quantity} = ${(Math.round(quantity * product.price * 100) / 100).toLocaleString()}` : ''} </span> RSD
            <span className="changing-quantity-span"></span>
          </p>
          <p className="fw-bold">
            <i className="fas fa-shopping-cart"></i> In stock:
            <span className="original-stock-span">&nbsp;{product.stock}</span> pcs
          </p>
          <p className="mt-3">{product.desc}</p>
          <div className="fw-bold mt-4 mb-1 d-flex justify-content-between">
            <p className="mt-2">Quantity</p>
            <ul className="quantity-ul">
              <li className="btn btn-outline-primary fw-bold li-minus" onClick={() => qtyDown()}><i className="fas fa-minus"></i></li>
              <li className="btn btn-outline-primary fw-bold li-current">{quantity}</li>
              <li className="btn btn-outline-primary fw-bold li-plus" onClick={() => qtyUp()}><i className="fas fa-plus"></i></li>
            </ul>
          </div>
        </div>
        <Button onClick={addToCart} type="button" variant="outline-primary" className="add-to-cart-btn w-100 fw-bold mt-4">
          Add to cart
        </Button>
      </Card.Body>
    </Card>
  )
}

import React, { useContext, useEffect, useState } from 'react'
import { Card, Col, Modal, Row, Button } from 'react-bootstrap'
import axios from 'axios';
import { ApiContext, CurrentUserContext, ProductsInCartContext } from '../../App';
import { Link } from 'react-router-dom';

export default function CartItem({ product, totalPrice, setTotalPrice, setCartFlashMessage }) {
  const [quantity, setQuantity] = useState(0);
  const api = useContext(ApiContext);
  const { currentUser } = useContext(CurrentUserContext);
  const { productsInCart, setProductsInCart } = useContext(ProductsInCartContext);

  // MODAL
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    setQuantity(product.count);
  }, [product.count]);

  function qtyUp() {
    if ((quantity + 1) <= product.stock) {
      setQuantity(quantity + 1);
      product.count = quantity + 1;
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
      product.count = quantity - 1;
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

  function deleteFormCart() {
    axios.delete(`${api}/product_carts/${product.pcID}`, {
      headers: {
        Authorization: `Bearer ${currentUser.token}`
      }
    }).then(response => {
      console.log(response.data);
      setCartFlashMessage({ type: 'success', message: `Product removed from cart.` }) // Add Flash Message
      let newProductsInCart = [...productsInCart];
      newProductsInCart.splice(newProductsInCart.indexOf(product), 1);
      setProductsInCart(newProductsInCart);
    }).catch((error) => {
      console.log(error);
    });
  }

  return (
    <>
      <Row key={product.id} className="cart-row">
        <Col>
          <div className="shadow d-flex cart-item">
            <div className="product-img-div">
              <Link to={`/products/${product.id}`}>
                <img className="product-img" src={product.img} alt="Couldn't load." />
              </Link>
            </div>
            <Card.Body className="cart-body flex-fill">
              <Card.Title className="card-title mb-0"><Link to={`/products/${product.id}`}>{product.name}</Link></Card.Title>
              <Card.Title className="card-title mb-0">{product.category.name}</Card.Title>
              <Card.Title className="card-title">Stock: {product.stock}</Card.Title>
              <div className="mt-2 price">
                <span className="current-count-span">{quantity}</span> x
                <span className="original-product-price"> {(Math.round(product.price * 100) / 100).toLocaleString()} </span>
                &euro;
              </div>
              <div className="quantity">
                <ul className="quantity-ul">
                  <li onClick={() => qtyDown()} className="btn btn-outline-primary fw-bold li-minus"><i className="fas fa-minus"></i></li>
                  <li className="btn btn-outline-primary fw-bold li-current">{quantity}</li>
                  <li onClick={() => qtyUp()} className="btn btn-outline-primary fw-bold li-plus"><i className="fas fa-plus"></i></li>
                  <li onClick={(e) => { handleShow(); }} className="btn btn-outline-primary fw-bold li-delete">
                    <i className="fas fa-trash"></i>
                  </li>
                </ul>
              </div>
              <div className="total fw-bold">Total:
                <span
                  className="total-product-price"> {(Math.round(quantity * product.price * 100) / 100).toLocaleString()} </span>
                &euro;
              </div>
            </Card.Body>
          </div>
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure that you want to delete <strong>{product.name}</strong> from cart?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="danger" onClick={() => { handleClose(); deleteFormCart(); }}>
            Yes
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

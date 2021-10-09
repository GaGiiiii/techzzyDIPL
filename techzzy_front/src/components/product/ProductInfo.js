import React, { useState, useContext, useEffect } from 'react'
import { Card, Button } from 'react-bootstrap'
import axios from 'axios';
import { ApiContext, CurrentUserContext, FlashMessageContext, ProductsInCartContext } from '../../App';

export default function ProductInfo({ product }) {
  const [quantity, setQuantity] = useState(1);
  const api = useContext(ApiContext);
  const { currentUser } = useContext(CurrentUserContext);
  const { productsInCart, setProductsInCart } = useContext(ProductsInCartContext);
  const { setFlashMessage } = useContext(FlashMessageContext);
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    setInCart(productsInCart.find(productP => parseInt(productP.id) === parseInt(product.id)));
  }, [product.id, productsInCart]);

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
    axios.post(`${api}/product_carts`, { product_id: product.id, count: quantity }, {
      headers: {
        Authorization: `Bearer ${currentUser.token}`
      }
    }).then(response => {
      setFlashMessage({ type: 'success', message: `Product added to cart.` }) // Add Flash Message
      let copyArr = [...productsInCart];
      let copyP = {...product}; // We are making copy of product cuz we need to append pcID and count
      copyP.pcID = response.data.product_cart.id;
      copyP.count = response.data.product_cart.count;
      copyArr.push(copyP);
      setProductsInCart(copyArr);
    }).catch((error) => {
      console.log(error);
    });
  }

  function deleteFromCart(e) {
    e.preventDefault();
    axios.delete(`${api}/product_carts/${inCart.pcID}`, {
      headers: {
        Authorization: `Bearer ${currentUser.token}`
      }
    }).then(response => {
      setFlashMessage({ type: 'success', message: `Product removed from cart.` }) // Add Flash Message
      let newProductsInCart = [...productsInCart];
      newProductsInCart.splice(newProductsInCart.indexOf(product), 1);
      setProductsInCart(newProductsInCart);
      setInCart(false);
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
        {inCart !== undefined ?
          <Button onClick={deleteFromCart} type="button" variant="outline-primary" className="add-to-cart-btn w-100 fw-bold mt-4">
            Remove from cart
          </Button> :
          <Button onClick={addToCart} type="button" variant="outline-primary" className="add-to-cart-btn w-100 fw-bold mt-4">
            Add to cart
          </Button>
        }

      </Card.Body>
    </Card>
  )
}

import React, { useState, useContext, useEffect } from 'react'
import { Card, Button } from 'react-bootstrap'
import axios from 'axios';
import { ApiContext, CurrentUserContext, FlashMessageContext, ProductsInCartContext } from '../../App';
import { calculateProductRating } from '../../Helpers';
import { ProductsContext } from '../../App';

export default function ProductInfo({ product, setProduct }) {
  const [quantity, setQuantity] = useState(1);
  const api = useContext(ApiContext);
  const { currentUser } = useContext(CurrentUserContext);
  const { productsInCart, setProductsInCart } = useContext(ProductsInCartContext);
  const { setFlashMessage } = useContext(FlashMessageContext);
  const [inCart, setInCart] = useState(false);
  const [usersRating, setUsersRating] = useState(0);
  const [stars, setStars] = useState([]);
  const { products, setProducts } = useContext(ProductsContext);

  useEffect(() => {
    setInCart(productsInCart.find(productP => parseInt(productP.id) === parseInt(product.id)));
  }, [product.id, productsInCart]);

  useEffect(() => {
    let rating = product.ratings.find(rating => rating.user_id === currentUser.id);
    if (rating) {
      setUsersRating(rating.rating);
    }
  }, [product, currentUser]);

  useEffect(() => {
    const handleHover = (e) => {
      let rating = e.currentTarget.dataset.starNumber;
      setStars(initStars(rating));
    }

    const handleLeave = () => {
      setStars(initStars(usersRating));
    }

    const rateProduct = (e) => {
      let rating = e.currentTarget.dataset.starNumber;
      rating = parseInt(rating);
      if (usersRating > 0) { // User already rated this product
        console.log(product);
        let ratingID = product.ratings.find(r => r.user_id === currentUser.id).id;
        axios.put(`${api}/ratings/${ratingID}`, { product_id: product.id, user_id: currentUser.id, rating }, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        }).then(response => {
          setFlashMessage({ type: 'success', message: `Product rated ${rating}/10.` }) // Add Flash Message
          setUsersRating(rating);
          updateProducts(response, 2);
        }).catch((error) => {
          console.log(error);
        });
      } else { // User is rating this product first time
        axios.post(`${api}/ratings`, { product_id: product.id, user_id: currentUser.id, rating }, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        }).then(response => {
          setFlashMessage({ type: 'success', message: `Product rated ${rating}/10.` }) // Add Flash Message
          setUsersRating(rating);
          updateProducts(response, 1);
        }).catch((error) => {
          console.log(error);
        });
      }
    }

    const updateProducts = (response, type) => {
      // Type - 1 - insert, 2 - update
      let productsG = [...products];
      let foundProduct = products.find(productHelp => productHelp.id === product.id);

      if (type === 1) { // Insert
        foundProduct.ratings.push(response.data.rating);
        setProducts(productsG);
      } else if (type === 2) { // Update
        foundProduct.ratings.find(r => r.id === response.data.rating.id).rating = response.data.rating.rating;
        setProducts(productsG);
      }
    }

    const initStars = (rating) => {
      let starsG = [];
      rating = parseInt(rating);

      for (let i = 1; i <= rating; i++) {
        starsG.push(<li className="starG" onClick={rateProduct} onMouseOver={handleHover} onMouseLeave={handleLeave} data-star-number={i} key={i}><i className="fas fa-star yellow"></i></li>);
      }

      for (let i = rating + 1; i <= 10; i++) {
        starsG.push(<li className="starG" onClick={rateProduct} onMouseOver={handleHover} onMouseLeave={handleLeave} data-star-number={i} key={i}><i className="fas fa-star"></i></li>);
      }

      return starsG;
    };

    setStars(initStars(usersRating));
  }, [currentUser, usersRating, product, setFlashMessage, api, products, setProducts]);

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
    if (currentUser) {
      axios.post(`${api}/product_carts`, { product_id: product.id, count: quantity }, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      }).then(response => {
        setFlashMessage({ type: 'success', message: `Product added to cart.` }) // Add Flash Message
        let copyArr = [...productsInCart];
        let copyP = { ...product }; // We are making copy of product cuz we need to append pcID and count
        copyP.pcID = response.data.product_cart.id;
        copyP.count = response.data.product_cart.count;
        copyArr.push(copyP);
        setProductsInCart(copyArr);
      }).catch((error) => {
        console.log(error);
      });
    }else{
      setFlashMessage({ type: 'danger', message: `You need to be logged in.` }) // Add Flash Message
    }
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
    <Card className="product-card shadow">
      <Card.Body>
        <Card.Title className="fw-bold product-title">{product.name}</Card.Title>
        <div className="mt-3">
          <p className="fw-bold m-0">
            <i className="fas fa-star"></i> {calculateProductRating(product)}/10&nbsp;{currentUser && `(${usersRating}/10)`}
          </p>
          {currentUser && <ul className="stars-ul">{stars && stars}</ul>}
          <p className="fw-bold m-0">
            <i className="fas fa-tag"></i>
            <span className="original-price-span">&nbsp;{(Math.round(product.price * 100) / 100).toLocaleString()} {quantity > 1 ? `X${quantity} = ${(Math.round(quantity * product.price * 100) / 100).toLocaleString()}` : ''} </span> &euro;
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

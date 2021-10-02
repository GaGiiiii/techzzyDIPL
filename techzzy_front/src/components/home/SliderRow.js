import React, { useState } from 'react'
import { useEffect } from 'react';
import {
  Row, Card,
} from "react-bootstrap";
import TinySlider from "tiny-slider-react";
import { useContext } from 'react';
import { ApiContext } from '../../App';
const axios = require('axios');

export default function SliderRow(props) {
  const api = useContext(ApiContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios({
      method: 'GET',
      url: `${api}/api/products`,
    }).then(res => {
      setProducts(sortProducts(res.data.products));
    }).catch(err => console.log(err));
  }, []);

  const tinySettings = {
    controls: false,
    mouseDrag: true,
    loop: true,
    navPosition: "bottom",
    gutter: 50,
    speed: 1200,
    responsive: {
      0: {
        items: 1,
      },
      565: {
        items: 2,
      },
      991: {
        items: 4,
      },
      1367: {
        items: 5,
      }
    }
  };

  function calculateProductRating(product) {
    let rating = 0;

    for (let i = 0; i < product.ratings.length; i++) {
      rating += product.ratings[i].rating;
    }

    return (Math.round(rating / product.ratings.length * 100) / 100) || 0;
  }

  function sortProducts(productsP) {
    switch (props.type) {
      case 1: // Latest
        break;
      case 2: // Most Liked

        break;
      case 3: // Most Commented
        for (let i = 0; i < productsP.length - 1; i++) {
          for (let j = i + 1; j < productsP.length; j++) {
            if (productsP[i].comments.length < productsP[j].comments.length) {
              let help = productsP[i];
              productsP[i] = productsP[j];
              productsP[j] = help;
            }
          }
        }
        break;
    }

    return productsP.splice(0, 20);
  }

  return (
    <Row className="gx-0">
      <h1 className="section-title">{props.type == 1 ? 'Latest' : props.type == 2 ? 'Most Liked' : 'Most Commented'} Products<hr className="hr-title" /></h1>
      <TinySlider settings={tinySettings}>
        {products && products.map(product => (
          <a key={product.id} className="card-link-outer" href={`/products/${product.id}`} draggable={false}>
            <div className="item">
              <Card className="p-0 shadow-sm">
                <Card.Img variant="top" src={product.img} />
                <Card.Body>
                  <Card.Title className="card-title">{product.name}</Card.Title>
                  <p className="fw-bold m-0">
                    <i className="fas fa-star"></i>
                    &nbsp;{calculateProductRating(product)} / 10
                  </p>
                  <p className="fw-bold m-0">
                    <i className="fas fa-tag"></i> {(Math.round(product.price * 100) / 100).toLocaleString()} RSD
                  </p>
                </Card.Body>
              </Card>
            </div>
          </a>
        ))}
      </TinySlider>
    </Row>
  )
}

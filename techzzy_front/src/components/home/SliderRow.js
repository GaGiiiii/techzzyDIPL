import React, { useState } from 'react'
import { Row, Card } from "react-bootstrap";
import TinySlider from "tiny-slider-react";
import { Link } from "react-router-dom";

export default function SliderRow({ products, type }) {
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

  function sortProducts(products) {
    let productsP = [...products];

    switch (type) {
      case 1: // Latest
        break;
      case 2: // Most Liked
        productsP.sort((a, b) => calculateProductRating(b) - calculateProductRating(a));
        break;
      case 3: // Most Commented
        productsP.sort((a, b) => b.comments.length - a.comments.length);
        break;
    }

    return productsP.splice(0, 20);
  }

  return (
    <Row className="gx-0 mt-5">
      <h1 className="section-title">{type == 1 ? 'Latest' : type == 2 ? 'Most Liked' : 'Most Commented'} Products<hr className="hr-title" /></h1>
      <TinySlider settings={tinySettings}>
        {products && sortProducts(products).map(product => (
          <Link to={`/products/${product.id}`} key={product.id} className="card-link-outer" draggable={false}>
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
          </Link>
        ))}
      </TinySlider>
    </Row>
  )
}

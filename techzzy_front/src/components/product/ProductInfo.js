import React from 'react'
import { Card, Button } from 'react-bootstrap'

export default function ProductInfo({ product }) {
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
            <span className="original-price-span">&nbsp;{(Math.round(product.price * 100) / 100).toLocaleString()}</span> RSD
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
              <li className="btn btn-outline-primary fw-bold li-minus"><i className="fas fa-minus"></i></li>
              <li className="btn btn-outline-primary fw-bold li-current">1</li>
              <li className="btn btn-outline-primary fw-bold li-plus"><i className="fas fa-plus"></i></li>
            </ul>
          </div>
        </div>
        <Button type="button" variant="outline-primary" className="add-to-cart-btn w-100 fw-bold mt-4">
          Add to cart
        </Button>
      </Card.Body>
    </Card>
  )
}

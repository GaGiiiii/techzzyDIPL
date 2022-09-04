import React, { useContext } from 'react'
import './product.css';
import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import NavbarC from '../NavbarC';
import Footer from '../Footer';
import { Container, Row, Card, Col } from 'react-bootstrap';
import Comments from './Comments';
import ProductInfo from './ProductInfo';
import { ProductsContext } from '../../App';

export default function Product() {
  let { productID } = useParams();
  const [product, setProduct] = useState(undefined);
  const { products } = useContext(ProductsContext);

  useEffect(() => {
    setProduct(products.find(productG => { return productG.id === parseInt(productID) }));
  }, [products, productID]);

  return (
    <>
      <NavbarC active="products" />
      {product &&
        <Container>
          <Row className="mt-5 mb-5">
            <Col md={6} className='order-2 order-md-1 mt-3 mt-md-0'>
              <Card className='shadow'>
                <img src={product.img} className="card-img-top" alt="Couldn't load." />
              </Card>
            </Col>
            <Col md={6} className="mt-sm-0 order-1 order-md-2">
              <ProductInfo product={product} setProduct={setProduct} />
            </Col>
          </Row>
          <Comments product={product} />
        </Container>}
      <Footer />
    </>
  )
}

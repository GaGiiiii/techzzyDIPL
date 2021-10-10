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
            <Col sm={6}>
              <Card>
                <img src={product.img} className="card-img-top thumbnail" alt="Couldn't load." />
              </Card>
            </Col>
            <Col sm={6} className="mt-5 mt-sm-0">
              <ProductInfo product={product} setProduct={setProduct} />
            </Col>
          </Row>
          <Comments product={product} />
        </Container>}
      <Footer />
    </>
  )
}

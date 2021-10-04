import React from 'react'
import './product.css';
import { useParams } from "react-router-dom";
import { ApiContext } from '../../App';
import { useContext, useEffect, useState } from 'react';
import NavbarC from '../NavbarC';
import Footer from '../Footer';
const axios = require('axios');

export default function Product({ products }) {
  let { productID } = useParams();
  const api = useContext(ApiContext);
  const [product, setProduct] = useState(undefined);

  useEffect(() => {
    axios({
      method: 'GET',
      url: `${api}/api/products/${productID}`,
    })
      .then((res) => {
        setProduct(res.data.product);
      })
      .catch(err => console.log(err));
  }, [])

  return (
    <>
      <NavbarC products={products} active="products" />
      {product && product.name}
      <Footer />
    </>
  )
}

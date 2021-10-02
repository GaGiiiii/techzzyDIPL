import React from 'react'
import {
  Container
} from "react-bootstrap";
import './index.css';
import SliderRow from './SliderRow';
import Footer from '../Footer';
import NavbarC from '../NavbarC';
import { useState, useEffect, useContext } from 'react';
import { ApiContext } from '../../App';
const axios = require('axios');

export default function Index() {
  const api = useContext(ApiContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios({
      method: 'GET',
      url: `${api}/api/products`,
    }).then(res => {
      setProducts(res.data.products);
    }).catch(err => console.log(err));
  }, []);

  return (
    <div>
      <NavbarC products={products} />

      <Container className="mt-5 mb-5">
        <SliderRow products={products} type={1} /> {/* Type 1 - Latest */}
        <SliderRow products={products} type={2} /> {/* Type 2 - MostLiked */}
        <SliderRow products={products} type={3} /> {/* Type 3 - MostCommented */}
      </Container>

      <Footer />
    </div>
  )
}

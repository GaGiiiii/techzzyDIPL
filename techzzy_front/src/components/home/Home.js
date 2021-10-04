import React from 'react'
import { Container } from "react-bootstrap";
import './home.css';
import SliderRow from './SliderRow';
import Footer from '../Footer';
import NavbarC from '../NavbarC';
import { useContext } from 'react';
import { CurrentUserContext } from '../../App';

export default function Home({ products }) {

  return (
    <div>
      <NavbarC products={products} active="home" />

      <Container className="mt-5 mb-5">
        <SliderRow products={products} type={1} /> {/* Type 1 - Latest */}
        <SliderRow products={products} type={2} /> {/* Type 2 - MostLiked */}
        <SliderRow products={products} type={3} /> {/* Type 3 - MostCommented */}
      </Container>

      <Footer />
    </div>
  )
}

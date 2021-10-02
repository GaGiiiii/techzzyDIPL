import React from 'react'
import {
  Container
} from "react-bootstrap";
import './index.css';
import SliderRow from './SliderRow';
import Footer from '../Footer';
import NavbarC from '../NavbarC';

export default function Index() {

  return (
    <div>
      <NavbarC />

      <Container className="mt-5 mb-5">
        <SliderRow type={1} /> {/* Type 1 - Latest */}
        <SliderRow type={2} /> {/* Type 2 - MostLiked */}
        <SliderRow type={3} /> {/* Type 3 - MostCommented */}
      </Container>

      <Footer />
    </div>
  )
}

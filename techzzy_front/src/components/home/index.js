import React from 'react'
import {
  Navbar, Container, Nav, NavDropdown, Row, Col, Card, Button,
} from "react-bootstrap";
import './index.css';
import Search from "./search.js";
import { useContext } from 'react';
import { ApiContext } from '../../App';
import { useState } from 'react';
import { useEffect } from 'react';
import TinySlider from "tiny-slider-react";
const axios = require('axios');

export default function Index() {
  const api = useContext(ApiContext);
  const [products, setProducts] = useState([]);
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

  function calculateProductRating(product){
    let rating = 0;

    for(let i = 0; i < product.ratings.length; i++){
      rating += product.ratings[i].rating;
    }

    return (Math.round(rating / product.ratings.length * 100) / 100) || 0;
  }

  useEffect(() => {
    axios({
      method: 'GET',
      url: `${api}/api/products`,
    }).then(res => {
      setProducts(res.data.products.slice(0, 20));
    }).catch(err => console.log(err));
  }, []);

  let loggedIn = false;

  return (
    <div>
      <Navbar className="navbar text-white" bg="primary" expand="lg">
        <Container>
          <Navbar.Brand className="text-white fw-bold" href="/">Techzzy <i className="fas fa-desktop"></i></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/" className="active">Home</Nav.Link>
              <Nav.Link href="/products">Products</Nav.Link>
            </Nav>
            <Search />
            <Nav className="ms-auto">
              {!loggedIn ?
                <>
                  <Nav.Link href="/login">Login</Nav.Link>
                  <Nav.Link href="/register">Register</Nav.Link>
                </>
                : <NavDropdown title="GaGiiiii" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">Dashboard</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.2">Admin</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.3">Logout</NavDropdown.Item>
                </NavDropdown>
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <Row className="gx-0">
          <h1 className="section-title">Latest Products<hr className="hr-title" /></h1>
          <TinySlider settings={tinySettings}>
            {products.map(product => (
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
      </Container>
    </div>
  )
}

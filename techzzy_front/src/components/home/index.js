import React from 'react'
import {
  Navbar, Container, Nav, NavDropdown
} from "react-bootstrap";
import './index.css';
import Search from './Search';
import SliderRow from './SliderRow';
import Footer from '../Footer';

export default function Index() {
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

      <Container className="mt-5 mb-5">
        <SliderRow type={1} /> {/* Type 1 - Latest */}
        <SliderRow type={2} /> {/* Type 2 - MostLiked */}
        <SliderRow type={3} /> {/* Type 3 - MostCommented */}
      </Container>

      <Footer />
    </div>
  )
}

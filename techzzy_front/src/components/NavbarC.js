import React from 'react'
import Search from './Search/Search';
import {
  Navbar, Container, Nav, NavDropdown
} from "react-bootstrap";

export default function NavbarC({products}) {
  let loggedIn = false;

  return (
    <Navbar className="navbar text-white" bg="primary" expand="lg">
      <Container>
        <Navbar.Brand className="text-white fw-bold" href="/">Techzzy <i className="fas fa-desktop"></i></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/" className="active">Home</Nav.Link>
            <Nav.Link href="/products">Products</Nav.Link>
          </Nav>
          <Search products={products} />
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
  )
}

import React from 'react'
import Search from './Search/Search';
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CurrentUserContext } from '../App';
import { useContext } from 'react';
import { logout } from '../Helpers';

export default function NavbarC({ products, active }) {
  const {currentUser, setCurrentUser} = useContext(CurrentUserContext);

  function handleLogout(){
    logout();
    setCurrentUser(null);
  }

  return (
    <Navbar className="navbar text-white" bg="primary" expand="lg">
      <Container>
        <Navbar.Brand className="text-white fw-bold"><Link to="/" className="text-white text-decoration-none">Techzzy  <i className="fas fa-desktop"></i></Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className={active == "home" ? 'active' : ''}>Home</Nav.Link>
            <Nav.Link as={Link} to="/products" className={active == "products" ? 'active' : ''}>Products</Nav.Link>
          </Nav>
          <Search products={products} />
          <Nav className="ms-auto">
            {currentUser == null ?
              <>
                <Nav.Link as={Link} to="/login" className={active == "login" ? 'active' : ''}>Login</Nav.Link>
                <Nav.Link as={Link} to="/register" className={active == "register" ? 'active' : ''}>Register</Nav.Link>
              </>
              : <NavDropdown title={currentUser.username} id="basic-nav-dropdown">
                <NavDropdown.Item>Dashboard</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item>Admin</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => handleLogout()}>Logout</NavDropdown.Item>
              </NavDropdown>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

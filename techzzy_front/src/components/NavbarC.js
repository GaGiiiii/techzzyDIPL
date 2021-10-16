import React, { useContext } from 'react'
import Search from './Search/Search';
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CurrentUserContext, FlashMessageContext, ProductsInCartContext } from '../App';
import { logout } from '../Helpers';
import { useHistory } from 'react-router';
import AlertC from './AlertC';

export default function NavbarC({ active }) {
  let history = useHistory();
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const { flashMessage, setFlashMessage } = useContext(FlashMessageContext);
  const { productsInCart } = useContext(ProductsInCartContext);

  function handleLogout() {
    let username = currentUser.username; // Save Username Before Delete
    logout(currentUser); // Delete Tokens And Remove From Storage
    setCurrentUser(null); // Remove From Global State
    history.push('/'); // Redirect
    setFlashMessage({ type: 'success', message: `Logout successful. See ya soon ${username}!` }) // Add Flash Message
  }

  return (
    <>
      <Navbar className="navbar navbar-dark text-white" bg="primary" expand="lg">
        <Container>
          <Navbar.Brand className="text-white fw-bold"><Link to="/" className="text-white text-decoration-none">Techzzy  <i className="fas fa-desktop"></i></Link></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => setFlashMessage(null)} as={Link} to="/" className={active === "home" ? 'active' : ''}>Home</Nav.Link>
              <Nav.Link onClick={() => setFlashMessage(null)} as={Link} to="/products" className={active === "products" ? 'active' : ''}>Products</Nav.Link>
            </Nav>
            <Search />
            <Nav className="ms-auto">
              {currentUser == null ?
                <>
                  <Nav.Link onClick={() => setFlashMessage(null)} as={Link} to="/login" className={active === "login" ? 'active' : ''}>Login</Nav.Link>
                  <Nav.Link onClick={() => setFlashMessage(null)} as={Link} to="/register" className={active === "register" ? 'active' : ''}>Register</Nav.Link>
                </>
                :
                <>
                  <li className="nav-item">
                    <Link onClick={() => setFlashMessage(null)} to="/cart" className="cart position-relative d-inline-flex">
                      <i className="fas fa fa-shopping-cart fa-lg"></i>
                      <span className="cart-basket d-flex align-items-center justify-content-center">
                        {productsInCart.length}
                      </span>
                    </Link>
                  </li>
                  <NavDropdown className={active === "dashboard" ? 'active' : ''} title={currentUser.username} id="basic-nav-dropdown">
                    <NavDropdown.Item onClick={() => setFlashMessage(null)} as={Link} to="/dashboard">Dashboard</NavDropdown.Item>
                    <NavDropdown.Divider />
                    {currentUser.is_admin === 1 && <><NavDropdown.Item onClick={(e) => setFlashMessage(null)} as={Link} to='/admin'>Admin</NavDropdown.Item><NavDropdown.Divider /></>}
                    <NavDropdown.Item onClick={() => handleLogout()}>Logout</NavDropdown.Item>
                  </NavDropdown>
                </>
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {flashMessage &&
        <Container className="mt-5">
          <AlertC flashMessage={flashMessage} setFlashMessage={setFlashMessage} />
        </Container>
      }
    </>
  )
}

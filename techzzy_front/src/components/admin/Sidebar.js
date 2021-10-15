import React, { useContext } from 'react'
import { Col, Container, Navbar, Row } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom';
import { CurrentUserContext } from '../../App';

export default function Sidebar({ setActivePage }) {
  const { currentUser } = useContext(CurrentUserContext);
  const history = useHistory();

  return (
    <div className='sidebar'>
      <header className='sidebar-header'>
        <Navbar.Brand className="fw-bold text-center"><Link to="/" className="text-decoration-none">Techzzy  <i className="fas fa-desktop"></i></Link></Navbar.Brand>
      </header>
      <div className='sidebar-body'>
        <Container fluid className='g-0'>
          <Row className='admin-user-info'>
            <Col xs={"auto"} className='g-0'>
              <img className='admin-img' src={currentUser.img ? `http://localhost:8000/avatars/${currentUser.username}/${currentUser.img}` : `http://localhost:8000/avatars/no_image.jpg`} alt="Couldn't load" />
            </Col>
            <Col className="d-flex align-items-center">
              {`${currentUser.first_name} ${currentUser.last_name}`}
            </Col>
          </Row>
          <Row>
            <ul className='admin-ul'>
              <li onClick={() => { history.push(`${window.location.pathname}`); setActivePage('products') }}><Row><Col className='pe-0 text-center' xs={'auto'} style={{ width: '35px' }}><i className="fas fa-shopping-cart"></i></Col> <Col>Products</Col> </Row></li>
              <li onClick={() => { history.push(`${window.location.pathname}`); setActivePage('categories') }}><Row><Col className='pe-0 text-center' xs={'auto'} style={{ width: '35px' }}><i className="fab fa-cuttlefish"></i></Col> <Col>Categories</Col> </Row></li>
              <li onClick={() => { history.push(`${window.location.pathname}`); setActivePage('users') }}><Row><Col className='pe-0 text-center' xs={'auto'} style={{ width: '35px' }}><i className="fas fa-user"></i></Col> <Col>Users</Col> </Row></li>
              <li onClick={() => { history.push(`${window.location.pathname}`); setActivePage('payments') }}><Row><Col className='pe-0 text-center' xs={'auto'} style={{ width: '35px' }}><i className="fas fa-money-check-alt"></i></Col> <Col>Payments</Col> </Row></li>
            </ul>
          </Row>
        </Container>
      </div>
    </div>
  )
}

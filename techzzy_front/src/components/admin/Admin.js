import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Col, Container, Navbar, Offcanvas, Row } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { ApiContext, CurrentUserContext, ProductsContext } from '../../App';
import axios from 'axios';
import './admin.css';

export default function Admin() {
  const { currentUser } = useContext(CurrentUserContext);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const { products, setProducts } = useContext(ProductsContext);
  const api = useContext(ApiContext);

  useEffect(() => {
    axios.get(`${api}/comments`, {
      headers: {
        Authorization: `Bearer ${currentUser.token}`
      }
    }).then(response => {
      setComments(response.data.comments);
    }).catch((error) => {
      console.log("Admin Error");
    });

    axios.get(`${api}/users`, {
      headers: {
        Authorization: `Bearer ${currentUser.token}`
      }
    }).then(response => {
      setUsers(response.data.users);
    }).catch((error) => {
      console.log("Admin Error");
    });

    axios.get(`${api}/payments`, {
      headers: {
        Authorization: `Bearer ${currentUser.token}`
      }
    }).then(response => {
      setPayments(response.data.payments);
    }).catch((error) => {
      console.log("Admin Error");
    });
  }, []);

  return (
    <>
      <Container fluid className='h-100'>
        <Row className='h-100'>
          <Col xs={"auto"} className='g-0'>
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
                      <li><Row><Col className='pe-0 text-center' xs={'auto'} style={{ width: '35px' }}><i className="fas fa-shopping-cart"></i></Col> <Col>Products</Col> </Row></li>
                      <li><Row><Col className='pe-0 text-center' xs={'auto'} style={{ width: '35px' }}><i className="fab fa-cuttlefish"></i></Col> <Col>Categories</Col> </Row></li>
                      <li><Row><Col className='pe-0 text-center' xs={'auto'} style={{ width: '35px' }}><i className="fas fa-user"></i></Col> <Col>Users</Col> </Row></li>
                      <li><Row><Col className='pe-0 text-center' xs={'auto'} style={{ width: '35px' }}><i className="fas fa-money-check-alt"></i></Col> <Col>Payments</Col> </Row></li>
                    </ul>
                  </Row>
                </Container>
              </div>
            </div>
          </Col>
          <Col className='mt-5'>
            <Container fluid>
              <Row>
                <Col>
                  <Card className='admin-card shadow d-flex'><div className='admin-text'>Total products - {products && products.length} </div><div><i className="fas fa-shopping-cart"></i></div></Card></Col>
                <Col>
                  <Card className='admin-card shadow'><div className='admin-text'>Total comments - {comments && comments.length}</div><div><i className="fas fa-comment"></i></div></Card></Col>
                <Col>
                  <Card className='admin-card shadow'><div className='admin-text'>Total users - {users && users.length}</div><div><i className="fas fa-users"></i></div></Card></Col>
                <Col>
                  <Card className='admin-card shadow'><div className='admin-text'>Total payments - {payments && payments.length}<br />Total Earnings: {payments.length > 0 && payments.reduce((sum, {price}) => sum + parseFloat(price), 0).toLocaleString()} &euro;</div><div><i className="fas fa-money-check-alt"></i></div></Card></Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  )
}

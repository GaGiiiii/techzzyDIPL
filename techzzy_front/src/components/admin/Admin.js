import React, { useContext, useEffect, useState } from 'react'
import { Container, Col, Row } from 'react-bootstrap';
import { ApiContext, CurrentUserContext, ProductsContext } from '../../App';
import axios from 'axios';
import './admin.css';
import Sidebar from './Sidebar';
import Cards from './Cards';
import Products from './Products';

export default function Admin() {
  const { currentUser } = useContext(CurrentUserContext);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const { products } = useContext(ProductsContext);
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
  }, [api, currentUser]);

  return (
    <>
      <Container fluid className='h-100'>
        <Row className='h-100'>
          <Col xs={"auto"} className='g-0'>
            <Sidebar />
          </Col>
          <Col className='mt-5'>
            <Container fluid>
              <Row>
                <Cards products={products} users={users} comments={comments} payments={payments} />
              </Row>
              <Row className='mt-5'>
                <Products />
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  )
}

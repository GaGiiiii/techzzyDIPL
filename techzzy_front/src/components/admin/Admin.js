import React, { useContext, useEffect, useState } from 'react'
import { Container, Col, Row } from 'react-bootstrap';
import { ApiContext, CurrentUserContext, ProductsContext } from '../../App';
import axios from 'axios';
import './admin.css';
import Sidebar from './Sidebar';
import Cards from './Cards';
import Products from './Products';
import Categories from './Categories';
import Users from './Users';
import Payments from './Payments';

export default function Admin() {
    const { currentUser } = useContext(CurrentUserContext);
    const [comments, setComments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [payments, setPayments] = useState([]);
    const { products } = useContext(ProductsContext);
    const { api } = useContext(ApiContext);
    const [activePage, setActivePage] = useState('products');

    useEffect(() => {
        axios.get(`${api}/categories`).then(res => {
            setCategories(res.data.categories);
        }).catch(err => console.log(err));

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
        return () => {
            setCategories(null);
            setComments(null);
            setUsers(null);
            setPayments(null);
        }
    }, [api, currentUser]);

    return (
        <>
            <Container fluid className='h-100'>
                <Row className='h-100'>
                    <Col sm={4} md={3} xl={2} className='g-0'>
                        <Sidebar setActivePage={setActivePage} />
                    </Col>
                    <Col className='mt-5' xl={10} md={9} sm={8}>
                        <Container fluid>
                            <Row>
                                <Cards products={products} users={users} comments={comments} payments={payments} />
                            </Row>
                            <Row className='mt-5'>
                                {activePage === 'products' && <Products categories={categories} />}
                                {activePage === 'categories' && <Categories categories={categories} setCategories={setCategories} />}
                                {activePage === 'users' && <Users users={users} />}
                                {activePage === 'payments' && <Payments payments={payments} />}
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

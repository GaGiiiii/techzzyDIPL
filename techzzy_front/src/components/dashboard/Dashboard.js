import React, { useContext, useEffect, useState } from 'react'
import Footer from '../Footer';
import NavbarC from '../NavbarC';
import { ApiContext, CurrentUserContext, FlashMessageContext } from '../../App';
import './dashboard.css';
import { Accordion, Alert, Card, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { login } from '../../Helpers';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { formatDate } from '../../Helpers';

export default function Dashboard({ products }) {
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const { setFlashMessage } = useContext(FlashMessageContext);
    const [errors, setErrors] = useState(null);
    const [show, setShow] = useState(true);
    const [payments, setPayments] = useState([]);

    // Fields
    const [firstName, setFirstName] = useState(currentUser.first_name);
    const [lastName, setLastName] = useState(currentUser.last_name);
    const [username, setUsername] = useState(currentUser.username);
    const [email, setEmail] = useState(currentUser.email);
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [image, setImage] = useState("");
    const { api } = useContext(ApiContext);
    const { backURL } = useContext(ApiContext);
    const imgSRC = currentUser.img ? `${backURL}/avatars/${currentUser.username}/${currentUser.img}` : `${backURL}/avatars/no_image.jpg`;
    console.log(currentUser);


    useEffect(() => {
        axios.get(`${api}/users/${currentUser.id}/payments`, {
            headers: {
                'Authorization': `Bearer ${currentUser.token}`,
            }
        }).then(response => {
            setPayments(response.data.payments);
        }).catch((error) => {
            console.log(error);
        });
    }, [api, currentUser]);

    function handleChanges(e) {
        e.preventDefault();
        let formData = new FormData();

        formData.append('first_name', firstName);
        formData.append('last_name', lastName);
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('password_confirmation', password2);
        if (image) {
            formData.append('img', image);
        }
        formData.append('_method', 'PUT');

        axios.post(`${api}/users/${currentUser.id}`, formData, {
            headers: {
                'Authorization': `Bearer ${currentUser.token}`,
                'Accept': 'multipart/form-data',
                'Content-Type': 'multipart/form-data',
            }
        }).then(response => {
            let token = currentUser.token;
            let newUser = response.data.user;
            newUser.token = token;
            console.log(newUser);
            login(newUser); // Update Storage With New Data
            setCurrentUser(newUser); // Update State
            // Empty Password Fields
            setPassword('');
            setPassword2('');
            setFlashMessage({ type: 'success', message: `Profile updated successfully` }) // Add Flash Message
        }).catch((error) => {
            setErrors(Object.values(error.response.data.errors));
            setShow(true);
        });
    }

    return (
        <>
            <NavbarC products={products} />
            <Container className='mb-5'>
                {currentUser && <div className="main-body mt-5">
                    <Row className='equal'>
                        <Col lg={4} style={{ height: `100%` }}>
                            <Card className="shadow">
                                <Card.Body>
                                    <div className="d-flex flex-column align-items-center text-center">
                                        <img src={`${imgSRC}`} alt="Couldn't load." className="rounded-circle p-1 bg-primary" style={{ width: `110px`, }} />
                                        <div className="mt-3">
                                            <h4>{`${currentUser.first_name} ${currentUser.last_name}`}</h4>
                                            <p className="text-secondary mb-1">{currentUser.username}</p>
                                            <p className="text-muted font-size-sm">{currentUser.email}</p>
                                        </div>
                                    </div>
                                    <hr className="my-4" />
                                    <Accordion>
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header><i className="fas fa-comment" style={{ top: `2px`, position: `relative` }}></i>&nbsp; {currentUser.comments ? currentUser.comments.length : 0} - Comments</Accordion.Header>
                                            <Accordion.Body>
                                                {currentUser.comments && currentUser.comments.length > 0 ? currentUser.comments.map(comment => (
                                                    <Link className="cmnt" key={comment.id} to={`/products/${comment.product.id}`}><li>{comment.product.name}</li></Link>
                                                )) : 'No comments.'}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                        <Accordion.Item eventKey="1">
                                            <Accordion.Header><i className="fas fa-star"></i>&nbsp;{currentUser.ratings ? currentUser.ratings.length : 0} - Ratings</Accordion.Header>
                                            <Accordion.Body>

                                                {currentUser.ratings && currentUser.ratings.length > 0 ? currentUser.ratings.map(rating => (
                                                    <Link className="cmnt" key={rating.id} to={`/products/${rating.product.id}`}><li>{rating.product.name}</li></Link>
                                                )) : 'No ratings.'}

                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={8} className='mt-5 mt-lg-0'>
                            <Card className='shadow'>
                                <Card.Body>
                                    {errors && show &&
                                        <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                                            <ul className="mb-0">
                                                {errors.map((error, index) => (
                                                    <li key={index}>{error[0]}</li>
                                                ))}
                                            </ul>
                                        </Alert>
                                    }
                                    <Form onSubmit={handleChanges}>
                                        <Row className="mb-3">
                                            <Col sm={3}>
                                                <h6 className="mb-0">First Name</h6>
                                            </Col>
                                            <Col sm={9} className="text-secondary">
                                                <input onChange={(e) => setFirstName(e.target.value)} value={firstName} type="text" name="first_name" className="form-control" />
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col sm={3}>
                                                <h6 className="mb-0">Last Name</h6>
                                            </Col>
                                            <Col sm={9} className="text-secondary">
                                                <input onChange={(e) => setLastName(e.target.value)} value={lastName} type="text" name="last_name" className="form-control" />
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col sm={3}>
                                                <h6 className="mb-0">Username</h6>
                                            </Col>
                                            <Col sm={9} className="text-secondary">
                                                <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" name="username" className="form-control" />
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col sm={3}>
                                                <h6 className="mb-0">Email</h6>
                                            </Col>
                                            <Col sm={9} className="text-secondary">
                                                <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" name="email" className="form-control" />
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col sm={3}>
                                                <h6 className="mb-0">Password</h6>
                                            </Col>
                                            <Col sm={9} className="text-secondary">
                                                <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" name="password" className="form-control" />
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col sm={3}>
                                                <h6 className="mb-0">Confirm Password</h6>
                                            </Col>
                                            <Col sm={9} className="text-secondary">
                                                <input onChange={(e) => setPassword2(e.target.value)} value={password2} type="password" name="password_confirmation" className="form-control" />
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col sm={3}>
                                                <h6 className="mb-0">Image</h6>
                                            </Col>
                                            <Col sm={9} className="text-secondary">
                                                <input onChange={(e) => setImage(e.target.files[0])} type="file" name="img" className="form-control" />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col sm={3}></Col>
                                            <Col sm={9} className="text-secondary">
                                                <input type="submit" className="btn btn-primary px-4" value="Save Changes" />
                                            </Col>
                                        </Row>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row className='mt-5'>
                        <Col sm={12}>
                            <Card className='shadow payment-card'>
                                <Card.Body>
                                    <h5 className="d-flex align-items-center mb-3">Payments</h5>
                                    {payments && payments.length > 0 ? <Table striped bordered hover className='payments-table'>
                                        <thead>
                                            <tr className='text-center'>
                                                <th>Order ID</th>
                                                <th>Date</th>
                                                <th>Products</th>
                                                <th>Price</th>
                                                <th>Type</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {payments.map((payment, index) => (
                                                <tr key={index}>
                                                    <td>{payment.order_id}</td>
                                                    <td>&nbsp;{formatDate(payment.created_at)}h</td>
                                                    <td>
                                                        <Accordion className='acc-payments'>
                                                            <Accordion.Item eventKey="1">
                                                                <Accordion.Header>&nbsp;{payment.payment_products.length} - Products</Accordion.Header>
                                                                <Accordion.Body className='text-start'>
                                                                    {payment.payment_products.map(pp => (
                                                                        <Link className="cmnt" key={pp.id} to={`/products/${pp.product.id}`}><li className='acc-p-name'>{`${pp.product.name} x${pp.count}`}</li></Link>
                                                                    ))}
                                                                </Accordion.Body>
                                                            </Accordion.Item>
                                                        </Accordion>
                                                    </td>
                                                    <td>
                                                        {(Math.round(payment.price * 100) / 100).toLocaleString()} RSD <br />
                                                        {(Math.round(payment.price / 117 * 100) / 100).toLocaleString()}&euro; <br />
                                                    </td>
                                                    <td>{payment.type}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table> : 'No payments'}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>}
            </Container>
            <Footer />
        </>
    )
}

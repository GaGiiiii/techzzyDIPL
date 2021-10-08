import React, { useState, useContext } from 'react'
import './login.css';
import NavbarC from '../NavbarC';
import Footer from '../Footer';
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from 'axios';
import { login } from '../../Helpers';
import { CurrentUserContext, FlashMessageContext, ApiContext } from '../../App';
import { Redirect, useHistory } from 'react-router';

export default function Login({ products }) {
  let history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { setFlashMessage } = useContext(FlashMessageContext);

  const api = useContext(ApiContext)
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  if (currentUser) {
    return <Redirect to="/" />
  }

  function handleSubmit(event) {
    event.preventDefault();
    axios.post(`${api}/login`, { email, password }).then(response => {
      console.log(response.data)
      let user = response.data.user; // Get user
      user.token = response.data.token; // Get token and set it to user
      login(user); // Add User to Local Storage
      setCurrentUser(response.data.user); // Set Global State
      history.push('/dashboard'); // Redirect
      setFlashMessage({ type: 'success', message: `Login successful. Welcome back ${user.username}!` }) // Add Flash Message
    }).catch((error) => {
      let errorsG = [];
      console.log(error);
      switch (error.response.data.message) {
        case "Validation failed.":
          errorsG = [error.response.data.errors.email || "", error.response.data.errors.password || ""];
          setErrors(errorsG);
          break;
        case "Login failed.":
          errorsG = ["Wrong combination."];
          setErrors(errorsG);
          break;
        default:
          break;
      }
    });
  }

  return (
    <div>
      <NavbarC products={products} active="login" />
      <Container>
        <Row className="my-5">
          <Col md={{ span: 6, offset: 3 }}>
            <h1 className="fw-bold mb-4">Login</h1>
            <div className="errors">
              {errors && errors.map((error, index) => error && (
                <p key={index} className="m-0">&bull; {error}</p>
              ))}
            </div>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={email} onChange={(event) => setEmail(event.target.value)} />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Remember me" />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  )
}

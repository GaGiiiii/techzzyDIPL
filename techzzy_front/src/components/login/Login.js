import React from 'react'
import './login.css';
import NavbarC from '../NavbarC';
import Footer from '../Footer';
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useState, useContext } from 'react';
import axios from 'axios';
import { ApiContext } from '../../App';
import { login } from '../../Helpers';
import { CurrentUserContext } from '../../App';
import { useHistory } from 'react-router';



export default function Login({ products }) {
  let history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const api = useContext(ApiContext)
  const { setCurrentUser } = useContext(CurrentUserContext);

  function handleSubmit(event) {
    event.preventDefault();
    axios.get(`${api}/sanctum/csrf-cookie`).then(response => {
      if (response.data.error) {
        console.log(response.data.error);
      } else {
        axios.post(`${api}/login`, { email, password }, { withCredentials: true, }).then(response => {
          login(response.data);
          setCurrentUser(response.data.user);
          history.push('/dashboard');
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

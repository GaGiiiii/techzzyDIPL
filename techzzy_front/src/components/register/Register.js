import React, { useContext, useState } from 'react'
import { Col, Container, Form, Row, Button, Card } from 'react-bootstrap'
import { Redirect, useHistory } from 'react-router-dom';
import { ApiContext, CurrentUserContext, FlashMessageContext } from '../../App';
import Footer from '../Footer';
import NavbarC from '../NavbarC'
import axios from 'axios';
import { login } from '../../Helpers';

export default function Register() {
  let history = useHistory();
  const [errors, setErrors] = useState([]);
  const { setFlashMessage } = useContext(FlashMessageContext);
  const { api } = useContext(ApiContext)
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  // Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password2, setPassword2] = useState("");
  const [image, setImage] = useState("");

  if (currentUser) {
    return <Redirect to="/" />
  }

  function handleSubmit(event) {
    event.preventDefault();
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

    axios.post(`${api}/register`, formData, {
      headers: {
        'Accept': 'multipart/form-data',
        'Content-Type': 'multipart/form-data',
      }
    }).then(response => {
      console.log(response.data)
      let user = response.data.user; // Get user
      user.token = response.data.token; // Get token and set it to user
      login(user); // Add User to Local Storage
      setCurrentUser(response.data.user); // Set Global State
      history.push('/dashboard'); // Redirect
      setFlashMessage({ type: 'success', message: `Register successful. Welcome ${user.username}!` }) // Add Flash Message
    }).catch((error) => {
      let errorsG = [];
      console.log(error);
      if (error.response) {
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
      }
    });
  }

  return (
    <div>
      <NavbarC active="register" />
      <Container>
        <Row className="my-5">
          <Col md={{ span: 8, offset: 2 }}>
            <Card className='p-2 shadow'>
              <Card.Body>
                <h1 className="fw-bold mb-4">Register</h1>
                <div className="errors">
                  {errors && errors.map((error, index) => error && (
                    <p key={index} className="m-0">&bull; {error}</p>
                  ))}
                </div>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter first name" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter last name" value={lastName} onChange={(event) => setLastName(event.target.value)} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" value={email} onChange={(event) => setEmail(event.target.value)} />
                        <Form.Text className="text-muted">
                          We'll never share your email with anyone else.
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" value={username} onChange={(event) => setUsername(event.target.value)} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter password" onChange={(event) => setPassword(event.target.value)} />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="Confirm password" onChange={(event) => setPassword2(event.target.value)} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-4" controlId="formBasicCheckbox">
                    <Form.Label>Select Image</Form.Label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" name="img" className="form-control" />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100">
                    Submit
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  )
}

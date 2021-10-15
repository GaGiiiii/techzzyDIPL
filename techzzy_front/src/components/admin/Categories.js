import React, { useContext, useState } from 'react'
import { Button, Alert, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { ApiContext, CurrentUserContext } from '../../App';
import CategoryRow from './CategoryRow';
import axios from 'axios';

export default function Categories({ categories, setCategories }) {
  const { currentUser } = useContext(CurrentUserContext);
  const [errors, setErrors] = useState(null);
  const api = useContext(ApiContext);

  // CATEGORY DATA
  const [name, setName] = useState("");

  // MODAL
  const [show, setShow] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleSubmit(e) {
    e.preventDefault();
    axios.post(`${api}/categories`, { name }, {
      headers: {
        Authorization: `Bearer ${currentUser.token}`
      }
    }).then(response => {
      let categoriesG = [...categories];
      categoriesG.unshift(response.data.category);
      setCategories(categoriesG);
    }).catch((error) => {
      setErrors(Object.values(error.response.data.errors));
      setShowErrors(true);
    });
  }

  return (
    <>
      <Col>
        <h1 className="mb-4">Categories</h1>
        {errors && showErrors &&
          <Alert variant="danger" onClose={() => setShowErrors(false)} dismissible>
            <ul className="mb-0">
              {errors.map((error, index) => (
                <li key={index}>{error[0]}</li>
              ))}
            </ul>
          </Alert>
        }
        <div className='table-container'>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th className="th-hover" onClick={handleShow}><i className="fas fa-plus"></i></th>
              </tr>
            </thead>
            <tbody>
              {categories && categories.map((category, index) => (
                <CategoryRow key={index} index={index} category={category} categories={categories} setCategories={setCategories} setErrors={setErrors} setShowErrors={setShowErrors} />
              ))}
            </tbody>
          </Table>
        </div>
      </Col>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Adding Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter name" value={name} onChange={(event) => setName(event.target.value)} />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type='submit' className='w-100' onClick={handleClose}>
              Add Category
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

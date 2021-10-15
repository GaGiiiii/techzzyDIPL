import React, { useContext, useState } from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { ApiContext, CurrentUserContext } from '../../App';
import axios from 'axios';

export default function CategoryRow({ category, categories, setCategories, index, setErrors, setShowErrors }) {
  const api = useContext(ApiContext);
  const { currentUser } = useContext(CurrentUserContext);

  // CATEGORY DATA
  const [name, setName] = useState(category.name);

  // MODAL
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const handleClose = () => setShow(false);
  const handleClose2 = () => setShow2(false);
  const handleShow = () => setShow(true);
  const handleShow2 = () => setShow2(true);

  function handleDelete(e) {
    e.preventDefault();
    axios.delete(`${api}/categories/${category.id}`, {
      headers: {
        Authorization: `Bearer ${currentUser.token}`
      }
    }).then(response => {
      console.log(response.data);
      let newCategories = [...categories];
      newCategories.splice(newCategories.indexOf(category), 1);
      setCategories(newCategories);
      setShow2(false);
    }).catch((error) => {
      console.log(error);
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    axios.put(`${api}/categories/${category.id}`, { name }, {
      headers: {
        Authorization: `Bearer ${currentUser.token}`
      }
    }).then(response => {
      let categoriesG = [...categories];
      let indexOfChanged = categoriesG.findIndex(c => c.id === response.data.category.id);
      categoriesG[indexOfChanged] = response.data.category;
      setCategories(categoriesG);
    }).catch((error) => {
      setErrors(Object.values(error.response.data.errors));
      setShowErrors(true);
    });
  }

  return (
    <>
      <tr>
        <td>{++index}</td>
        <td>{category.name}</td>
        <td><i className="fas fa-edit" onClick={handleShow}></i> <i className="fas fa-trash" onClick={handleShow2}></i></td>
      </tr>

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
            <Button variant="warning" type='submit' className='w-100' onClick={handleClose}>
              Update Category
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Are You sure that you want to delete {category.name} category?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete}>
            Yes
          </Button>
          <Button variant="secondary" onClick={handleClose2}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

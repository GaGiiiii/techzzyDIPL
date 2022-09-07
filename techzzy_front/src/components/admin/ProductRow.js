import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { ApiContext, CurrentUserContext } from '../../App';
import { Col, Form, Modal, Row, Button } from 'react-bootstrap';

export default function ProductRow({ products, setProducts, product, index, categories, setErrors, setShowErrors }) {
  const { api } = useContext(ApiContext);
  const { currentUser } = useContext(CurrentUserContext);


  // PRODUCT DATA
  const [name, setName] = useState(product.name);
  const [desc, setDesc] = useState(product.desc);
  const [img, setImg] = useState(product.img);
  const [stock, setStock] = useState(product.stock);
  const [price, setPrice] = useState(product.price);
  const [categoryID, setCategoryID] = useState(product.category.id);

  // MODAL
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const handleClose = () => setShow(false);
  const handleClose2 = () => setShow2(false);
  const handleShow = () => setShow(true);
  const handleShow2 = () => setShow2(true);

  useEffect(() => {
    setName(product.name);
    setDesc(product.desc);
    setImg(product.img);
    setStock(product.stock);
    setPrice(product.price);
    setCategoryID(product.category.id);
  }, [product]);

  function handleDelete(e) {
    e.preventDefault();
    axios.delete(`${api}/products/${product.id}`, {
      headers: {
        Authorization: `Bearer ${currentUser.token}`
      }
    }).then(response => {
      let newProducts = [...products];
      newProducts.splice(newProducts.indexOf(product), 1);
      setProducts(newProducts);
      setShow2(false);
    }).catch((error) => {
      console.log(error);
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(categoryID)
    axios.put(`${api}/products/${product.id}`, { name, category_id: categoryID, desc, img, stock, price }, {
      headers: {
        Authorization: `Bearer ${currentUser.token}`
      }
    }).then(response => {
      let productsG = [...products];
      let indexOfChanged = productsG.findIndex(p => p.id === response.data.product.id);
      productsG[indexOfChanged] = response.data.product;
      setProducts(productsG);
      setShow2(false);
    }).catch((error) => {
      setErrors(Object.values(error.response.data.errors));
      setShowErrors(true);
    });
  }

  return (
    <>
      <tr>
        <td>{++index}</td>
        <td>{product.name}</td>
        <td>{product.category.name}</td>
        <td>{product.desc}</td>
        <td>{product.img}</td>
        <td>{product.stock}</td>
        <td>{(Math.round(product.price * 100) / 100).toLocaleString()}&euro;</td>
        <td><i className="fas fa-edit" onClick={handleShow}></i><i className="fas fa-trash" onClick={handleShow2}></i></td>
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
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select onChange={(event) => setCategoryID(event.target.value)} defaultValue={product.category_id}>
                    {categories && categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control type="number" placeholder="Enter stock" value={stock} onChange={(event) => setStock(event.target.value)} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control type="number" placeholder="Enter price" value={price} onChange={(event) => setPrice(event.target.value)} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Image</Form.Label>
                  <Form.Control type="text" placeholder="Enter image URL" value={img} onChange={(event) => setImg(event.target.value)} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Desc</Form.Label>
                  <Form.Control as="textarea" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Leave a comment here" style={{ height: '100px' }} />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="warning" type='submit' className='w-100' onClick={handleClose}>
              Update Product
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Are You sure that you want to delete {product.name} product?</Modal.Title>
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

import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Col, Modal, Pagination, Table, Button, Form, Row, Alert } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router';
import { ApiContext, CurrentUserContext, ProductsContext } from '../../App';
import ProductRow from './ProductRow';
import axios from 'axios';

export default function Products({ categories }) {
  const { products, setProducts } = useContext(ProductsContext);
  const { currentUser } = useContext(CurrentUserContext);
  const [errors, setErrors] = useState(null);
  const api = useContext(ApiContext);

  // PAGINATION
  const search = useLocation().search;
  const history = useHistory();
  const page = parseInt(new URLSearchParams(search).get('page')) || 1;
  const [paginationBasic, setPaginationBasic] = useState(null);

  // PRODUCT DATA
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState("");
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0.0);
  const [categoryID, setCategoryID] = useState(1);

  // MODAL
  const [show, setShow] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (categories[0]) {
      setCategoryID(categories[0].id);
    }
  }, [categories])

  const changePage = useCallback(
    (number) => {
      number === 1 ? history.push(`${window.location.pathname}`) : history.push(`${window.location.pathname}?page=${number}`);
    }, [history]);

  useEffect(() => {
    let productsG = [...products];
    let items = [];

    // Create Pagination
    for (let number = 1; number <= Math.ceil(productsG.length / 10); number++) {
      items.push(
        <Pagination.Item onClick={() => changePage(number)} key={number} active={page === number}>
          {number}
        </Pagination.Item>
      );
    }

    setPaginationBasic(<div className="text-center"><Pagination className="my-5">{items}</Pagination></div>);
  }, [products, page, changePage]);

  function handleSubmit(e) {
    e.preventDefault();
    axios.post(`${api}/products`, { name, category_id: categoryID, desc, img, stock, price }, {
      headers: {
        Authorization: `Bearer ${currentUser.token}`
      }
    }).then(response => {
      console.log(response.data);
      let productsG = [...products];
      console.log(productsG);
      console.log(response.data.product);
      productsG.unshift(response.data.product);
      setProducts(productsG);
    }).catch((error) => {
      setErrors(Object.values(error.response.data.errors));
      setShowErrors(true);
    });
  }

  return (
    <>
      <Col>
        <h1 className="mb-4">Products</h1>
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
              <th>Category</th>
              <th>Desc</th>
              <th>Img</th>
              <th>Stock</th>
              <th>Price</th>
              <th className="th-hover" onClick={handleShow}><i className="fas fa-plus"></i></th>
            </tr>
          </thead>
          <tbody>
            {products && products.slice((page - 1) * 10, (page - 1) * 10 + 10).map((product, index) => (
              <ProductRow key={index} index={index} product={product} products={products} setProducts={setProducts} categories={categories} setErrors={setErrors} setShowErrors={setShowErrors} />
            ))}
          </tbody>
        </Table>
        </div>

        {paginationBasic}

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
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select onChange={(event) => setCategoryID(event.target.value)}>
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
            <Button variant="primary" type='submit' className='w-100' onClick={handleClose}>
              Add Product
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

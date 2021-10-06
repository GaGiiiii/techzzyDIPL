import React from 'react'
import './product.css';
import { useParams } from "react-router-dom";
import { ApiContext, CurrentUserContext } from '../../App';
import { useContext, useEffect, useState } from 'react';
import NavbarC from '../NavbarC';
import Footer from '../Footer';
import axios from 'axios';
import { Container, Row, Card, Button, Col, Modal } from 'react-bootstrap';

export default function Product({ products }) {
  let { productID } = useParams();
  const api = useContext(ApiContext);
  const [product, setProduct] = useState(undefined);
  const [ratings, setRatings] = useState([]);
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  // MODAL
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [modalIndex, setModalIndex] = useState(null);

  useEffect(() => {
    axios.get(`${api}/api/products/${productID}`)
      .then((res) => {
        setProduct(res.data.product);
      })
      .catch(err => console.log(err));
    axios.get(`${api}/api/ratings`)
      .then((response) => {
        setRatings(response.data.ratings);
      })
      .catch((error) => {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      });
  }, [api, productID]);

  function findRatingForProductFromUser(user, product) {
    let rating = ratings.find((rating) => rating.user_id === user.id && rating.product_id === product.id);

    return rating ? rating.rating : 0;
  }

  function formatDate(date) {
    let formatedDate = new Date(date);

    formatedDate = `${("0" + formatedDate.getDay()).slice(-2)}.${("0" + (formatedDate.getMonth() + 1)).slice(-2)}.${formatedDate.getFullYear()}. ${("0" + formatedDate.getHours()).slice(-2)}:${("0" + formatedDate.getMinutes()).slice(-2)}`;

    return formatedDate;
  }

  return (
    <>
      <NavbarC products={products} active="products" />
      {product &&
        <Container>
          <Row className="mt-5 mb-5">
            <Col sm={6}>
              <Card>
                <img src={product.img} className="card-img-top thumbnail" />
              </Card>
            </Col>
            <Col sm={6} className="mt-5 mt-sm-0">
              <Card className="product-card">
                <Card.Body>
                  <Card.Title className="fw-bold product-title">{product.name}</Card.Title>
                  <div className="mt-3">
                    <p className="fw-bold m-0">
                      <i className="fas fa-star"></i>
                      &nbsp;10/10
                    </p>

                    <p className="fw-bold m-0">
                      <i className="fas fa-tag"></i>
                      <span className="original-price-span">&nbsp;{product.price}</span> RSD
                      <span className="changing-quantity-span"></span>
                    </p>
                    <p className="fw-bold">
                      <i className="fas fa-shopping-cart"></i> In stock:
                      <span className="original-stock-span">&nbsp;{product.stock}</span> pcs
                    </p>
                    <p className="mt-3">{product.desc}</p>
                    <div className="fw-bold mt-4 mb-1 d-flex justify-content-between">
                      <p className="mt-2">Quantity</p>
                      <ul className="quantity-ul">
                        <li className="btn btn-outline-primary fw-bold li-minus"><i className="fas fa-minus"></i></li>
                        <li className="btn btn-outline-primary fw-bold li-current">1</li>
                        <li className="btn btn-outline-primary fw-bold li-plus"><i className="fas fa-plus"></i></li>
                      </ul>
                    </div>
                  </div>
                  <Button type="button" variant="outline-primary" className="add-to-cart-btn w-100 fw-bold mt-4">
                    Add to cart
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="my-5">
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title className="fw-bold product-title">Comments and Ratings</Card.Title>
                  <div className="comments mt-4">
                    {product.comments.length === 0 ? <h5 className="mb-4">No comments.</h5> : ""}
                    {currentUser && <div className="new-comment d-flex">
                      <div className="comment-img">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1200px-No-Image-Placeholder.svg.png" alt="Image Error" />
                      </div>
                      <div className="comment-textarea flex-fill">
                        <form action="{{ url('/comments') }}" method="POST">
                          <input type="hidden" name="user_id" value="{{ auth()->user()->id }}" />
                          <input type="hidden" name="product_id" value="{{ $product->id }}" />
                          <div className="form-floating">
                            <textarea name="body" className="form-control textarea" placeholder="Leave a comment here"
                              id="floatingTextarea2"></textarea>
                            <label>Leave your comment</label>
                          </div>
                          <button type="submit" className="btn btn-primary mt-3 d-block ms-auto">Submit</button>
                        </form>
                      </div>
                    </div>}
                    {/* <div className="alert alert-danger mb-4">
                      <ul>
                        <li>errors</li>
                      </ul>
                    </div> */}

                    {product && product.comments && product.comments.map((comment, index) => (
                      <div key={comment.id} className="comment d-flex">
                        <div className="comment-img">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1200px-No-Image-Placeholder.svg.png" alt="Image Error" />
                        </div>
                        <div data-comment-id="{{ $comment->id }}" className="comment-body flex-fill">
                          <h5 className="name-rating">
                            <i className="fas fa-user"></i> {comment.user.username} &nbsp;
                            <i className="fas fa-star"></i>
                            &nbsp;{findRatingForProductFromUser(comment.user, product)}/10&nbsp;
                            {currentUser && currentUser.id === comment.user.id &&
                              <>
                                <Button variant="warning" size="sm" className="edit-comment-btn mx-1">Edit</Button>
                                <Button variant="danger" size="sm" onClick={(e) => {setModalIndex(index); handleShow();}}>
                                  Delete
                                </Button>
                              </>
                            }
                          </h5>
                          <p data-comment-id="{{ $comment->id }}"
                            className="comment-body-p-focus card-text mt-2 comment-body-p-{{ $comment->id }}">
                            {comment.body}
                          </p>
                          <p className="mt-3"><i className="fas fa-calendar-alt"></i>
                            &nbsp;{formatDate(comment.created_at)}h
                          </p>
                        </div>
                      </div>
                    ))}

                    {product && modalIndex != null && <Modal show={show} onHide={handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title>Are you sure that you want to delete this comment?</Modal.Title>
                      </Modal.Header>
                      <Modal.Footer>
                        <Button variant="danger" onClick={handleClose}>
                          Yes
                        </Button>
                        <Button variant="primary" onClick={handleClose}>
                          Cancel
                        </Button>
                      </Modal.Footer>
                    </Modal>}


                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      }
      <Footer />
    </>
  )
}

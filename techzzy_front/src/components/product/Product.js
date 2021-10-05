import React from 'react'
import './product.css';
import { useParams } from "react-router-dom";
import { ApiContext } from '../../App';
import { useContext, useEffect, useState } from 'react';
import NavbarC from '../NavbarC';
import Footer from '../Footer';
import axios from 'axios';
import { Container, Row, Card, Button, Col } from 'react-bootstrap';

export default function Product({ products }) {
  let { productID } = useParams();
  const api = useContext(ApiContext);
  const [product, setProduct] = useState(undefined);

  useEffect(() => {
    axios({
      method: 'GET',
      url: `${api}/api/products/${productID}`,
    })
      .then((res) => {
        setProduct(res.data.product);
      })
      .catch(err => console.log(err));
  }, [api, productID])

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

          <Row className="mt-5">
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title className="fw-bold product-title">Comments and Ratings</Card.Title>
                  <div className="comments mt-4">
                    <h5 className="mb-4">No comments.</h5>
                    <div className="alert alert-danger mb-4">
                      <ul>
                        <li>eror</li>
                      </ul>
                    </div>
                    <div className="new-comment d-flex">
                      <div className="comment-img">
                        {/* <img src="{{ asset('avatars') . '/' . auth()->user()->username . '/' . auth()->user()->img }}"
                  alt="Image Error"> */}
                      </div>
                      <div className="comment-textarea flex-fill">
                        <form action="{{ url('/comments') }}" method="POST">
                          <input type="hidden" name="user_id" value="{{ auth()->user()->id }}" />
                          <input type="hidden" name="product_id" value="{{ $product->id }}" />
                          <div className="form-floating">
                            <textarea name="body" className="form-control" placeholder="Leave a comment here"
                              id="floatingTextarea2"></textarea>
                            <label>Leave your comment</label>
                          </div>
                          <button type="submit" className="btn btn-primary mt-3 d-block ms-auto">Submit</button>
                        </form>
                      </div>
                    </div>
                    <div className="comment d-flex">
                      <div className="comment-img">
                        {/* <img src="{{ asset('avatars') . '/' . $comment->user->username . '/' . $comment->user->img }}"
                          alt="Image Error"> */}
                      </div>
                      <div data-comment-id="{{ $comment->id }}" className="comment-body flex-fill">
                        <h5>
                          {/* <i className="fas fa-user"></i> {{ $comment-> user -> username}} &nbsp; */}
                          <i className="fas fa-star"></i>
                          {/* {{ findRatingForProductFromUser($comment-> user, $product) }} / 10 */}
                          {/* @can(['update'], $comment) */}
                          <button data-comment-id="{{ $comment->id }}"
                            className="btn btn-sm btn-warning edit-comment-btn">Edit</button>
                          {/* <!--Button trigger modal--> */}
                          <button type="button" className="btn btn-danger btn-sm" data-bs-toggle="modal"
                            data-bs-target="#exampleModal{{ $comment->id }}">
                            DELETE
                          </button>
                          {/* <!--Modal--> */}
                          <div className="modal fade" id="exampleModal{{ $comment->id }}"
                            aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5 className="modal-title" id="exampleModalLabel">Are you sure
                                    that
                                    you want to delete this comment?</h5>
                                  <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                                </div>
                                <div className="modal-footer">
                                  <form className="d-inline"
                                    action="{{ url('/comments') }}/{{ $comment->id }}"
                                    method="POST">

                                    <button className="btn btn-danger">YES</button>
                                  </form>
                                  <button type="button" className="btn btn-secondary"
                                    data-bs-dismiss="modal">No</button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                        </h5>
                        <p data-comment-id="{{ $comment->id }}"
                          className="comment-body-p-focus card-text mt-2 comment-body-p-{{ $comment->id }}">
                          {/* {{ $comment-> body}} */}
                        </p>
                        <p className="mt-3"><i className="fas fa-calendar-alt"></i>
                          {/* {{ formatDate($comment-> created_at) }}h*/}
                        </p>
                      </div>
                    </div>
                    
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

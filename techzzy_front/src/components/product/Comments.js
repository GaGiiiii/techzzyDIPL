import React, { useContext } from 'react'
import { Row, Card, Col } from 'react-bootstrap';
import { CurrentUserContext } from '../../App';
import Comment from './Comment';

export default function Comments({ product }) {
  const { currentUser } = useContext(CurrentUserContext);

  return (
    <Row className="my-5">
      <Col>
        <Card>
          <Card.Body>
            <Card.Title className="fw-bold product-title">Comments and Ratings</Card.Title>
            <div className="comments mt-4">
              {product.comments.length === 0 ? <h5 className="mb-4">No comments.</h5> : ""}
              {currentUser && <div className="new-comment d-flex">
                <div className="comment-img">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1200px-No-Image-Placeholder.svg.png" alt="Couldn't load" />
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
                <Comment key={comment.id} comment={comment} index={index} product={product} />
              ))}

            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

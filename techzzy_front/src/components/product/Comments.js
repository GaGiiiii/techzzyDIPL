import React, { useContext, useState, useEffect } from 'react'
import { Row, Card, Col } from 'react-bootstrap';
import { CurrentUserContext, ApiContext } from '../../App';
import Comment from './Comment';
import axios from 'axios';
import AlertC from '../AlertC';

export default function Comments({ product, setProduct }) {
  const { currentUser } = useContext(CurrentUserContext);
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState("");
  const [commentsFlashMessage, setCommentsFlashMessage] = useState(null);
  const { api } = useContext(ApiContext);
  const { backURL } = useContext(ApiContext);

  useEffect(() => {
    if (body.length < 20 && body.length !== 0) {
      setErrors("Comment must be at least 20 characters.");
    } else {
      setErrors("");
    }
  }, [body]);

  useEffect(() => {
    setErrors("");
  }, []);

  function addComment(e) {
    e.preventDefault();
    if (body.length < 20 && body.length !== 0) {
      setErrors("Comment must be at least 20 characters.");
    } else {
      setErrors("");
      if (body.length !== 0) {
        axios.post(`${api}/comments`, { product_id: product.id, user_id: currentUser.id, body }, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        }).then(response => {
          product.comments.unshift(response.data.comment);
          currentUser.comments.push(response.data.comment);
          setBody("");
          setCommentsFlashMessage({ type: 'success', message: `Comment added.` }) // Add Flash Message
        }).catch((error) => {
          console.log("Add Comment Error");
        });
      }
    }

  }

  return (
    <Row className="my-5">
      <Col>
        <Card className='shadow'>
          <Card.Body>
            <Card.Title className="fw-bold product-title">Comments and Ratings</Card.Title>
            {commentsFlashMessage && <AlertC flashMessage={commentsFlashMessage} setFlashMessage={setCommentsFlashMessage} />}
            <div className="comments mt-4">
              {product.comments.length === 0 ? <h5 className="mb-4">No comments.</h5> : ""}
              {currentUser && <div className="new-comment d-flex">
                <div className="comment-img">
                  <img src={currentUser.img ? `${backURL}/avatars/${currentUser.username}/${currentUser.img}` : `${backURL}/avatars/no_image.jpg`} alt="Couldn't load" />
                </div>
                <div className="comment-textarea flex-fill">
                  {errors && <p className="error">{errors}</p>}
                  <form onSubmit={addComment}>
                    <div className="form-floating">
                      <textarea onChange={(e) => setBody(e.target.value)} className="form-control textarea" placeholder="Leave a comment here"
                        id="floatingTextarea2" value={body}></textarea>
                      <label>Leave your comment</label>
                    </div>
                    <button type="submit" className="btn btn-primary mt-3 d-block ms-auto">Submit</button>
                  </form>
                </div>
              </div>}
              {product && product.comments && product.comments.map((comment, index) => (
                <Comment key={comment.id} comment={comment} index={index} product={product} commentsFlashMessage={commentsFlashMessage} setCommentsFlashMessage={setCommentsFlashMessage} />
              ))}

            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

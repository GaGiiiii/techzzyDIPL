import { Button, Modal } from 'react-bootstrap';
import React, { useContext, useEffect, useState } from 'react'
import { CurrentUserContext, ApiContext } from '../../App';
import axios from 'axios';


export default function Comment({ comment, index, product }) {
  const { currentUser } = useContext(CurrentUserContext);
  const [ratings, setRatings] = useState([]);
  const api = useContext(ApiContext);

  // MODAL
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [modalIndex, setModalIndex] = useState(null);

  useEffect(() => {
    axios.get(`${api}/api/ratings`)
      .then((response) => {
        setRatings(response.data.ratings);
      })
      .catch((error) => {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      });
  }, [api])

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
      <div className="comment d-flex">
        <div className="comment-img">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1200px-No-Image-Placeholder.svg.png" alt="Couldn't load" />
        </div>
        <div data-comment-id="{{ $comment->id }}" className="comment-body flex-fill">
          <h5 className="name-rating">
            <i className="fas fa-user"></i> {comment.user.username} &nbsp;
            <i className="fas fa-star"></i>
            &nbsp;{findRatingForProductFromUser(comment.user, product)}/10&nbsp;
            {currentUser && currentUser.id === comment.user.id &&
              <>
                <Button variant="warning" size="sm" className="edit-comment-btn mx-1">Edit</Button>
                <Button variant="danger" size="sm" onClick={(e) => { setModalIndex(index); handleShow(); }}>
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

      {modalIndex != null && <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure that you want to delete this comment? {comment.id}</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Yes
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      }
    </>
  )
}

import { Button, Form, Modal } from 'react-bootstrap';
import React, { useContext, useEffect, useState } from 'react'
import { CurrentUserContext, ApiContext, FlashMessageContext } from '../../App';
import axios from 'axios';


export default function Comment({ comment, index, product }) {
  const { currentUser } = useContext(CurrentUserContext);
  const { setFlashMessage } = useContext(FlashMessageContext);
  const [ratings, setRatings] = useState([]);
  const [editFormVisibility, setEditFormVisibility] = useState("hidden");
  const [editCommentValue, setEditCommentValue] = useState(comment.body);
  const [errors, setErrors] = useState("");
  const api = useContext(ApiContext);

  // MODAL
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [modalIndex, setModalIndex] = useState(null);

  useEffect(() => {
    axios.get(`${api}/ratings`)
      .then((response) => {
        setRatings(response.data.ratings);
      })
      .catch((error) => {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      });
  }, [api]);

  useEffect(() => {
    if (editCommentValue.length < 20 && editCommentValue.length !== 0) {
      setErrors("Comment must be at least 20 characters.");
    } else {
      setErrors("");
    }
  }, [editCommentValue])

  useEffect(() => {
    setErrors("");
  }, [])

  function findRatingForProductFromUser(user, product) {
    let rating = ratings.find((rating) => rating.user_id === user.id && rating.product_id === product.id);

    return rating ? rating.rating : 0;
  }

  function formatDate(date) {
    let formattedDate = new Date(date);
    formattedDate = `${("0" + formattedDate.getDay()).slice(-2)}.${("0" + (formattedDate.getMonth() + 1)).slice(-2)}.${formattedDate.getFullYear()}. ${("0" + formattedDate.getHours()).slice(-2)}:${("0" + formattedDate.getMinutes()).slice(-2)}`;

    return formattedDate;
  }

  function deleteComment(commentID) {
    axios.delete(`${api}/comments/${commentID}`, {
      headers: {
        Authorization: `Bearer ${currentUser.token}`
      }
    }).then(response => {
      let index = product.comments.findIndex((comment) => comment.id === commentID);
      product.comments.splice(index, 1);
      setFlashMessage({ type: 'success', message: `Comment deleted.` }) // Add Flash Message
    }).catch((error) => {
      console.log("Add Comment Error");
    });
  }

  function editClicked() {
    if (editFormVisibility === "visible") {
      setEditFormVisibility('hidden');
    } else {
      setEditFormVisibility('visible');
    }
  }

  function editComment(e) {
    e.preventDefault();
    if (editCommentValue.length < 20 && editCommentValue.length !== 0) {
      setErrors("Comment must be at least 20 characters.");
    } else {
      setErrors("");
      if (editCommentValue.length !== 0) {
        axios.put(`${api}/comments/${comment.id}`, { product_id: product.id, user_id: currentUser.id, body: editCommentValue }, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        }).then(response => {
          comment.body = editCommentValue;
          setFlashMessage({ type: 'success', message: `Comment edited.` }) // Add Flash Message
          setEditFormVisibility('hidden');
        }).catch((error) => {
          console.log("Add Comment Error");
        });
      }
    }
  }


  return (
    <>
      <div className="comment d-flex">
        <div className="comment-img">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1200px-No-Image-Placeholder.svg.png" alt="Couldn't load" />
        </div>
        <div className="comment-body flex-fill">
          <h5 className="name-rating">
            <i className="fas fa-user"></i> {comment.user.username} &nbsp;
            <i className="fas fa-star"></i>
            &nbsp;{findRatingForProductFromUser(comment.user, product)}/10&nbsp;
            {currentUser && currentUser.id === comment.user.id &&
              <>
                <Button variant="warning" size="sm" className="edit-comment-btn mx-1" onClick={() => editClicked()}>Edit</Button>
                <Button variant="danger" size="sm" onClick={(e) => { setModalIndex(index); handleShow(); }}>
                  Delete
                </Button>
              </>
            }
          </h5>
          <p className="comment-body-p-focus card-text mt-2">
            {comment.body}
          </p>
          <p className="mt-3"><i className="fas fa-calendar-alt"></i>
            &nbsp;{formatDate(comment.created_at)}h
          </p>
          {errors && <p className="errorE">{errors}</p>}
          <Form className={editFormVisibility} onSubmit={editComment}>
            <div className="form-floating">
              <textarea className="form-control textareaE" placeholder="Leave a comment here" value={editCommentValue} onChange={(e) => setEditCommentValue(e.target.value)}></textarea>
            </div>
            <Button type="submit" variant="warning" className="mt-3 d-block ms-auto">Edit</Button>
          </Form>
        </div>
      </div>

      {
        modalIndex != null && <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Are you sure that you want to delete this comment?</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button variant="danger" onClick={() => { handleClose(); deleteComment(comment.id) }}>
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
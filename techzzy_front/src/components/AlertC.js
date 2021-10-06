import React, { useContext, useState } from 'react'
import { Alert } from 'react-bootstrap';
import { FlashMessageContext } from '../App';

export default function AlertC() {
  const [show, setShow] = useState(true);
  const { flashMessage, setFlashMessage } = useContext(FlashMessageContext);

  if (show) {
    return (
      <Alert className="fw-bold text-uppercase" variant={flashMessage.type} onClose={() => { setShow(false); setFlashMessage(null); }} dismissible>
        {flashMessage.message}
      </Alert>
    );
  }

  return <></>;
}

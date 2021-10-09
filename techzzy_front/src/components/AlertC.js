import React, { useState } from 'react'
import { Alert } from 'react-bootstrap';

export default function AlertC({ flashMessage, setFlashMessage, cartAlert = null }) {
  const [show, setShow] = useState(true);

  if (show && flashMessage) {
    return (
      <Alert className={`fw-bold text-uppercase ${cartAlert ? 'cart-alert' : ''}`} variant={flashMessage.type} onClose={() => { setShow(false); setFlashMessage(null); }} dismissible>
        {flashMessage.message}
      </Alert>
    );
  }

  return <></>;
}

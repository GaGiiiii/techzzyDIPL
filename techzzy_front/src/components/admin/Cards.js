import React from 'react'
import { Card, Col } from 'react-bootstrap'

export default function Cards({products, comments, users, payments}) {
  return (
    <>
      <Col>
        <Card className='admin-card shadow d-flex'>
          <div className='admin-text'>Total products - {products && products.length} </div>
          <div><i className="fas fa-shopping-cart"></i></div></Card>
      </Col>
      <Col>
        <Card className='admin-card shadow'>
          <div className='admin-text'>Total comments - {comments && comments.length}</div>
          <div><i className="fas fa-comment"></i></div></Card>
      </Col>
      <Col>
        <Card className='admin-card shadow'>
          <div className='admin-text'>Total users - {users && users.length}</div>
          <div><i className="fas fa-users"></i></div></Card>
      </Col>
      <Col>
        <Card className='admin-card shadow'>
          <div className='admin-text'>Total payments - {payments && payments.length}<br />Total Earnings: {payments.length > 0 && payments.reduce((sum, { price }) => sum + parseFloat(price), 0).toLocaleString()} &euro;</div>
          <div><i className="fas fa-money-check-alt"></i></div></Card>
      </Col>
    </>
  )
}

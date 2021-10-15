import React from 'react'
import { Card, Col } from 'react-bootstrap'

export default function Cards({ products, comments, users, payments }) {
  return (
    <>
      <Col lg={3} md={4}>
        <Card className='admin-card shadow d-flex'>
          <div className='admin-text'>Total products - {products && products.length} </div>
          <div><i className="fas fa-shopping-cart"></i></div></Card>
      </Col>
      <Col lg={3} md={4} className='mt-3 mt-md-0'>
        <Card className='admin-card shadow'>
          <div className='admin-text'>Total comments - {comments && comments.length}</div>
          <div><i className="fas fa-comment"></i></div></Card>
      </Col>
      <Col lg={3} md={4} className='mt-3 mt-md-0'>
        <Card className='admin-card shadow'>
          <div className='admin-text'>Total users - {users && users.length}</div>
          <div><i className="fas fa-users"></i></div></Card>
      </Col>
      <Col lg={{ span: 3, offset: 0 }} md={{ span: 4, offset: 4 }} className='mt-3 mt-lg-0'>
        <Card className='admin-card shadow'>
          <div className='admin-text'>Total payments - {payments && payments.length}<br />Total Earnings: {payments.length > 0 && payments.reduce((sum, { price }) => sum + parseFloat(price), 0).toLocaleString()} &euro;</div>
          <div><i className="fas fa-money-check-alt"></i></div></Card>
      </Col>
    </>
  )
}

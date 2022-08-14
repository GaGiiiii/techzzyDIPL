import React, { useCallback, useEffect, useState } from 'react'
import { Accordion, Col, Pagination, Table } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { formatDate } from '../../Helpers';

export default function Payments({ payments }) {
    // PAGINATION
    const search = useLocation().search;
    const history = useHistory();
    const page = parseInt(new URLSearchParams(search).get('page')) || 1;
    const [paginationBasic, setPaginationBasic] = useState(null);

    console.log(payments)

    const changePage = useCallback(
        (number) => {
            number === 1 ? history.push(`${window.location.pathname}`) : history.push(`${window.location.pathname}?page=${number}`);
        }, [history]);

    useEffect(() => {
        let items = [];

        // Create Pagination
        for (let number = 1; number <= Math.ceil(payments.length / 5); number++) {
            items.push(
                <Pagination.Item onClick={() => changePage(number)} key={number} active={page === number}>
                    {number}
                </Pagination.Item>
            );
        }

        setPaginationBasic(<div className="text-center"><Pagination className="my-5">{items}</Pagination></div>);
    }, [payments, page, changePage]);

    return (
        <Col>
            <h1 className="mb-4">Payments</h1>
            <div className='table-container'>
                <Table striped bordered hover>
                    <thead>
                        <tr className='text-center'>
                            <th>#</th>
                            <th>OrderID</th>
                            <th>User</th>
                            <th>Products</th>
                            <th>Price</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments && payments.slice((page - 1) * 5, (page - 1) * 5 + 5).map((payment, index) => (
                            <tr key={index} style={{ verticalAlign: 'middle' }} className='text-center'>
                                <td>{++index}</td>
                                <td>{payment.order_id}</td>
                                <td>{`${payment.user.first_name} ${payment.user.last_name}`}</td>
                                <td style={{ maxWidth: '160px' }}>
                                    <Accordion>
                                        <Accordion.Item eventKey="1">
                                            <Accordion.Header>&nbsp;{payment.payment_products && payment.payment_products.length} - Products</Accordion.Header>
                                            <Accordion.Body className='text-start'>
                                                {payment.payment_products && payment.payment_products.map(pp => (
                                                    <Link className="cmnt" key={pp.id} to={`/products/${pp.product.id}`}><li>{pp.product.name}</li></Link>
                                                ))}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </td>
                                <td>{(Math.round(payment.price * 100) / 100).toLocaleString()}&euro;</td>
                                <td>&nbsp;{formatDate(payment.created_at)}h</td>
                            </tr>))}
                    </tbody>
                </Table>
            </div>

            {paginationBasic}

        </Col>
    )
}

import React, { useCallback, useEffect, useState } from 'react'
import { Col, Pagination, Table } from 'react-bootstrap'
import { useLocation, useHistory } from 'react-router-dom';

export default function Users({ users }) {
  // PAGINATION
  const search = useLocation().search;
  const history = useHistory();
  const page = parseInt(new URLSearchParams(search).get('page')) || 1;
  const [paginationBasic, setPaginationBasic] = useState(null);

  const changePage = useCallback(
    (number) => {
      number === 1 ? history.push(`${window.location.pathname}`) : history.push(`${window.location.pathname}?page=${number}`);
    }, [history]);

  useEffect(() => {
    let items = [];

    // Create Pagination
    for (let number = 1; number <= Math.ceil(users.length / 5); number++) {
      items.push(
        <Pagination.Item onClick={() => changePage(number)} key={number} active={page === number}>
          {number}
        </Pagination.Item>
      );
    }

    setPaginationBasic(<div className="text-center"><Pagination className="my-5">{items}</Pagination></div>);
  }, [users, page, changePage]);

  return (
    <Col>
      <h1 className="mb-4">Users</h1>
      <Table striped bordered hover>
        <thead>
          <tr className='text-center'>
            <th>#</th>
            <th>Image</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Username</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users && users.slice((page - 1) * 5, (page - 1) * 5 + 5).map((user, index) => (
            <tr key={index} style={{ verticalAlign: 'middle' }} className='text-center'>
              <td>{++index}</td>
              <td>
                <img style={{ width: '50px' }} src={user.img ? `http://localhost:8000/avatars/${user.username}/${user.img}` : `http://localhost:8000/avatars/no_image.jpg`} alt="Couldn't load" />
              </td>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
            </tr>))}
        </tbody>
      </Table>

      {paginationBasic}

    </Col>
  )
}

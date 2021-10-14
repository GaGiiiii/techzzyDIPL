import React, { useContext } from 'react'
import axios from 'axios';
import { ApiContext, CurrentUserContext } from '../../App';

export default function ProductRow({ products, setProducts, product, index }) {
  const api = useContext(ApiContext);
  const { currentUser } = useContext(CurrentUserContext);

  function handleDelete(e) {
    e.preventDefault();
    axios.delete(`${api}/products/${product.id}`, {
      headers: {
        Authorization: `Bearer ${currentUser.token}`
      }
    }).then(response => {
      console.log(response.data);
      let newProducts = [...products];
      newProducts.splice(newProducts.indexOf(product), 1);
      setProducts(newProducts);
    }).catch((error) => {
      console.log(error);
    });
  }


  return (
    <tr>
      <td>{++index}</td>
      <td>{product.name}</td>
      <td>{product.category.name}</td>
      <td>{product.desc}</td>
      <td>{product.img}</td>
      <td>{product.stock}</td>
      <td>{product.price}</td>
      <td><i className="fas fa-edit"></i><i className="fas fa-trash" onClick={handleDelete}></i></td>
    </tr>
  )
}

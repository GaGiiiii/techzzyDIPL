import './search.css';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

export default function Search({ products }) {
  const [input, setInput] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    setFilteredProducts(filterProducts(products, input));
  }, [input, products]);

  useEffect(() => {
    document.body.addEventListener('click', closeSearch);
    return () => {
      document.body.removeEventListener('click', closeSearch);
    }
  }, [])

  function closeSearch(e) {
    if (document.getElementById('search-input') !== e.target) {
      setFilteredProducts([]);
    }
    // console.log(e.target)
  }

  function filterProducts(products, input) {
    let filteredProducts = [...products];
    filteredProducts = filteredProducts.filter((product) => product.name.toUpperCase().includes(input.toUpperCase()));

    return filteredProducts;
  }

  function calculateProductRating(product) {
    let rating = 0;

    for (let i = 0; i < product.ratings.length; i++) {
      rating += product.ratings[i].rating;
    }

    return (Math.round(rating / product.ratings.length * 100) / 100) || 0;
  }

  return (
    <div>
      <div id="search">
        <input id="search-input" className="form-control" type="search" placeholder="Search" aria-label="Search" value={input} onChange={(e) => setInput(e.target.value)} onFocus={() => setFilteredProducts(filterProducts(products, input))} />
        <div id="search-results">
          {input.length > 0 && filteredProducts.map((product) => (
            <Link className="reactistrash" to={`/products/${product.id}`} key={product.id}>
              <div className="search-result-item">
                <div className="search-result-item-img">
                  <img src={product.img} alt="" />
                </div>
                <div className="search-result-item-info">
                  <p className="m-0">{product.name} | {product.category.name}</p>
                  <p className="m-0">{calculateProductRating(product)} / 10</p>
                  <p className="m-0">{(Math.round(product.price * 100) / 100).toLocaleString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

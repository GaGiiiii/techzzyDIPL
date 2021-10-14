import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import Footer from '../Footer'
import NavbarC from '../NavbarC'
import { ApiContext, ProductsContext } from '../../App';
import { calculateProductRating } from '../../Helpers';
import axios from 'axios';
import { Card, Col, Container, Pagination, Row } from 'react-bootstrap';
import './products.css';
import { Link, useHistory, useLocation } from 'react-router-dom';

function applyFilters(products, changePage, perPage, page, priceRange, sortBy, filterURL, categoriesFilterArr) {
  if (!products) {
    return;
  }

  let productsG = [...products];
  let items = [];

  productsG = sortProducts(productsG, sortBy);
  productsG = productsG.filter(p => p.price < parseFloat(priceRange));
  if (categoriesFilterArr.length !== 0) {
    productsG = productsG.filter(p => categoriesFilterArr.includes(p.category.name));
  }

  // Create Pagination
  for (let number = 1; number <= Math.ceil(productsG.length / perPage); number++) {
    items.push(
      <Pagination.Item onClick={() => changePage(number, sortBy, priceRange, filterURL, categoriesFilterArr)} key={number} active={page === number}>
        {number}
      </Pagination.Item>
    );
  }

  return {
    productsG,
    items,
  }
}

function sortProducts(productsG, sortBy) {
  switch (sortBy) {
    case 1:
      productsG.sort((productA, productB) => productB.id - productA.id);
      break;
    case 2:
      productsG.sort((productA, productB) => {
        if (productA.name.toUpperCase() < productB.name.toUpperCase()) {
          return -1;
        }
        if (productA.name.toUpperCase() > productB.name.toUpperCase()) {
          return 1;
        }

        return 0;
      });
      break;
    case 3:
      productsG.sort((productA, productB) => productB.price - productA.price);
      break;
    case 4:
      productsG.sort((productA, productB) => productA.price - productB.price);
      break;
    case 5:
      productsG.sort((productA, productB) => productA.id - productB.id);
      break;
    case 6:
      productsG.sort((productA, productB) => productB.comments.length - productA.comments.length);
      break;
    case 7:
      productsG.sort((productA, productB) => productA.id - productB.id);
      break;
    default:
      break;
  }

  return productsG;
}

function changePage(number, sortBy, priceRange, filterURL, categoriesFilter) {
  filterURL(sortBy, priceRange, number, categoriesFilter);
}

export default function Products() {
  const [categories, setCategories] = useState([]);
  const { products } = useContext(ProductsContext);
  const [productsToShow, setProductsToShow] = useState([]);
  const [paginationBasic, setPaginationBasic] = useState(null);
  const api = useContext(ApiContext);

  // PAGINATION
  const search = useLocation().search;
  const history = useHistory();
  const perPage = 16;
  const page = parseInt(new URLSearchParams(search).get('page')) || 1;
  const sortBy = parseInt(new URLSearchParams(search).get('sortBy')) || 1;  // 1 - Latest | 2 - Name | 3 - Price desc | 4 - Price asc | 5 - Ratings | 6 - Comments | 7 - Popularity
  const priceRange = parseInt(new URLSearchParams(search).get('priceRange')) || 125000;
  // If there are no categories in URL make array empty otherwise split it by categories.
  let categoriesFilterArr = useMemo(() => (new URLSearchParams(search).get('categories')) === null ? [] : (new URLSearchParams(search).get('categories')).split(','), [search]);

  const filterURL = useCallback((sortBy, priceRange, page, categoriesFilterArr) => {
    let categoriesFilter = makeStringFromCategoriesArr(categoriesFilterArr);
    let queryStringSortBy = sortBy === 1 ? '' : `sortBy=${sortBy}`;
    let queryStringPriceRange = priceRange === 125000 ? '' : `&priceRange=${priceRange}`;
    let queryStringCategories = categoriesFilter === '' ? '' : `&categories=${categoriesFilter}`;
    let queryStringPage = page === 1 ? '' : `&page=${page}`;
    history.push(`${window.location.pathname}?${queryStringSortBy}${queryStringPriceRange}${queryStringCategories}${queryStringPage}`);
  }, [history]);

  useEffect(() => {
    axios.get(`${api}/categories`).then(res => {
      setCategories(res.data.categories);
    }).catch(err => console.log(err));
  }, [api]);

  useEffect(() => {
    const { productsG, items } = applyFilters(products, changePage, perPage, page, priceRange, sortBy, filterURL, categoriesFilterArr);
    setProductsToShow(productsG.slice((page - 1) * perPage, page * perPage));
    setPaginationBasic(<div className="text-center"><Pagination className="my-5">{items}</Pagination></div>);
  }, [page, priceRange, products, sortBy, filterURL, categoriesFilterArr]);

  function categoryChecked(e) {
    if (e.target.checked) {
      categoriesFilterArr.push(e.target.value);
    } else {
      categoriesFilterArr = categoriesFilterArr.filter(c => c !== e.target.value);
    }

    filterURL(sortBy, priceRange, 1, categoriesFilterArr);
  }

  function makeStringFromCategoriesArr(categoriesFilterArr) {
    let categoriesFilter = '';

    categoriesFilterArr.forEach((cf, index) => {
      index === categoriesFilterArr.length - 1 ? categoriesFilter += `${cf}` : categoriesFilter += `${cf},`
    });

    return categoriesFilter;
  }

  return (
    <>
      <NavbarC active="products" />

      <Container>
        <Row className="mt-5">
          <Col xs={2}>
            <Card className="filters shadow">
              <div id="sort">
                <h4 className="mb-2">Sort by:</h4>
                <select onChange={(e) => filterURL(e.target.value, priceRange, 1, categoriesFilterArr)} className="form-select ps-2" name="sortBy" defaultValue={parseInt(new URLSearchParams(search).get('sortBy')) || 1}>
                  <option value="1">Latest</option>
                  <option value="2">Name</option>
                  <option value="3">Price desc</option>
                  <option value="4">Price asc</option>
                  {/* <option value="5">Ratings</option> */}
                  <option value="6">Comments</option>
                  {/* <option value="7">Popularity</option> */}
                </select>
              </div>
              <div id="price" className="mt-3">
                <h4>Price range</h4>
                <span className="price-range-span">0 - {(priceRange).toLocaleString()} &euro;</span>
                <input type="range" min="0" max="250000" value={priceRange} onChange={(e) => filterURL(sortBy, e.target.value, 1, categoriesFilterArr)} className="form-range" id="customRange1" name="price-range" />
              </div>
              <div id="categories" className="mt-2">
                <h4 className="mb-2">Cetegory</h4>
                {categories && categories.map(category => (
                  <div key={category.id} className="form-check">
                    <input onChange={categoryChecked} checked={categoriesFilterArr.includes(category.name)} className="form-check-input" type="checkbox" name="category"
                      value={category.name} />
                    <label className="form-check-label">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
          <Col xs={10}>
            <Container fluid className="pe-2">
              <Row>
                {productsToShow && productsToShow.map(product => (
                  <Col lg={3} md={4} sm={6} key={product.id} className="product-col">
                    <Link to={`/products/${product.id}`} className="text-decoration-none">
                      <Card className="shadow p-card">
                        <img src={product.img} className="card-img-top" alt="Couldn't load" style={{ height: `300px` }} />
                        <Card.Body>
                          <Card.Title className="fw-bold mb-0">{product.name}</Card.Title>
                          <h6 className="mb-2">{product.category.name}</h6>
                          <p className="fw-bold mb-0 mt-3">
                            <i className="fas fa-star"></i> {calculateProductRating(product)}/10
                          </p>
                          <p className="fw-bold mb-0">
                            <i className="fas fa-tag"></i> {(Math.round(product.price * 100) / 100).toLocaleString()} &euro;
                          </p>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            </Container>
          </Col>
        </Row>

        {paginationBasic}

      </Container>

      <Footer />
    </>
  )
}

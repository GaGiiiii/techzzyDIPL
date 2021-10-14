import { Row, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import { calculateProductRating } from "../../Helpers";
import { ProductsContext } from "../../App";
import { useContext } from "react";

export default function SliderRow({ type }) {
  const { products } = useContext(ProductsContext);
  const tinySettings = {
    dots: true,
    infinite: true,
    speed: 1200,
    slidesToShow: 5,
    slidesToScroll: 5,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  function sortProducts() {
    let productsP = [...products];

    switch (type) {
      case 1: // Latest
        break;
      case 2: // Most Liked
        productsP.sort((a, b) => calculateProductRating(b) - calculateProductRating(a));
        break;
      case 3: // Most Commented
        productsP.sort((a, b) => b.comments.length - a.comments.length);
        break;
      default:
        break;
    }

    return productsP.splice(0, 20);;
  }

  return (
    <Row className="gx-0 mt-5">
      <h1 className="section-title">{type === 1 ? 'Latest' : type === 2 ? 'Most Liked' : 'Most Commented'} Products<hr className="hr-title" /></h1>
      <Slider {...tinySettings}>
        {products && sortProducts().map(product => (
          <Link to={`/products/${product.id}`} key={product.id} className="card-link-outer" draggable={false}>
            <div className="item">
              <Card className="p-0 shadow-sm">
                <Card.Img variant="top" src={product.img} />
                <Card.Body>
                  <Card.Title className="card-title">{product.name}</Card.Title>
                  <p className="fw-bold m-0">
                    <i className="fas fa-star"></i>
                    &nbsp;{calculateProductRating(product)} / 10
                  </p>
                  <p className="fw-bold m-0">
                    <i className="fas fa-tag"></i> {(Math.round(product.price * 100) / 100).toLocaleString()} &euro;
                  </p>
                </Card.Body>
              </Card>
            </div>
          </Link>
        ))}
      </Slider>
    </Row>
  )
}

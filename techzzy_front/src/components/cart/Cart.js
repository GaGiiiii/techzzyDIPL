import React, { useContext, useEffect, useState } from 'react'
import { Col, Container, Row, Button, Form } from 'react-bootstrap';
import Footer from '../Footer'
import NavbarC from '../NavbarC'
import './cart.css';
import { ApiContext, CurrentUserContext, FlashMessageContext, ProductsInCartContext } from '../../App';
import { Link, } from 'react-router-dom';
import CartItem from './CartItem';
import AlertC from '../AlertC';
import { PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';
import crypto from 'crypto';

export default function Cart() {
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const { productsInCart, setProductsInCart } = useContext(ProductsInCartContext);
    const [totalPrice, setTotalPrice] = useState(0);
    const [cartFlashMessage, setCartFlashMessage] = useState(null);
    const [orderID, setOrderID] = useState(null);
    const { api } = useContext(ApiContext);
    const { setFlashMessage } = useContext(FlashMessageContext);
    const [ooid, setOoid] = useState("");

    useEffect(() => {
        axios.get(`${api}/users/${currentUser.id}/cart`, {
            headers: {
                Authorization: `Bearer ${currentUser.token}`
            }
        }).then(res => {
            setProductsInCart(res.data.products);
        }).catch(err => console.log(err));
    }, [currentUser, setProductsInCart, api]);

    useEffect(() => {
        let totalP = 0;
        productsInCart.forEach(product => {
            totalP += parseFloat(product.price) * parseFloat(product.count);
        });
        setTotalPrice(totalP);
    }, [productsInCart]);

    /* 
      OOID has 3 parts 
      D*_PRODUCT_IDS_D*_USER_ID_D*_RANDOM_NUMBER
      D*_1_2_33_4_D*_15_D*_45656
    */
    useEffect(() => {
        let ooidG = "_D*_";
        productsInCart.forEach(product => {
            ooidG += product.id + "_";
        });
        ooidG += "D*_" + currentUser.id + "_D*_" + Math.floor(Math.random() * 1000000 + 1);
        setOoid(ooidG);
    }, [currentUser, productsInCart]);


    function createOrder(data, actions) {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: Math.round((totalPrice + totalPrice * 0.1) / 117 * 100) / 100,
                    },
                },
            ],
        }).then((orderID) => {
            setOrderID(orderID);

            return orderID;
        });
    }

    async function onApprove(data, actions) {
        let { dbSucc } = await savePayment(data.orderID);

        if (dbSucc) { // Saved in DB
            return actions.order.capture().then(function (details) {
                setFlashMessage({ type: 'success', message: `Transaction completed by ${details.payer.name.given_name}!` }) // Add Flash Message
                let newUser = { ...currentUser };
                newUser.cart.product_carts = [];
                setCurrentUser(newUser);
                setProductsInCart([]);
            }).catch(e => console.log(e));
        }
    }

    async function savePayment(orderID) {
        return axios({
            method: 'post',
            url: `${api}/payments`,
            headers: {
                Authorization: `Bearer ${currentUser.token}`
            },
            data: {
                order_id: orderID,
                user_id: currentUser.id,
                price: Math.round((totalPrice + totalPrice * 0.1) * 100) / 100,
                products: productsInCart,
                type: 'PAYPAL'
            },
        }).then(res => {
            return {
                dbSucc: true, // Did Payment Save In Database
                resData: res.data,
            }
        }).catch((error) => {
            if (error.response) {
                setFlashMessage({ type: 'danger', message: `${error.response.data.errors[0][0]}` }) // Add Flash Message
            }

            return {
                dbSucc: false,
                error,
            };
        });
    }

    // async function handleNestPay(e) {
    //   try {
    //     let response = await axios.post(`https://testsecurepay.eway2pay.com/fim/est3Dgate`, { name }, {
    //       headers: {
    //         Authorization: `Bearer ${currentUser.token}`
    //       }
    //     });
    //     console.log(response)
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

    function calculateHash() {
        let plainText = `13IN001798|${ooid}|${totalPrice}|${process.env.REACT_APP_BE_URL}/nestpay/success|${process.env.REACT_APP_BE_URL}/nestpay/fail|PreAuth||asdf||||941|13IN001798`;
        let hash = crypto.createHash('sha512');
        hash.update(plainText);

        return hash.digest('base64');
    }


    return (
        <>
            <NavbarC />

            <Container className="mb-5">
                <div className="d-flex justify-content-between mt-5 first-row mb-5">
                    <div>
                        <h1 className="fw-bold my-cart">My Cart</h1>
                    </div>
                    <div>
                        <Link to='/products'><button className="btn btn-primary continue">Continue Shopping</button></Link>
                    </div>
                </div>

                {cartFlashMessage && <AlertC cartAlert={true} flashMessage={cartFlashMessage} setFlashMessage={setCartFlashMessage} />}

                <Row>
                    <Col sm={12} md={8}>
                        {productsInCart && productsInCart.map(product => (
                            <CartItem product={product} key={product.id} totalPrice={totalPrice} setTotalPrice={setTotalPrice} setCartFlashMessage={setCartFlashMessage} />
                        ))}
                    </Col>
                    <Col sm={12} md={4}>
                        <div className="total-div shadow payment-col">
                            <Row>
                                <Col xs={"auto"} md={12}>
                                    <h5><strong className="fw-bold">SUBTOTAL: </strong> <span className="subtotal-price-span">{totalPrice.toLocaleString()}</span> RSD </h5>
                                    <h5><strong>SHIPPING: </strong> <span>0 RSD </span></h5>
                                    <h5><strong>TAX: </strong> <span className="tax-span">{(Math.round(totalPrice * 0.1 * 100) / 100).toLocaleString()}</span> RSD
                                        (10%)</h5>
                                    <h5 className="totalG2"><strong>TOTAL: </strong> <span
                                        className="total-price-span">{(Math.round((totalPrice + totalPrice * 0.1) * 100) / 100).toLocaleString()} RSD</span>
                                        <br /> <span
                                            className="total-price-span">({(Math.round((totalPrice + totalPrice * 0.1) / 117 * 100) / 100).toLocaleString()}&euro;)</span>
                                    </h5>
                                    {/* <button className="btn btn-primary btn-lg checkout-btn">Checkout</button> */}
                                </Col>
                                <Col md={12}>
                                    {productsInCart.length > 0 && <PayPalButtons style={{ marginTop: `10px` }} createOrder={createOrder} onApprove={onApprove} forceReRender={[totalPrice]} />}
                                </Col>
                                <Col md={12}>
                                    {productsInCart.length > 0 &&
                                        <Form action='https://testsecurepay.eway2pay.com/fim/est3Dgate' method='POST'>
                                            <input type='hidden' name='failUrl' value={process.env.REACT_APP_BE_URL + '/nestpay/fail'} />
                                            <input type='hidden' name='currency' value='941' />
                                            <input type='hidden' name='trantype' value='PreAuth' />
                                            <input type='hidden' name='okUrl' value={process.env.REACT_APP_BE_URL + '/nestpay/success'} />
                                            <input type='hidden' name='amount' value={totalPrice} />
                                            <input type='hidden' name='oid' value={ooid} />
                                            <input type='hidden' name='clientid' value='13IN001798' />
                                            <input type='hidden' name='storetype' value='3d_pay_hosting' />
                                            <input type='hidden' name='lang' value='sr' />
                                            <input type='hidden' name='hashAlgorithm' value='ver2' />
                                            <input type='hidden' name='rnd' value='asdf' />
                                            <input type='hidden' name='encoding' value='utf-8' />
                                            <input type='hidden' name='hash' value={calculateHash()} />
                                            <Button type="submit" className='w-100'>Pay With NestPay</Button>
                                        </Form>
                                    }
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    )
}

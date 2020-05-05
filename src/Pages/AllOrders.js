import React, { Component } from 'react';
import '../Resources/Styling/AllOrders.css';
import phone from "../Resources/Images/phone.png";
import { Spinner } from 'react-bootstrap';

import AdminNavbar from "./AdminNavbar";

const GLOBAL = require('../global');

class AllOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: [],
            allOrdersEmpty: true,
            loading: true,
        }
    }

    // Rendering Methods
    // Calculate Order Total
    orderTotal = (orderItem) => {
        let total = 0;
        orderItem.items.map(( cartItem) => {
            total += (cartItem['product-quantity'] * cartItem['product-pricePerUnit']);
        });
        return total;
    };

    // Displayed data
    displayedData = () => {
        if(this.state.loading) {
            return(
                <Spinner animation="border" variant="success" />
            );
        } else if(!this.state.allOrdersEmpty) {
            return(
                this.state.order.map((orderItem, index = 0) => {
                    console.log(orderItem)
                    return(
                        <div
                            className='d-flex flex-column align-items-center justify-content-center order-box'
                            key={orderItem.id}
                        >
                            <div className='d-flex flex-row align-items-center justify-content-between title-section'>
                            <span className='user-name'>
                                { orderItem.userName }
                            </span>
                                <div className='user-phone-section'>
                                    <img
                                        src={phone}
                                        className='phone-img'
                                    />
                                    <span className='user-phone'>
                                    : { orderItem.userMobileNo }
                                </span>
                                </div>
                            </div>
                            <div className='d-flex flex-row align-items-center justify-content-end date-section'>
                        <span className='order-date'>
                            {orderItem.orderDate}
                        </span>
                            </div>
                            <div className='order-list-section'>
                                {
                                    orderItem.items.map(( cartItem ) => {
                                        return(
                                            <div className='order-item-section'>
                                            <span className='order-item'>
                                                { cartItem['product-name'] } - { cartItem['product-quantity'] } - ₹{ cartItem['product-pricePerUnit'] * cartItem['product-quantity'] }
                                            </span>
                                            </div>
                                        )
                                    })
                                }
                                <div className='order-total-section'>
                                <span className='order-total-text'>
                                    TOTAL: ₹{ this.orderTotal(orderItem) }
                                </span>
                                </div>
                            </div>
                        </div>
                    );
                })
            );
        } else if(this.state.allOrdersEmpty) {
            return(
                <div className='no-orders-msg'>
                    No Orders Available
                </div>
            )
        }
    };

    // Component Life Cycle Methods
    componentDidMount() {
        fetch(GLOBAL.BASE_URL+'orders/getAllOrders',
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: localStorage.getItem('token')
                })
            }
        )
            .then(res => res.json())
            .then(
                (result) => {
                    if(result.status === 200) {
                        if(result.allOrders.length === 0) {
                            this.setState({
                                allOrderEmpty: true,
                                loading: false
                            });
                        }
                         else {
                            this.setState({
                                allOrdersEmpty: false,
                                order: result.allOrders,
                                loading: false
                            });
                        }
                    } else if(result.status === 401) {
                        alert('Invalid User, Please login again');
                        this.props.history.push("/");
                    }
                },
                (err) => {
                    console.log('THE ERROR IS:::', err);
                }
            );

    }

    render() {
        return(
            <div className='ao-primary-section'>
                <AdminNavbar />
                <div className='d-flex flex-column align-items-center justify-content-center'>
                    <span className='all-orders-text'>
                        All Orders
                    </span>
                    <hr className='all-orders-hr' />
                    { this.displayedData() }
                </div>
            </div>
        );
    }
}

export default AllOrders;

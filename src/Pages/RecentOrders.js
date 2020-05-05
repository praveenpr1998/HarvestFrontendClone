import React, { Component } from 'react';
import AdminNavbar from "./AdminNavbar";
import '../Resources/Styling/RecentOrders.css';
import phone from '../Resources/Images/phone.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from "react-bootstrap";
const GLOBAL = require('../global');

let _ = require('lodash');

class RecentOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            recentOrders: true,
            consolidatedOrders: false,
            order: [],
            categories: [],
            products: [],
            groupedProducts: [],
            totalPrice: 0,
            recentEmpty: true,
            consolidatedEmpty: true,
        };
    };

    // Non-Rendering Methods
    // Mark as Delivered
    markAsDelivered = (orderItem) => {
        fetch(GLOBAL.BASE_URL+'orders/markAsDelivered', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderId: orderItem.orderId,
            }),
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if(result.status === 200){
                        this.componentDidMount();
                            toast.success(' Marked Order as Delivered', {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                            });
                    }
                },
                (error) => {
                    console.log('ERROR MARKING AS DELIVERED', error);
                }
            );
    };

    // Recent Orders Button Clicked
    recentOrdersBtn = () => {
        this.setState({
            recentOrders: true,
            consolidatedOrders: false,
        });
    };

    // Consolidated Orders Button Clicked
    consolidatedOrdersBtn = () => {
        this.setState({
            recentOrders: false,
            consolidatedOrders: true,
        });
    };


    // Calculate Order Total
    orderTotal = (orderItem) => {
        let total = 0;
        orderItem.items.map(( cartItem) => {
            total += (cartItem['product-quantity'] * cartItem['product-pricePerUnit']);
        });
        return total;
    };

    // Redering Methods
    // Render Total Price
    totalPrice = () => {
        if(Object.keys(this.state.groupedProducts).length !== 0) {
            let totalPrice = 0;
            Object.keys(this.state.groupedProducts).map((key) => {
                this.state.groupedProducts[key].map((product) => {
                    totalPrice += (product['product-quantity'] * product['product-pricePerUnit'])
                });
            });
            if(this.state.consolidatedOrders) {
                return(
                    <div className='total-price-section'>
                <span className='total-price-text'>
                    Total Price:
                    <span className='total-price-amount'>
                        ₹{totalPrice}
                    </span>
                </span>
                    </div>
                );
            }
        }
    };

    // Render Pending Orders
    pendingOrders = () => {
        if(this.state.loading === true) {
            return(
                <div>
                    <Spinner animation="border" variant="success" />
                </div>
            )
        } else if(this.state.order.length === 0) {
            return(
                <div className='no-pending-orders-msg'>
                    No Pending Orders
                </div>
            )
        } else if(this.state.order.length !== 0) {
            return(
                this.state.order.map((orderItem) => {
                    return(
                        <div className='d-flex flex-column align-items-center justify-content-center order-box'>
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
                                {orderItem.orderDate    }
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
                                    Total: ₹{ this.orderTotal(orderItem) }
                                </span>
                                </div>
                            </div>
                            <div className='btn-section'>
                                <button
                                    className='mark-as-delivered-btn'
                                    onClick={ () => this.markAsDelivered(orderItem) }
                                >
                                    Mark as Delivered
                                </button>
                            </div>
                        </div>
                    );
                })
            );
        }
    };

    // Render Consolidated Orders
    consolidated = () => {
        if(Object.keys(this.state.groupedProducts).length === 0) {
            return(
                <div className='no-pending-orders-msg'>
                    No Pending Orders
                </div>
            );
        } else {
            return(
                Object.keys(this.state.groupedProducts).map((key) => {
                    return(
                        <div className='primary-area '>
                            <div className='category-text-section'> <span className='category-text'>    { key }:    </span>
                            </div>
                            <table className='items-table'>
                                <tr>
                                    <th className='name-column-th'>Name</th>
                                    <th className='qty-column-th'>Total Quantity</th>
                                    <th className='price-column-th'>Total Price (₹)</th>
                                </tr>
                                {
                                    this.state.groupedProducts[key].map((product) => {
                                        return(
                                            <tr>
                                                <td className='name-column'>{product['product-name']}</td>
                                                <td className='qty-column'>{product['product-quantity']}</td>
                                                <td className='price-column'>{product['product-quantity'] * product['product-pricePerUnit']}</td>
                                            </tr>
                                        );
                                    })
                                }
                            </table>
                        </div>
                    );
                })
            );
        }
    };

    // Component Lifecycle Methods
    // Component-Did-Mount method
    componentDidMount() {
        fetch(GLOBAL.BASE_URL+'orders/getRecentOrders', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: localStorage.getItem('token')
            })
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if(result.status === 200) {
                        this.setState({
                            order: result.recentOrders,
                            groupedProducts: result.groupedItems,
                            loading: false,
                        });
                    } else if(result.status === 401) {
                            alert('Invalid User, Please login again');
                            this.props.history.push("/");
                    }

                },
                (error) => {
                    console.log('RECENT ORDERS ERROR:::', error);
                }
            );
    }

    // render() method
    render() {
        return(
            <div className='primary-section'>
                <ToastContainer />
                <AdminNavbar />
                <div className='d-flex flex-column align-items-center justify-content-center'>
                    <div className='d-flex flex-row align-items-center justify-content-center selection-section'>
                        <button
                            className={(this.state.recentOrders ? 'active-btn' : 'inactive-btn' )}
                            onClick={() => this.recentOrdersBtn()}
                        >
                            Pending Orders
                        </button>
                        <span className='selection-seperator'>l</span>
                        <button
                            className={(this.state.consolidatedOrders ? 'active-btn' : 'inactive-btn' )}
                            onClick={() => this.consolidatedOrdersBtn()}
                        >
                            Consolidated Orders
                        </button>
                    </div>
                    <div
                        className='download-orders-section'
                    >
                        <a href={ GLOBAL.BASE_URL+"orders/downloadOrderReport" }
                           target="blank"
                            className='download-orders-btn'
                        >
                            Download Reports
                        </a>
                    </div>
                    {   this.state.recentOrders &&
                        this.pendingOrders()
                    }
                    {   this.state.consolidatedOrders &&
                        this.consolidated()
                    }
                    { this.totalPrice() }
                </div>
            </div>
        );
    }
}

export default RecentOrders;

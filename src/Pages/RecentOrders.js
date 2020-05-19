import React, { Component } from 'react';
import AdminNavbar from "./AdminNavbar";
import '../Resources/Styling/RecentOrders.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner, Container } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
            startDate:null,
            endDate:null,
            dateSelected:'no'
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
                }
            );
    };

    // Mark as Rejected - Reject Order
    rejectOrder = (orderItem) => {
        fetch(GLOBAL.BASE_URL+'orders/rejectOrder', {
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
                            toast.success(' Order Rejected', {
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
                        <Container className="bootstrapcontainer" style={{border:'0.5px solid #d4caca', borderRadius:'15px', marginTop:'15px', padding: '15px', lineHeight:2, backgroundColor: '#F6F6F6'}}>
                            <div style={{display:'flex', margin: '0 0.938em'}}>
                                <div style={{display:'flex', flex:1, fontWeight:'bold'}}>{orderItem.userName} - {orderItem.userMobileNo}</div>
                                <div style={{display:'flex', flex:1, justifyContent:'flex-end'}}>{ new Intl.DateTimeFormat('en-IN').format(orderItem.orderDate) }</div>
                            </div>
                            <hr style={{backgroundColor: '#d4caca', marginTop: '0.5rem', marginBottom: '0.5rem'}} />
                            {
                                orderItem.items.map((cartItem) => {
                                    return(
                                        <li className='ro-items-list'>
                                            { cartItem['product-name'] } - { cartItem['product-quantity'] } - ₹{ cartItem['product-pricePerUnit'] * cartItem['product-quantity'] }
                                        </li>
                                    )
                                })
                            }
                            <div style={{fontWeight:'bold', textAlign:'center', margin:'5px'}}>Total: ₹ {this.orderTotal(orderItem)}</div>
                            <div className='co-btn-div' >
                                <button
                                    className='mark-as-delivered-btn'
                                    onClick={() => this.markAsDelivered(orderItem)}>
                                        Mark as Delivered
                                </button>

                                <button
                                    className='reject-order-btn'
                                    onClick={() => this.rejectOrder(orderItem)}>
                                        Reject Order
                                </button>
                            </div>
                        </Container>
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
                            <div className='category-text-section' style={{margin:'5px'}}> <span className='category-text' style={{fontWeight:'bold', color:'#737373', fontSize:'16px'}}>    { key }:    </span>
                            </div>
                            <table className='items-table'>
                                <tr>
                                    <th className='name-column-th'>Name</th>
                                    <th className='qty-column-th'>Total Qty</th>
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
                token: localStorage.getItem('token'),
                startDate:this.state.startDate,
                endDate:this.state.endDate,
                dateSelected:this.state.dateSelected
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
                }
            );
    }

    handleDateChange=date=>{
        this.setState({startDate: date});
        this.setState({dateSelected:'yes'},()=>{
            this.componentDidMount();
        });   
    }

    handleEndDateChange=date=>{
        this.setState({endDate: date});
        this.setState({dateSelected:'yes'},()=>{
            this.componentDidMount();
        });   
    }

    // render() method
    render() {
        return(
            <div className='primary-section'>
                <ToastContainer />
                <AdminNavbar />
                <div className='d-flex flex-column align-items-center justify-content-center'>
                    <div className='d-flex flex-row align-items-center justify-content-center selection-section' style={{paddingTop:'20px'}}>
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
                    <div className='row fromto' style={{paddingTop:10,paddingBottom:20}}>
                           <div className='col start'>
                                <DatePicker
                                placeholderText="Select start date"
                                selected={this.state.startDate}
                                onChange={this.handleDateChange} 
                                dateFormat="dd/MM/yyyy"
                                /> 
                                </div>
                                  <div className='col end'>
                                       <DatePicker
                                    placeholderText="Select end date"
                                 selected={this.state.endDate}
                                onChange={this.handleEndDateChange}
                                 dateFormat="dd/MM/yyyy"
                                /></div>
                                </div>
                                 {
                        this.state.order.length !== 0 &&
                        
                        <div className='download-orders-section' style={{margin:'15px 0px'}}>
                            <a href={ (this.state.recentOrders) ? GLOBAL.BASE_URL+"orders/downloadOrderReport" : GLOBAL.BASE_URL+"orders/downloadConsolidatedOrderReport" }
                               target="blank"
                               className='download-orders-btn'
                               style={{borderRadius:'10px', fontSize:'14px'}}>
                                Download Reports
                            </a>
                        </div>
                        
                    }
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

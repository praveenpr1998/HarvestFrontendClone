import React, { Component } from 'react';
import '../Resources/Styling/AllOrders.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner, Container,Button } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AdminNavbar from "./AdminNavbar";
import { FcCalendar } from "react-icons/fc";
const GLOBAL = require('../global');

class AllOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: [],
            allOrdersEmpty: true,
            loading: true,
            startDate: null,
            endDate: new Date(),
            dateSelected:'no',
            filterVisible:'false'
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
                this.state.order.map((orderItem, index) => {
                    return(
                        <Container
                            key={{index}}
                            className="order-container"
                        >
                            <div style={{display:'flex'}}>
                                <div style={{display:'flex', flex:1, fontWeight:'bold'}}>{orderItem.userName} - {orderItem.userMobileNo}</div>
                                <div style={{display:'flex', flex:1, justifyContent:'flex-end'}}>{ new Intl.DateTimeFormat('en-IN').format(orderItem.orderDate) }</div>
                            </div>
                            <hr style={{backgroundColor: '#d4caca', marginTop: '0.5rem', marginBottom: '0.5rem'}} />
                            {
                                orderItem.items.map((cartItem) => {
                                    return(
                                        <li className='ao-items-list'>
                                            { cartItem['product-name'] } - { cartItem['product-quantity'] } - ₹{ cartItem['product-pricePerUnit'] * cartItem['product-quantity'] }
                                        </li>
                                    )
                                })
                            }
                            {/*<div style={{fontWeight:'bold', textAlign:'right', margin:'5px'}}>Total: ₹ {this.orderTotal(orderItem)}</div>*/}
                            <hr style={{backgroundColor: '#d4caca', marginTop: '0.5rem', marginBottom: '0.5rem'}} />
                            <div className='d-flex flex-row align-items-center justify-content-between'>
                                <span className='ao-order-status-text'>
                                    Order Status: { orderItem.orderStatus }
                                </span>
                                <span className='ao-order-total-text'>
                                    Total: ₹ {this.orderTotal(orderItem)}
                                </span>
                            </div>
                        </Container>
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

    // Non-Rendering Methods
    // Filter Orders based on the date
    filterOrders(){
        toast.success('Orders Filtered', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        this.componentDidMount();
    }

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
                    token: localStorage.getItem('token'),
                    startDate:this.state.startDate,
                    endDate:this.state.endDate,
                    dateSelected:this.state.dateSelected
                })
            }
        )
            .then(res => res.json())
            .then(
                (result) => {
                    if(result.status === 200) {
                        if(result.allOrders.length === 0) {

                            this.setState({
                                allOrdersEmpty: true,
                                loading: false,
                                filterVisible:result.filterVisible
                            });
                        }
                         else {
                            this.setState({
                                allOrdersEmpty: false,
                                order: result.allOrders,
                                loading: false,
                                filterVisible:result.filterVisible
                            });
                        }
                    } else if(result.status === 401) {
                        alert('Invalid User, Please login again');
                        this.props.history.push("/");
                    }
                },
                (error) => {
                }
            );

    }

    // render() method
    render() {
        return(
            <div className='ao-primary-section'>
                <ToastContainer />
                <AdminNavbar />
                <div className='d-flex flex-column align-items-center justify-content-center'>
                    <span className='all-orders-text' style={{paddingTop:'20px'}}>
                        All Orders
                    </span>
                    {
                        (this.state.order.length!==0 || this.state.filterVisible===true)?
                        <div className='date-picker-section'>
                            <div className='date-picker-start-section'>
                                <span className='date-picker-text'>
                                    From:
                                </span>
                                <FcCalendar
                                    size="20"
                                    className='calender-icon'
                                />
                                <DatePicker
                                    className='date-picker-text-input'
                                    placeholderText="Select start date"
                                    selected={ this.state.startDate }
                                    onChange={ (date) => this.setState({ startDate: date, dateSelected: 'yes' }) }
                                    dateFormat="dd/MM/yyyy"
                                    maxDate={ this.state.endDate - 1 }
                                />
                            </div>
                            <div className='date-picker-end-section'>
                                <span className='date-picker-text'>
                                    From:
                                </span>
                                <FcCalendar
                                    size="20"
                                    className='calender-icon'
                                />
                                <DatePicker
                                    className='date-picker-text-input'
                                    placeholderText="Select end date"
                                    dateFormat="dd/MM/yyyy"
                                    selected={ this.state.endDate }
                                    onChange={ (date) => this.setState({ endDate: date, dateSelected: 'yes' }) }
                                    minDate={ this.state.startDate }
                                    maxDate={ (new Date()) }
                                />
                            </div>
                            <div>
                                <Button
                                    className='filter-btn'
                                    onClick={ ()=>this.filterOrders() }
                                >
                                        Filter
                                </Button>
                            </div>
                        </div>:null
                    }

                    <hr className='all-orders-hr'/>
                    { this.displayedData() }
                    {/*<hr className='all-orders-bottom-hr'/>*/}
                </div>
            </div>
        );
    }
}

export default AllOrders;

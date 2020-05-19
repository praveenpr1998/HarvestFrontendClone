import React, { Component } from 'react';
import '../Resources/Styling/AllOrders.css';
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
            startDate:null,
            endDate:null,
            dateSelected:'no'
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
                            className="bootstrapcontainer"
                            style={{border:'0.5px solid #d4caca', borderRadius:'15px', marginBottom:'15px', padding: '15px', lineHeight:2, backgroundColor: '#F6F6F6'}}>
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
                        console.log(result.allOrders.length)
                        if(result.allOrders.length === 0) {
                           
                            this.setState({
                                allOrdersEmpty: true,
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
                (error) => {
                }
            );

    }

    handleDateChange=date=>{
        this.setState({startDate: date});
        this.setState({dateSelected:'yes'});   
    }

    handleEndDateChange=date=>{
        this.setState({endDate: date});
        this.setState({dateSelected:'yes'});   
    }
    
    filterOrders(){
        this.componentDidMount();
    }

    render() {
        return(
            <div className='ao-primary-section'>
                <AdminNavbar />
                <div className='d-flex flex-column align-items-center justify-content-center'>
                    <span className='all-orders-text' style={{paddingTop:'20px'}}>
                        All Orders
                    </span>
                    <div className=' ' style={{paddingBottom:20}}>
                           <div className=' ' style={{paddingBottom:20,paddingTop:15}}>
                                <FcCalendar size="20" /> <DatePicker
                                placeholderText="Select start date"
                                selected={this.state.startDate}
                                onChange={this.handleDateChange}
                                dateFormat="dd/MM/yyyy" 
                                /> 
                                </div>
                                  <div className=' ' style={{paddingBottom:10,paddingTop:10}}>
                                    <FcCalendar size="20" /> <DatePicker
                                    placeholderText="Select end date"
                                    dateFormat="dd/MM/yyyy"
                                    selected={this.state.endDate}
                                    onChange={this.handleEndDateChange}        
                                /> 
                                </div>
                              
                                </div>
                                <div style={{paddingRight:10,marginBottom:20}}>
                                   <Button className='btn btn-success btn-sm'  onClick={()=>this.filterOrders()}>Filter</Button>
                                  </div>
                    
                    <hr className='all-orders-hr'/>
                    { this.displayedData() }
                    {/*<hr className='all-orders-bottom-hr'/>*/}
                </div>
            </div>
        );
    }
}

export default AllOrders;

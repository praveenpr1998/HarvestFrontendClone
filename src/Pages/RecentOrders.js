import React, { Component } from 'react';
import AdminNavbar from "./AdminNavbar";
import '../Resources/Styling/RecentOrders.css';
import phone from '../Resources/Images/phone.png';

let _ = require('lodash');

class RecentOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        fetch('http://localhost:1337/orders/markAsDelivered', {
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
                    if(result.status === 200)
                        this.componentDidMount();
                },
                (error) => {
                    console.log('ERROR MARKING AS DELIVERED', error);
                }
            );
    };

    // Generate Products and Categories
    productsCategories = () => {
        let categoriesArray = [];
        let productsArray = [];
        this.state.order.map((orderData) => {
            orderData.items.map((item) => {
                if(!categoriesArray.includes(item.category)) {
                    categoriesArray.push(item.category);
                }
                productsArray.push(item);
            });
        });
        let properProducts = [];
        productsArray.map((product) => {
            if(properProducts.length === 0){
                properProducts.push(product);
            } else {
                let flag = false;
                properProducts.map((properProduct) => {
                    if(product.id === properProduct.id) {
                        flag = true;
                        properProduct.quantity += product.quantity;
                    }
                });
                if(flag === false) {
                    properProducts.push(product);
                }
            }
        });
        this.setState({
            categories: categoriesArray,
            products: properProducts,
        });
    };

    // Redering Methods
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

    // Displayed Data
    displayedData = () => {
        if(this.state.recentOrders && !this.state.consolidatedOrders) {
            return(this.recentOrders());
        } else if(!this.state.recentOrders && this.state.consolidatedOrders) {
            return (this.consolidatedOrders());
        }
    };

    // Calculate Order Total
    orderTotal = (orderItem) => {
        let total = 0;
        orderItem.items.map(( cartItem) => {
            total += (cartItem['product-quantity'] * cartItem['product-pricePerUnit']);
        });
        return total;
    };

    // // Render Recent Orders
    // recentOrders = () => {
    //     return(
    //         this.state.order.map((orderItem) => {
    //             return(
    //                 <div className='d-flex flex-column align-items-center justify-content-center order-box'>
    //                     <div className='d-flex flex-row align-items-center justify-content-between title-section'>
    //                         <span className='user-name'>
    //                             { orderItem.userName }
    //                         </span>
    //                         <div className='user-phone-section'>
    //                             <img
    //                                 src={phone}
    //                                 className='phone-img'
    //                             />
    //                             <span className='user-phone'>
    //                                 : { orderItem.userMobileNo }
    //                             </span>
    //                         </div>
    //                     </div>
    //                     <div className='d-flex flex-row align-items-center justify-content-end date-section'>
    //                         <span className='order-date'>
    //                             {/*{ new Intl.DateTimeFormat('en-IN').format(orderItem.orderDate) }*/}
    //                         </span>
    //                     </div>
    //                     <div className='order-list-section'>
    //                         {
    //                             orderItem.items.map(( cartItem ) => {
    //                                 return(
    //                                     <div className='order-item-section'>
    //                                         <span className='order-item'>
    //                                             { cartItem.name } - { cartItem.quantity } - ₹{ cartItem.pricePerUnit * cartItem.quantity }
    //                                         </span>
    //                                     </div>
    //                                 )
    //                             })
    //                         }
    //                         <div className='order-total-section'>
    //                             <span className='order-total-text'>
    //                                 TOTAL: ₹{ this.orderTotal(orderItem) }
    //                             </span>
    //                         </div>
    //                     </div>
    //                     <div className='btn-section'>
    //                         <button
    //                             className='mark-as-delivered-btn'
    //                             onClick={ () => this.markAsDelivered(orderItem) }
    //                         >
    //                             Mark as Delivered
    //                         </button>
    //                     </div>
    //                 </div>
    //             );
    //         })
    //     );
    // };
    //
    // // Render Consolidated orders
    // consolidatedOrders = () => {
    //     return(
    //         <div>
    //             {
    //                 this.state.categories.map((category) => {
    //                     return(
    //                         <div className='primary-area '>
    //                             <div className='category-text-section'>
    //                                 <span className='category-text'>
    //                                     {category}:
    //                                 </span>
    //                             </div>
    //                             <table className='items-table'>
    //                                 <tr>
    //                                     <th className='name-column'>Name</th>
    //                                     <th className='qty-column'>Total Quantity</th>
    //                                     <th className='price-column'>Total Price (₹)</th>
    //                                 </tr>
    //                                 {
    //                                     this.state.products.map((product) => {
    //                                         if(product.category === category) {
    //                                             return(
    //                                                 <tr>
    //                                                     <td className='name-column'>{product.name}</td>
    //                                                     <td className='qty-column'>{product.quantity}</td>
    //                                                     <td className='price-column'>{product.quantity * product.pricePerUnit}</td>
    //                                                 </tr>
    //                                             );
    //                                         }
    //                                     })
    //                                 }
    //                             </table>
    //                         </div>
    //                     )
    //                 })
    //             }
    //         </div>
    //
    //     );
    // };

    // Render Total Price
    totalPrice = () => {
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
    };

    consolidate = () => {
        let order = this.state.order    ;
        let items = [];
        order.map((orderItem) => {
            orderItem.items.map((item) => {
                items.push(item);
            })
        });
        console.log('ITEMS CONCAT::', items);
        let groupedProducts = _.groupBy(items, 'category');
        let originalProducts = [];
        Object.keys(groupedProducts).map((key) => {
            let tempArr = [];
            groupedProducts[key].map((item) => {
                console.log('ITEM::::', item);
                if(tempArr.length === 0) {
                    tempArr.push(item);
                } else {
                    let flag = 0;
                    tempArr.map((tempItem) => {
                        if(tempItem.id === item.id) {
                            flag = 1;
                            tempItem.quantity += item.quantity;
                        }
                    });
                    if(flag === 0) {
                        tempArr.push(item);
                    }
                }
            });
            groupedProducts[key] = tempArr;
        });
        this.state.groupedProducts = groupedProducts;
    };

    // Component Lifecycle Methods
    // Component-Did-Mount method
    componentDidMount() {
        fetch('http://localhost:1337/orders/getRecentOrders', {
            method: 'GET',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        order: result.recentOrders,
                        groupedProducts: result.groupedItems,
                    });
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
                <AdminNavbar />
                <div className='d-flex flex-column align-items-center justify-content-center'>
                    <div className='d-flex flex-row align-items-center justify-content-center selection-section'>
                        <button
                            className={(this.state.recentOrders ? 'active-btn' : 'inactive-btn' )}
                            onClick={() => this.recentOrdersBtn()}
                        >
                            Recent Orders
                        </button>
                        <span className='selection-seperator'>l</span>
                        <button
                            className={(this.state.consolidatedOrders ? 'active-btn' : 'inactive-btn' )}
                            onClick={() => this.consolidatedOrdersBtn()}
                        >
                            Consolidated Orders
                        </button>
                    </div>
                    {   this.state.recentOrders &&
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
                                    TOTAL: ₹{ this.orderTotal(orderItem) }
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
                    }
                    {   this.state.consolidatedOrders &&
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
                    }
                    { this.totalPrice() }
                </div>
            </div>
        );
    }
}

export default RecentOrders;

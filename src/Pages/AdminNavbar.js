import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, NavbarBrand, NavLink, Nav, Container } from "react-bootstrap";
import { NavLink as RouterNavLink } from "react-router-dom" ;

import '../Resources/Styling/AdminNavbar.css';
import Logo from '../Resources/Images/Logo.png'

class AdminNavbar extends Component {
    constructor(props) {
        super(props);
    }

    logout(){
        localStorage.removeItem("token");
    }

    render() {
        return(
            <Container className="bootstrapcontainer" >
                <Navbar bg="white" expand="lg">
                    <Navbar.Brand >
                        <img src={Logo} className="logoHome" alt="Logo"></img>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <Nav.Link>
                                <RouterNavLink
                                    to='/recentOrders'
                                    activeClassName='navLink-active'
                                    className='navLink-inactive'
                                >
                                    Pending Orders
                                </RouterNavLink>
                            </Nav.Link>
                            <Nav.Link>
                                <RouterNavLink
                                    to='/allOrders'
                                    activeClassName='navLink-active'
                                    className='navLink-inactive'
                                >
                                    All Orders
                                </RouterNavLink>
                            </Nav.Link>
                            <Nav.Link>
                                <RouterNavLink
                                    to='/manageProducts'
                                    activeClassName='navLink-active'
                                    className='navLink-inactive'
                                >
                                    Manage Products
                                </RouterNavLink>
                            </Nav.Link>
                            <Nav.Link
                                onClick={() => this.logout()}
                            >
                                <RouterNavLink
                                    to='/'
                                    className='navLink-inactive'
                                >
                                    Logout
                                </RouterNavLink>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <div style={{height:10,width:'100%',backgroundColor:'#dbdbdb',position:'absolute',left:0,right:0}}></div>
            </Container> 
        );
    }
}

export default AdminNavbar;

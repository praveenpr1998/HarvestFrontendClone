import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, NavbarBrand, NavLink, Nav } from "react-bootstrap";
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
            <Navbar bg="white" expand="lg">
                <Navbar.Brand >
                    <img src={Logo} className="logo-img" alt="Logo"></img>
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
        );
    }
}

export default AdminNavbar;

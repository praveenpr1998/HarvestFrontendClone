import React, { Component } from 'react';
import "../styles.css";
import "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar,Nav} from "react-bootstrap";
import { NavLink as RouterNavLink } from "react-router-dom" ;
import { createBrowserHistory } from "history";
const GLOBAL = require('../global');
const history = createBrowserHistory();

class Header extends Component{
  state={
    token:''
  }
     async logout(){
      this.setState({token:await localStorage.getItem("token")},()=>{
        fetch(GLOBAL.BASE_URL+"users/removeUser",{
        method:"POST",
        body:JSON.stringify({token:this.state.token})
    })
    .then(res => res.json())
    .then(
      (result) => { 
        if(result.message==="Success"){
          console.log(result.message)
        localStorage.removeItem("token");
        history.push("/");
        window.location.reload();
        }
      });
    })
    }
      
    render(){
        return(
            <div>
            <Navbar bg="white" expand="lg">
                <RouterNavLink
                  to='/home'
                  activeClassName=''
                  className='navLink-inactive'
                >
                <Navbar.Brand href="">
                  <img src={require("../Resources/Images/Harvest Logo.png")} className="logoHome" alt="Logo"></img> 
                </Navbar.Brand>
                </RouterNavLink>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                      <Nav.Link>
                        <RouterNavLink
                          to='/home'
                          activeClassName=''
                          className='navLink-inactive'
                         >
                              Home
                         </RouterNavLink>
                      </Nav.Link>
                      <Nav.Link >
                        <RouterNavLink
                            to='/cart'
                            activeClassName=''
                            className='navLink-inactive'
                         >
                              My Cart
                        </RouterNavLink>
                      </Nav.Link>
                      <Nav.Link onClick={()=>this.logout()}  >
                        <RouterNavLink
                             to='#'
                             activeClassName='navLink-active'
                             className='navLink-inactive'
                        >
                           Logout
                        </RouterNavLink>
                      </Nav.Link>
                    </Nav>
                  </Navbar.Collapse>
          </Navbar>
        <div style={{height:10,width:'100%',backgroundColor:'#dbdbdb',position:'absolute',left:0,right:0}}>
         </div>
         </div>
            
        )
    }
}
export default Header;

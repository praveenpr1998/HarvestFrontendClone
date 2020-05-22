import React, { Component } from 'react';
import "../styles.css";
import "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar,Nav,Modal,Spinner,Button} from "react-bootstrap";
import { NavLink as RouterNavLink } from "react-router-dom" ;
import { FaShoppingCart } from 'react-icons/fa';
import { createBrowserHistory } from "history";
const GLOBAL = require('../global');
const history = createBrowserHistory();

class Header extends Component{
  state={
    token:'',
    modalVisible:false
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
        localStorage.removeItem("token");
        localStorage.removeItem("itemsArray");
        history.push("/");
        window.location.reload();
        }
        });
      })
    }

    async popup(){
        this.setState({modalVisible:true});
    }

    async handleClose(){
      this.setState({modalVisible:false})
    }
    
    render(){
        return(
            <div>
           <Modal show={this.state.modalVisible} onHide={()=>this.handleClose()}>
                <Modal.Header closeButton>
                  <Modal.Title>Logout</Modal.Title>
                </Modal.Header>
                <Modal.Body>Logging out will remove your cart items!</Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={()=>this.handleClose()}>
                      Cancel
                    </Button>
                    <Button variant="danger" onClick={()=>this.logout()}>
                       Logout
                    </Button>
                </Modal.Footer>
             </Modal>
    
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
                <div className="topcart"><RouterNavLink
                          to='/cart'
                          activeClassName=''
                          className='navLink-inactive'
                         >
                            <FaShoppingCart color="green" size="24"/>
                         </RouterNavLink></div>
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
                      <Nav.Link  onClick={()=>this.popup()} >
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

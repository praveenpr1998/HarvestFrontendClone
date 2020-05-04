import React, { Component } from 'react';
import "../styles.css";
import "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar,Nav} from "react-bootstrap";
import { createBrowserHistory } from "history";
const history = createBrowserHistory();

class Header extends Component{
    logout(){
        localStorage.removeItem("token");
    }

    moveHome(){
        history.push("/cart");
        window.location.reload();
    }

    render(){
        return(
            <div>
            <Navbar bg="white" expand="lg">
            <Navbar.Brand href="#home">
            <img src={require("../Resources/Images/Harvest Logo.png")} className="logoHome" alt="Logo"></img> 
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Link href="/home"><p className="tabmenus">Home</p></Nav.Link>
                <Nav.Link href="/cart"><p className="tabmenus">MyCart</p></Nav.Link>
                <Nav.Link onClick={()=>this.logout()}  href="/"><p className="tabmenus">Logout</p></Nav.Link>
                <Nav.Link href="/contact"><p className="tabmenus">Contact</p></Nav.Link>
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

import React, { Component } from 'react';
import "../styles.css";
import "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar} from "react-bootstrap";
class Header extends Component{
    logout(){
        localStorage.removeItem("token");
    }
    render(){
        return(
            <div>
                <Navbar bg="white" expand="lg">
                    <img src={require("../images/Harvest Logo.png")} className="logoHome" alt="Logo"></img>       
                </Navbar> 
                <div >
                   <div className="allmenu" >
                     <a className="menu" href="/home">Home</a>
                    <a href="/cart" className="logout" >My Cart</a>
                    <a href="/"  className="logout" >Logout</a>
                    <a href="/contact" className="logout" >Contact</a>
                    </div> 
                </div>
                <div style={{height:10,width:'100%',backgroundColor:'#dbdbdb',position:'absolute',left:0,right:0}}>
                </div>
            </div>
        )
    }
}
export default Header;
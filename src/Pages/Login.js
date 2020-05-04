import React, { Component } from 'react';
import "../styles.css";
import "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Spinner,Container} from "react-bootstrap"
import Background from '../images/markus-winkler-HeqXGxnsnX4-unsplash.jpg';
const GLOBAL = require('../global');

class Login extends Component{
    
    state={
        secretKey:"",
        secretKeyError:"",
        isLoading:''
    }

    onChange(e){
        this.setState({
          [e.target.name]: e.target.value,
          secretKeyError: ''
        },()=>{
            this.validate();
        });
    };
    
    validate = () => {
        let isError = false;
        if(this.state.secretKey.length === 0) {
            isError = true;
            this.setState({
                secretKeyError:"SecretKey cannot be empty"
            });
        }
        else{
            this.setState({secretKeyError:''})
        } 
        return isError;
    };
      
    componentDidMount(){
        localStorage.removeItem("token")
    }

    handleLogin(e){
        
        const checkValidity=this.validate();

        if (!checkValidity) {
            this.setState({isLoading:true});
            fetch(GLOBAL.BASE_URL+"auth/login/",{
                method:"POST",
                body:JSON.stringify({secretKey:this.state.secretKey}),
            })
            .then(res => res.json())
            .then(
              (result) => {
                if (result.message === "SuccessCustomer") {    
                    this.setState({isLoading:false})
                    JSON.stringify(localStorage.setItem("token",result.token));
                    this.props.history.push("/home")
                }
                else if (result.message === "SuccessAdmin") {  
                    this.setState({isLoading:false})  
                    JSON.stringify(localStorage.setItem("token",result.token));
                    this.props.history.push("/admin")
                }     
                else {
                    this.setState({
                        isLoading: false,
                        secretKeyError: 'Invalid Email or secretKey'
                    });
                }
            });
        }
    }

    render() {
   
      return(
        <Container className="bootstrapcontainer"> 
            <div className="mainpage">
                <img src={require("../images/Harvest Logo.png")} class="logo" alt="Logo"></img>       
                <p className="quote">Harvest App is a web application .....</p>
            </div>       
            <div className="logocontainer">
            <div style={{paddingBottom:20}}>
                <input 
                    type="password" 
                    autoFocus={true} 
                    name="secretKey" 
                    onChange={e => this.onChange(e)} 
                    value={this.state.secretKey} 
                    placeholder="Your secretKey *" />
                <div style={{color:"red"}}>{this.state.secretKeyError}</div>
            </div>
            { this.state.isLoading ? 
                <div style={{paddingTop:10}}>
                    <Spinner animation="border" variant="success" />
                </div>:
                <button 
                    type="button" 
                    className="btn btn-sm"
                    style={{backgroundColor: GLOBAL.BASE_COLORS.MEDIUM_PEACH, color: '#FFF'}} 
                    onClick={(e)=>{this.handleLogin(e)}}>
                        Login
                </button>
            } 
            </div> 
            <div className="contact">
                <p className="quote">For assistance contact/....</p>
            </div>
        </Container>
      )
  }
}

export default Login;

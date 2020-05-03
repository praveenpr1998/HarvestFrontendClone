import React, { Component } from 'react';
import "../styles.css";
import "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal,Button,Spinner } from 'react-bootstrap';
import { createBrowserHistory } from "history";
const history = createBrowserHistory();

class Popup extends Component{
    
    state={
        mobile:'',
        mobileError:'',
        name:'',
        nameError:'',
        placed:true,
        placedPopup:false,
        isLoading:false
    }
    
    onChange(e){
        this.setState({
          [e.target.name]: e.target.value
        },()=>{
        this.validate()
        });
      };

      validate = () => {
        let isError = false;
            if (this.state.mobile.length===0) {
              isError = true;
              this.setState({
                  mobileError:"Mobile cannot be empty"
              })}else{this.setState({
                  mobileError:''})}
            if (this.state.name.length===0) {
              isError = true;
              this.setState({
              nameError:"Name cannot be empty"
              })}else{this.setState({
                  nameError:''})}
          return isError;
        };

    placeorder(props){
        const checkValidity=this.validate();
        if(!checkValidity){
            this.setState({isLoading:true})
        fetch("http://localhost:1337/users/addUser",{
            method:"POST",
            body:JSON.stringify({mobile:this.state.mobile,name:this.state.name,items:JSON.parse(localStorage.getItem("itemsArray"))}),
        })
        .then(res => res.json())
        .then(
          (result) => {
              console.log(result)
            if(result.message==="OrderPlaced"){
                this.setState({isLoading:true})
                localStorage.removeItem('itemsArray');
                this.setState({placed:false})
                this.setState({placedPopup:true})
            }
            else{
                this.setState({isLoading:false})
                alert("Error placing order try again")
            }
          })
        }
    }

    moveHome(){
        history.push("/home");
        window.location.reload();
    }

    render(){
        return(
            <div className="popup">
                {(this.state.placed)?
                <Modal  {...this.props} >
                    <Modal.Header closeButton>
                        <Modal.Title style={{textAlign:"center"}}><div style={{textAlign:'center'}}>Almost Done !{(this.state.isLoading)?<Spinner animation="border" variant="success" />:null}</div>
                </Modal.Title>
                    </Modal.Header>
                <Modal.Body>Enter Your Mobile Number to complete checkout!
                    <div className="forminpop">
                    <div className="mobile">
                    <input type="text" autoFocus={true} name="name" onChange={e => this.onChange(e)}  value={this.state.name} className="form-control " placeholder="Name *" /><div style={{color:"red"}}>{this.state.nameError}</div></div>
                    <input type="text" autoFocus={true} name="mobile" onChange={e => this.onChange(e)}  value={this.state.mobile} className="form-control" placeholder="Your Mobile no. *" /><div style={{color:"red"}}>{this.state.mobileError}</div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.onHide}>Cancel</Button>
                    <Button variant="success" onClick={()=>{this.placeorder()}}>Submit</Button>
                </Modal.Footer>
                </Modal>:null}

                {(this.state.placedPopup)?<Modal {...this.props} >
                    <Modal.Header closeButton>
                        <Modal.Title style={{textAlign:"center"}}>Order Placed !</Modal.Title>
                    </Modal.Header>
                <Modal.Body>
                    <div className="orderplaced">
                        <img src="https://cdn2.iconfinder.com/data/icons/weby-flat-vol-1/512/1_Approved-check-checkbox-confirm-green-success-tick-512.png" className="tickimage" alt="order" />
                        <p style={{fontSize:20}}>Your order has been placed successfully</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={()=>{this.moveHome()}}>OK</Button>
                </Modal.Footer>
                </Modal>:null}
            </div>
        )
    }}
    export default Popup;
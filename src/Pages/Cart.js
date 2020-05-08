import React, { Component } from 'react';
import Header from "../Components/Header.jsx"
import "../styles.css";
import { Card, Button, Container,Spinner,Toast } from 'react-bootstrap';
import { AiOutlinePlusSquare } from 'react-icons/ai';
import { AiOutlineMinusSquare } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import Popup from "../Components/Popup.js";
const GLOBAL = require('../global');

class Cart extends Component{
    state={
        cartItems:[],
        modal:false,
        token:'',
        isLoading:false
    }

    componentDidMount(){
        this.setState({isLoading:true})
        this.setState({token:localStorage.getItem("token")},()=>{
            fetch(GLOBAL.BASE_URL+"products/getProducts/",{
            method:"POST",
            body:JSON.stringify({token:this.state.token}),
        })
        .then(res => res.json())
        .then(
          (result) => {
            if(result.message==="Success"){
                this.setState({isLoading:false})
                this.setState({cartItems:JSON.parse(localStorage.getItem("itemsArray"))});
            }
            else{
                this.setState({isLoading:false})
                alert(result.message);
                this.props.history.push("/")
            }
          })
        })
    }

    async increment(id){
        var oldItems = JSON.parse(await localStorage.getItem('itemsArray')) || [];
        oldItems.map((data)=>{

            if(data['product-id']===id){
                data['product-quantity']=parseInt(data['product-quantity'])+1;
                const dummy=data['product-pricePerUnit']*data['product-quantity'];
                    data['product-total']=dummy;
                }
                return null;
        })
        localStorage.removeItem('itemsArray');
        this.setState({cartItems:oldItems})
        localStorage.setItem('itemsArray', JSON.stringify(this.state.cartItems));
        this.displayCartitems();
    }

    async decrement(id){
        var oldItems = JSON.parse(await localStorage.getItem('itemsArray')) || [];
        oldItems.map((data)=>{
            if(data['product-id']===id){
                data['product-quantity']=parseInt(data['product-quantity'])-1;
                const dummy=data['product-pricePerUnit']*data['product-quantity'];
                    data['product-total']=dummy;
                }
                return null;
        })
        localStorage.removeItem('itemsArray');
        this.setState({cartItems:oldItems})
        localStorage.setItem('itemsArray', JSON.stringify(this.state.cartItems));
        this.displayCartitems();
    }

    async remove(id){
        var oldItems = JSON.parse(await localStorage.getItem('itemsArray')) || [];
        oldItems.map((data)=>{
            if(data['product-id']===id){
                oldItems.splice(oldItems.indexOf(data),1);
                }
                return null;
        })
        this.setState({cartItems:oldItems})
        localStorage.setItem('itemsArray', JSON.stringify(this.state.cartItems));
        this.displayCartitems();
    }

    displayCartitems(){
        var TotalItems=0;
        var TotalPrice=0;

        return(
        (this.state.cartItems===null)?(<img className="noitemimage" src={require("../Resources/Images/IMG-20200502-WA0028.jpg")} alt="NO items" />):
           (this.state.cartItems.length!==0)?
            <div>
            <p className="mycart">My Cart</p>
            {this.state.cartItems.map((data)=>{
                TotalItems=TotalItems+1;
                TotalPrice=parseInt(data['product-total'])+TotalPrice;
                return(
                    <div className="cartcards" key={data['product-id']}>
                    <div key={data['product-id']}>
                        <Card style={{paddingTop:'15px', paddingBottom:'15px', borderRadius:'15px', marginLeft: '20px', marginRight: '20px'}}>
                            <div className="row">
                                <img src={data['product-image']} className="cartimage" alt="products" />
                                <p className="productname">{data['product-name']}</p>
                                {(data['product-price']==="others")?<p className="productperunit">Price : ₹ {data['product-pricePerUnit']} / {data['product-priceOthers']}</p>
                                    :<p className="productperunit">Price : ₹ {data['product-pricePerUnit']} / {data['product-price']}</p>}
                                <p className="productquantity">Quantity</p>
                                <div className="quant">
                                    <AiOutlinePlusSquare size="23" color="green" onClick={()=>{this.increment(data['product-id'])}}/> {data['product-quantity']} <AiOutlineMinusSquare size="23" color="green"  onClick={()=>{(data['product-quantity']>1)?(this.decrement(data['product-id'])):this.remove(data['product-id'])}}/></div>
                            </div>
                            <MdDelete size="23" className="delete" onClick={()=>{this.remove(data['product-id'])}} color="red"/>
                            <p className="producttotal">Price : ₹ {data['product-total']}</p>
                        </Card>
                    </div>
                </div>
                )
            })}
            <div className="summarybox">
            <p className="mycart">Summary</p>
            <p className="total">TotalItems : {TotalItems}</p>
            <p className="total">TotalPrice : ₹ {TotalPrice}</p>
            <div className="checkout">
                <Button className="btn btn-success" onClick={()=>{this.setState({modal:true})}}>Checkout</Button>
            </div>
            </div>
            </div>
            :<img className="noitemimage" src={require("../Resources/Images/IMG-20200502-WA0028.jpg")} alt="NO items" />

        )
    }

    render(){
        return(
            <Container  className="bootstrapcontainer" >
                <Popup  show={this.state.modal} onHide={() => { this.setState({ modal: false})}} />
                <Header />
                {(this.state.isLoading)?<div style={{paddingTop:20,textAlign:'center'}}><Spinner animation="border" variant="success" /></div>:null}
                    {this.displayCartitems()}
            </Container>
        )
    }
}
export default Cart;

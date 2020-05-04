import React, { Component } from 'react';
import Header from "../Components/Header.jsx"
import "../styles.css";
import {Card,Button,Spinner,Container,Toast} from "react-bootstrap"
const GLOBAL = require('../global');

class Home extends Component{
    state={
        token:"",
        allProducts:[],
        isLoading:'',
        Toastshow:false
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
                this.setState({allProducts:result.data})
            }
            else{
                this.setState({isLoading:false})
                alert(result.message);
                this.props.history.push("/")
            }
          })
        });
    }

    async addItem(id){
         var oldItems = JSON.parse(await localStorage.getItem('itemsArray')) || [];
         var found=false;
        if(oldItems.length!==0){
            oldItems.map((data)=>{
                if(data['product-id']===id){
                    data['product-quantity']=parseInt(data['product-quantity'])+1;
                    const dummy=data['product-pricePerUnit']*data['product-quantity'];
                    data['product-total']=dummy;
                    oldItems.splice(oldItems.indexOf(data),1);
                    oldItems.push(data);
                    localStorage.setItem('itemsArray', JSON.stringify(oldItems));
                    found=true;
                }
                return null;
            })
        }
        if(!found){
            var newItem = {
            'product-name': '',
            'product-price': '',
            'product-pricePerUnit':'',
            'product-quantity':'',
            'product-image':'',
            'product-id':'',
            'product-total':''
        };
        fetch(GLOBAL.BASE_URL+"products/uniqueProduct/",{
            method:"POST",
            body:JSON.stringify({token:this.state.token,productId:id}),
        })
        .then(res => res.json())
        .then(
          (result) => { 
            if(result.message==="Success"){
               newItem["product-name"]=result.data.name;
               newItem["product-price"]=result.data.price;
               newItem["product-pricePerUnit"]=result.data.pricePerUnit;
               newItem["product-quantity"]="1";
               newItem["product-id"]=result.data.id;
               newItem["product-category"]=result.data.category;
               newItem['product-total']=result.data.pricePerUnit;
               oldItems.push(newItem);
               localStorage.setItem('itemsArray', JSON.stringify(oldItems));
            }
          })
        } 
    }

    dispayCards(){
        return(
            <div className="row maincarddiv" >
            {this.state.allProducts.map((data)=>{
                return (
                <div className="carddiv col-xs-12"  key={data.id}>
                <Card className="cardalign">
                    <Card.Body>
                    <img style={{width:100,height:80}} src="https://image.shutterstock.com/image-photo/red-apple-on-white-background-260nw-158989157.jpg" alt="productsimage" />
                    <Card.Title><p className="homecardprodname">{data.name}</p></Card.Title>
                       <p className="homecardperunit">Price : ₹ {data.pricePerUnit}/ {data.price}</p>
                    <Button variant="success addbutton" onClick={()=>{this.addItem(data.id);this.setState({Toastshow:true});setTimeout(()=>{this.setState({Toastshow:false})},500)}}>Add</Button>
                    </Card.Body>
                </Card>
                </div>)
                 })
                }
            </div>)
    } 

    render(){
        
        return(
            <Container className="bootstrapcontainer" >
                
            <Header />
            <Toast onClose={() => this.setState({Toastshow:false})} show={this.state.Toastshow} className="toast">
      <Toast.Body>Item Added</Toast.Body>
    </Toast> 
                {(this.state.isLoading)?<div  style={{paddingTop:20,textAlign:'center'}}><Spinner animation="border" variant="success" /></div>:null}
                {this.dispayCards()}
            </Container>  
        )
    }
}
export default Home;

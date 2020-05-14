import React, { Component } from 'react';
import Header from "../Components/Header.jsx"
import "../styles.css";
import {Card,Button,Spinner,Container} from "react-bootstrap";
import { AiOutlinePlusSquare } from 'react-icons/ai';
import { AiOutlineMinusSquare } from 'react-icons/ai';
const GLOBAL = require('../global');

class Home extends Component{
    state={
        token:"",
        allProducts:[],
        isLoading:'',
        addClicked:[],
        quantity:[]
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
           async (result) => { 
            if(result.message==="Success"){
                this.setState({isLoading:false})
                this.setState({allProducts:result.data});
                var oldItems = JSON.parse(await localStorage.getItem('itemsArray')) || [];
                if(oldItems.length!==0){
                    var clickedItems=[];
                    var quantityItems=[];
                    oldItems.map((data)=>{
                        quantityItems[data['product-id']]=data['product-quantity'];
                        clickedItems[data['product-id']]='true';
                    })
                    this.setState({addClicked:clickedItems});
                    this.setState({quantity:quantityItems});
                }
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
            var newItem = {
            'product-name': '',
            'product-price': '',
            'product-pricePerUnit':'',
            'product-priceOthers':'',
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
               newItem['product-priceOthers']=result.data.priceOthers;
               newItem["product-pricePerUnit"]=result.data.pricePerUnit;
               newItem["product-quantity"]="1";
               newItem["product-id"]=result.data.id;
               newItem["product-image"]=result.data.image;
               newItem["product-category"]=result.data.category;
               newItem['product-total']=result.data.pricePerUnit;
               oldItems.push(newItem);
               localStorage.setItem('itemsArray', JSON.stringify(oldItems));
            }
          })
          var clickedItems=[];
          var quantityItems=[];
          clickedItems=this.state.addClicked;
          quantityItems=this.state.quantity;
          clickedItems[id]='true';
          quantityItems[id]='1';
          this.setState({addClicked:clickedItems,quantity:quantityItems});
    }

    async increment(id){
        var oldItems = JSON.parse(await localStorage.getItem('itemsArray')) || [];
        oldItems.map((data)=>{

            if(data['product-id']===id){
                data['product-quantity']=parseInt(data['product-quantity'])+1;
              var quantityItems=this.state.quantity;
                quantityItems[data['product-id']]=data['product-quantity'];
                this.setState({quantity:quantityItems});
                const dummy=data['product-pricePerUnit']*data['product-quantity'];
                    data['product-total']=dummy;
                }
                return null;
        })
        localStorage.removeItem('itemsArray');
        localStorage.setItem('itemsArray', JSON.stringify(oldItems));
        this.dispayCards();
    }

    async decrement(id){
        var oldItems = JSON.parse(await localStorage.getItem('itemsArray')) || [];
        oldItems.map((data)=>{
            if(data['product-id']===id){
                data['product-quantity']=parseInt(data['product-quantity'])-1;
                var quantityItems=this.state.quantity;
                quantityItems[data['product-id']]=data['product-quantity'];
                this.setState({quantity:quantityItems});
                const dummy=data['product-pricePerUnit']*data['product-quantity'];
                    data['product-total']=dummy;
                }
                return null;
        })
        localStorage.removeItem('itemsArray');
        localStorage.setItem('itemsArray', JSON.stringify(oldItems));
        this.dispayCards();
    }
    
    async remove(id){
        var oldItems = JSON.parse(await localStorage.getItem('itemsArray')) || [];
        oldItems.map((data)=>{
            if(data['product-id']===id){
                oldItems.splice(oldItems.indexOf(data),1);
                var clickedItems=this.state.addClicked;
                clickedItems[data['product-id']]='false';
                this.setState({addClicked:clickedItems});
                }
                return null;
        })
        localStorage.removeItem('itemsArray');
        localStorage.setItem('itemsArray', JSON.stringify(oldItems));
        this.dispayCards();
    }

     dispayCards(){
        return(
            <div className="row maincarddiv">
                {this.state.allProducts.map((data)=>{
                    return (
                        <div className="carddiv col-xs-12"  key={data.id}>
                            <Card className="cardalign" style={{borderRadius:'18px'}}>
                                <Card.Body>
                                    <img style={{width:100, height:80, paddingBottom: '10px'}} src={data.image} alt="product-image" />
                                    <Card.Title>
                                    {data.name.length<23?<p className="homecardprodname">{data.name}{(data.description!=='')?<p style={{color:'black'}} className="homecardproddescription">({data.description})</p>:null}</p>:<p className="homecardprodname2">{data.name}{(data.description!=='')?<p style={{color:'black'}} className="homecardproddescription">({data.description})</p>:null}</p>}</Card.Title>
                                     {(data.price==="others")?<p className="homecardperunit2">Price : ₹ {data.pricePerUnit} / {data.priceOthers}</p>
                                    :<p className="homecardperunit">Price : ₹ {data.pricePerUnit} / {data.price}</p>}
                                    {(this.state.addClicked[data.id]==='true')?
                                      <div className="homequant">
                                      <AiOutlinePlusSquare size="23" color="green" onClick={()=>{this.increment(data.id)}}/> {this.state.quantity[data.id]} <AiOutlineMinusSquare size="23" color="green"  onClick={()=>{this.state.quantity[data.id]>'1'?(this.decrement(data.id)):this.remove(data.id)}}/>
                                      </div>:
                                    (data.availability==="in-stock")?
                                        <Button value={data.id} variant="success addbutton" onClick={()=>{this.addItem(data.id);this.setState({Toastshow:true});setTimeout(()=>{this.setState({Toastshow:false})},500)}}>Add</Button>:
                                        <p className="outofstock" style={{color:'red',fontFamily:'roboto'}}>Out-Of-Stock</p>   
                                    }
                                </Card.Body>
                            </Card>
                        </div>
                    )
                })}
            </div>
        )
    } 

    render(){
        return(
            <Container className="bootstrapcontainer" >  
            <Header />
                {(this.state.isLoading)?<div  style={{paddingTop:20,textAlign:'center'}}><Spinner animation="border" variant="success" /></div>:null}
                {this.dispayCards()}
            </Container>  
        )
    }
}
export default Home;

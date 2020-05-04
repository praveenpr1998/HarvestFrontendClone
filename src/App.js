import React from 'react';
import {BrowserRouter as Router,Route,Switch} from "react-router-dom";
import Login from "./Pages/Login.js";
import Home from "./Pages/Home.js";
import Cart from "./Pages/Cart.js";
import RecentOrders from "./Pages/RecentOrders";
import AllOrders from "./Pages/AllOrders";
import ManageProducts from "./Pages/ManageProducts";

function App() {
  return (
    <div>
    <Router>
    <Switch>
    <Route exact path="/" component={Login}/>
    <Route exact path="/home" component={Home}/>
    <Route exact path="/cart" component={Cart}/>
    <Route exact path="/recentOrders" component={RecentOrders}/>
    <Route exact path="/allOrders" component={AllOrders}/>
    <Route exact path="/manageProducts" component={ManageProducts}/>
    <Route render={
      ()=>
        <div><h>404 Not Found </h></div>
    } />
    </Switch>
    </Router>
    </div>
  );
}

export default App;

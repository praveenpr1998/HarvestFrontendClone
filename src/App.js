import React from 'react';
import {BrowserRouter as Router,Route,Switch} from "react-router-dom";
import Login from "./Pages/Login.js";
import Home from "./Pages/Home.js";
import Cart from "./Pages/Cart.js";
import Admin from "./Pages/Admin.js";
import Contact from "./Pages/Contact.js";

function App() {
  return (
    <div>
    <Router>
    <Switch>
    <Route exact path="/" component={Login}/>
    <Route exact path="/home" component={Home}/>
    <Route exact path="/cart" component={Cart}/>
    <Route exact path="/admin" component={Admin}/>
    <Route exact path="/contact" component={Contact}/>
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

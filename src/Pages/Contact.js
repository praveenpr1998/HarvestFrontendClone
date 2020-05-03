import React, { Component } from 'react';
import Header from "../Components/Header.jsx"
import {Container } from 'react-bootstrap';
class Contact extends Component{
    render(){
        return(
          <Container>
                <Header />
               <div className="us">
                 <p>Contact Us:
                    Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram anteposuerit litterarum formas human.
                 </p>
                <p>Address : No 40 Baria Sreet 133/2 NewYork City</p>
                <p>info@yourdomain.com</p>
                <p>+88013245657</p>
                </div>
        </Container>
        )
    }
}
export default Contact;
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import cookie from 'react-cookies';
import Login from '../Components/LogIn/LogIn';
//create the Navbar Component
class Navbar extends Component {
    constructor(props) {
        super(props);
        const cookies = new Cookies();
        this.state = {
            userType : !!(cookies.get("user_type")) ?  cookies.get("user_type") : ''
        }
    }

    componentDidMount() {
        this.setState({})
    }

    //handle logout to destroy the cookie
     handleLogout = () => {
        cookie.remove('cookie', { path: '/' });
        new Cookies().remove("user_type");
     }
    render() {
        // //if Cookie is set render Logout Button
         let navLogin = null,navLoginLanding=null;
         let navbar;
         if(new Cookies().get("user_type")){
             navLogin = (
                 <ul class="nav navbar-nav navbar-right">
                         <li><Link to="/" onClick = {this.handleLogout}><span class="glyphicon glyphicon-user"></span>Logout</Link></li>
                 </ul>
             );
         }else {
             navLoginLanding = (
                 <Login history={this.props.history}></Login>
             )
         } 
        console.log("Nav userType is"+this.state.userType+"and " +new Cookies().get("user_type"));
        if(parseInt(new Cookies().get("user_type")) === 1) {
            navbar=    <ul class="nav navbar-nav">
            <li ><Link class="active" to="/jobs">Jobs</Link></li>
            <li><Link to="/student/appliedjobs">Applications</Link></li>
            <li><Link to="/student/events"> Events</Link></li>
            <li><Link to="/student/registeredEvents">Registered Events</Link></li>
            <li><Link to='/student/allStudents'>Students</Link></li>
            <li><Link to='/student/studentprofile'>Student Profile</Link></li>
            </ul>
        } else if(parseInt(new Cookies().get("user_type")) === 2) {
            navbar=   <ul class="nav navbar-nav">
            <li ><Link to="/company/jobposting">Post A Job</Link></li>
            <li><Link to="/company/eventposting">Post an event</Link></li>
            <li ><Link to="/company/joblisting">Job Listing</Link></li>
            <li ><Link to="/company/eventlisting">Event Listing</Link></li>
            <li><Link to="/company/allStudents"> Students</Link></li>
            <li><Link to='/company'>Company Profile</Link></li>
            </ul>
        } else {
            navbar=   <div></div>
        }
        return (
            <div>

                <nav class="navbar navbar-inverse">
                    <div class="container-fluid" style={{background :'#073b1c'}}>
                        <div class="navbar-header" style={{float : "left"}}>
                            <a href="/"   aria-label="Homepage">
                                <svg xmlns="http://www.w3.org/2000/svg" id="logo-icon" viewBox="0 0 80.1 96.1" class="style__logo-icon___1eROG" width="32" height="32"><title>Handshake</title><path class="style__logo-icon-content___1-wtb" d="M76.6 42.9c-1.6-.6-9.2-2.4-19 .1-24.6 6.3-29.1-6.6-39.5-9.6-2.4-.7-12.2-1.5-15.9.4-1.3.7-2.2 2.3-2.2 3.8 0 6.7-.1 36.8-.1 51 0 4.1 3.3 7.4 7.4 7.4h15.4c4 0 7.3-3.3 7.4-7.3.1-12.4.3-33.7.3-36.1 0-.9.5-1.1 1.6-1.4 9.8-2.5 17.4 3 17.6 10.7.2 8.5.4  18.3.4 26.8 0 4 3.3 7.3 7.3 7.3 4.6 0 10.4.1 15.3.1 4 0 7.3-3.3 7.3-7.3 0-13.7.1-33.3.1-41.4 0-2.4-1.4-3.7-3.4-4.5zM66.5 36.8c7.5 0 13.6-6.1 13.6-13.6S74 9.6 66.5 9.6s-13.6 6.1-13.6 13.6c0 7.6 6.1 13.6 13.6 13.6zM14.3 28.6c7.9 0 14.3-6.4 14.3-14.3S22.2 0 14.3 0 0 6.4 0 14.3s6.4 14.3 14.3 14.3z"></path></svg></a>
                           <span style={{color : 'white'}}>Handshake </span> 
                        </div>
                        <div style={{float : "right"}}>
                         {navbar}
                        </div>
                        {navLogin}
                    </div>
                </nav>
                {navLoginLanding}
            </div>
        )
    }
}

export default Navbar;
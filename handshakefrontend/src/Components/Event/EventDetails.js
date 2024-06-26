
import React, { Component } from 'react';
import '../../App.css';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';
import backendconfig from '../../backendConfig';
import Cookies from 'universal-cookie';

//Define a StudentProfile Component
class EventDetails extends Component {
   
    constructor(props) {
    super(props);
    this.state = {
            errorMsg : "" ,
            selectedFile: null,
            moreDetaileFlag: false,
            authFlag: false, 
        }
        this.onClick = this.onClick.bind(this);
        this.registerForEvent = this.registerForEvent.bind(this);
    }

   onClick = (e) =>{

    this.setState(prevState => ({
        moreDetaileFlag: !prevState.moreDetaileFlag
      }));
   }

  
  
   registerForEvent = (e) =>{

    console.log("Inside event" + this.props.details.id + this.state.userId + this.props.details.eligibility);
    
    e.preventDefault();

    const data = {
        eid : this.props.details.id,
        userId : new Cookies().get("student_user_id"),
        eligibility : this.props.details.eligibility
    } 

    axios.post(backendconfig+'/event/rsvpevent',data)
    .then(response => {
        if(response.status === 200 && (response.data.msg.includes("Successful"))) {
            this.setState({
                authFlag : true,
                status : 1
            })
        } else {
            this.setState({
                errorMsg : response.data.msg,
                authFlag : false
            })
        }
    })
   }
    
   render() {
         let displayField , userSpecificDisplay, redirectVar;
         let msg;
         if(this.state.authFlag){
            redirectVar =<Redirect to='/student/registeredEvents'></Redirect>
         }
         if(this.state.errorMsg !== '') {
            msg = <div class="alert alert-danger" role="alert">{this.state.errorMsg}</div>; 
         }
          
         console.log("More detail flag :", this.props.details.status + typeof this.props.details.status);
         if(parseInt(this.props.userType) === 2) {
            userSpecificDisplay = 
              <div>
                    <Link to={{
                    pathname : '/studentListCommon',
                    state : {
                        id : this.props.details.id,
                        type : 2             //For Job type= 1 ,Event Type=2
                    }
                }}>  See All the Student Applied for this Event </Link>
            </div>;
         } else if(parseInt(this.props.userType) === 1 && parseInt(this.props.details.status) !== 1){
            userSpecificDisplay = 
            <div>
                <button type="button" class="btn btn-primary"  name="register" id="register" onClick={this.registerForEvent}>+RSVP EVENT</button>
            </div>;
         }

        if(this.state.moreDetaileFlag) {
            displayField = <div>
                <div>
                 Eligibility Criteria : <span> {this.props.details.eligibility}</span>         
                 </div>
                 <div>
                 <div class="h4">  <u> Event Description</u></div>   
                <span> {this.props.details.e_desc}</span>     
                </div>      
                <a onClick={this.onClick}> Hide Details</a>
            </div>;
        } else {
            displayField = 
            <div>
             <a onClick={this.onClick}> View Details</a>
             </div>;
        }

        return (
            <div class="container" style={{border:"1px solid white",boxShadow: '5px 5px 10px rgba(0,0,0,0.5)'}}>
                {redirectVar}
                <li>
             <div class="h4">
              <span> {this.props.details.e_name}</span>
             </div>
             <div>
             <svg style={{height :12}} aria-hidden="true" data-prefix="fas" data-icon="calendar" class="svg-inline--fa fa-calendar fa-w-14 fa-fw style__icon___1lUgT icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12zm436-44v-36c0-26.5-21.5-48-48-48h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v36c0 6.6 5.4 12 12 12h424c6.6 0 12-5.4 12-12z"></path></svg>
             
             <span>{this.props.details.date.substring(0,10)} : {this.props.details.time}</span>
             </div>
             <div>
             <svg style={{height :12}} aria-hidden="true" data-prefix="fas" data-icon="map-marker-alt" class="svg-inline--fa fa-map-marker-alt fa-w-12 fa-fw style__icon___1lUgT icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path></svg>
              <span>{this.props.details.location}</span>
            </div>
                {displayField}
             <div>
               {userSpecificDisplay}
             </div>
             {msg}
             </li>
             
            </div>
           )
    }
}



export default EventDetails;

import React, { Component } from 'react';
import '../../App.css';
import backendconfig from '../../backendConfig';
import axios from 'axios';
import Cookies from 'universal-cookie';
import EventDetails from './EventDetails'
//Define a StudentProfile Component
class EventsRegisteredByStudents extends Component {
   
    constructor(props) {
        super(props);
        this.state = {
            id : "",
            userId : new Cookies().get("student_user_id"),
            userType : new Cookies().get("user_type"),
            registeredEvents:[],
            errorMsg: "",
            authFlag: false,
        }
    }

  
     //get the books data from backend  
    componentDidMount(){
      
        console.log("About to call registered event");
      axios.get(backendconfig+'/event/getRegisteredEvents',{
        params: {
            user_id: this.state.userId
        }
      })
      .then(respose => {
        console.log("Event data is" , respose.data);
        this.setState({
            registeredEvents : respose.data
        })
      });
    }

    componentWillMount() {
        this.setState({
            authFlag: false
        })
    }
    render() {
        let displayField;
        displayField = 
        <div>
            {
                this.state.registeredEvents.map( item => {
                    return <div><EventDetails details={item} userId={this.state.userId} userType={this.state.userType} ></EventDetails><br/><br/></div>
                 })
            }
        </div>;
        
        return (
            <div class="container">
                <div class="h1"> Registered Events </div>
                <br/><br/>
                {displayField}
            </div>
        )
    }
}

export default EventsRegisteredByStudents;

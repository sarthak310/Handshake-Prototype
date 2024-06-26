import React, { Component } from 'react';
import '../../App.css';
import backendconfig from '../../backendConfig';
import axios from 'axios';
import Cookies from 'universal-cookie';
import EventDetails from './EventDetails'
//Define a StudentProfile Component
class Events extends Component {
   
    constructor(props) {
        super(props);
        this.state = {
            id : "",
            userId : new Cookies().get("student_user_id"),
            userType : new Cookies().get("user_type"),
            allevents:[],
            filteredResult : [],
            errorMsg: "",
            authFlag: false,
        }
        this.inputChangeHandler = this.inputChangeHandler.bind(this)
    }

  
    inputChangeHandler = (e) => {
        let result ;

        result = this.state.allevents.filter((event) => {
            return event.e_name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1;
        });
        console.log("Result is", result);
        this.setState({
            filteredResult : result
        });
       
    }

     //get the books data from backend  
    componentDidMount(){
      axios.get(backendconfig+'/event/getAllEvents')
      .then(respose => {
        console.log("Event data is" , respose.data);
        this.setState({
            allevents : respose.data,
            filteredResult : respose.data
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
        console.log("Result is", this.state.filteredResult);
        console.log("Result is", this.state.allevents);
        displayField = 
        <div>
            {
                this.state.filteredResult.map( item => {
                    return <div><EventDetails details={item} userId={this.state.userId} userType={this.state.userType}></EventDetails><br/><br/></div>
                 })
            }
        </div>;
        
        return (
            <div class="container">
                <div class="h1"> All Events</div>
                <br/><br/>
                <input type="text" class="form-control" name="search" id="search" placeholder="Search Event Name" onChange={this.inputChangeHandler}/>
                <br/><br/>
                {displayField}
            </div>
        )
    }
}

export default Events;

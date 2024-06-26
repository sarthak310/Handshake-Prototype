import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import backendconfig from '../../backendConfig';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router';

class EventPosting extends Component {
   
    constructor(props) {
        super(props);
        this.state = {
          //  id: new Cookies().get("company_user_id"),
            name : "",
            desc:"",
            etime : "",
            edate: "" ,
            loc : "",
            eli : "All",
            errorMsg: "",
            authFlag: false,
        }
        this.createNewEvent = this.createNewEvent.bind(this);
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
    }   

    inputChangeHandler = (event) => {
        const target = event.target;
        const value =  target.value;
        const name = target.name;
        this.setState({
          [name]: value
        });
        console.log(name+" "+value);
    }


    //get the books data from backend  
    componentDidMount(){
       
    }

    componentWillMount() {
        this.setState({
            authFlag: false
        })
    }

    createNewEvent = (e) => {
        console.log("Inside create Event");

        e.preventDefault();
        const data = {
            name : this.state.name,
            desc: this.state.desc,
            etime : this.state.etime,
            edate : this.state.edate,
            loc : this.state.loc,
            eligibility : this.state.eli,
            userId : new Cookies().get("company_user_id")
        }

        axios.post(backendconfig+'/event/createNewEvent',data)
        .then(response => {
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                this.setState({
                    authFlag : true
                })
            }else{
                console.log(response.data.msg);
                this.setState({
                    errorMsg : response.data,
                    authFlag : false
                })
            }
        });
    }

    render() {
        let redirectVar = null;

        if(this.state.authFlag) {
            redirectVar = <Redirect to='/company/eventlisting'></Redirect>
        }
                         
        return (
            <div class="container">
                
                <h2> Post Event</h2>
                {redirectVar}
                <form onSubmit={this.createNewEvent}>
                <div class="form-group">
                    <label> Event Name </label>
                    <input type="text" name="name" id="name" class="form-control" onChange={this.inputChangeHandler} required/>
                </div>
                
                <div class="form-group">
                    <label>Eligibility</label>
                    <select name="eli" value={this.state.eli} onChange={this.inputChangeHandler} > 
                    <option value="All">All</option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Arts and Design">Arts and Design</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    </select>
                </div>
                <div class="form-group">
                    <label> Event Description </label>
                    <textarea name="desc" id="desc" maxLength="1000" class="form-control"  onChange={this.inputChangeHandler} required/>
                </div>
                <div class="form-group">
                    <label> Date </label>
                    <input type="date" name="edate" id="edate" class="form-control" onChange={this.inputChangeHandler} required/>
                </div>
                <div class="form-group">
                    <label> Time </label>
                    <input type="time" name="etime" id="etime" class="form-control" onChange={this.inputChangeHandler} required/>
                </div>
                <div class="form-group">
                    <label> locaton </label>
                    <input type="text" name="loc" id="loc" class="form-control" onChange={this.inputChangeHandler} required/>
                </div>
                <div class="form-group">
                  
                    <input type="submit"  class="btn btn-info" value="Post Event"/>
                </div>
                </form>
            </div>
        )
    }
}

export default EventPosting;

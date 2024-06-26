import React, { Component } from 'react';
import '../../App.css';
import backendconfig from '../../backendConfig';
import axios from 'axios';
import Cookies from 'universal-cookie';

//Define a StudentProfile Component
class AppliedJobsByStudent extends Component {
   
    constructor(props) {
        super(props);
        this.state = {
            id : "",
            userId : new Cookies().get("student_user_id"),
            appliedJobs:[],
            filteredResult : [],
            errorMsg: "",
            authFlag: false,
        }
        this.inputChangeHandler = this.inputChangeHandler.bind(this)
    }

  
    inputChangeHandler = (e) => {
        let result ;
       
        if(e.target.value === '0'){
            result = this.state.appliedJobs;
        } else {
            result = this.state.appliedJobs.filter((jobItem) => {
                return parseInt(jobItem.job_status) === parseInt(e.target.value);
            });
        }
       
       
        this.setState({
            filteredResult : result
        });       
    }

    getStatus(status){
        if(parseInt(status) === 1) {
            return "Pending";
        } else if(parseInt(status) === 2) {
            return "Reviewd";
        } else if(parseInt(status) === 3) {
            return "Accepted";
        } else if(parseInt(status) === 4){
            return "Rejected";
        } 
        return "";
    }
     //get the books data from backend  
    componentDidMount(){
      
       const data = {
        user_id : this.state.userId
       } 
        
      axios.post(backendconfig+'/job/getAppliedJobs',data)
      .then(respose => {
        console.log("Applied Job data is" , respose.data);
        this.setState({
            appliedJobs : respose.data,
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
        let individualDisplay;
        displayField = 
        <div>
            <ul>
            {   
                this.state.filteredResult.map( item => {
                    individualDisplay = <div><li style={{border:"1px solid white",boxShadow: '5px 5px 10px rgba(0,0,0,0.5)'}}><br/>
                        <div class="row">
                         <div class="col-sm-2">
                         <img src={!!(item.c_profile) ? backendconfig+'/uploads/'+item.c_profile.trim() :backendconfig+'/uploads/noprofile.jpg'} alt="Profile Not uploaded" style={{borderRadius :25 ,border :"1px solid black" ,height:145, width :140}}></img>
                        </div>   
                        <div class="col-sm-7" style={{backgroundColor : 'whitesmoke'}} >
                        <div class="h3">
                            {item.job_title} - {item.job_category}
                        </div>
                        <div class="h4">
                            {item.c_name}
                        </div>
                        <div class="h5">
                        <svg style={{height:12}} aria-hidden="true" data-prefix="fas" data-icon="info" class="svg-inline--fa fa-info fa-w-6 fa-fw style__icon___1lUgT icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path fill="currentColor" d="M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z"></path></svg>
                            {this.getStatus(item.job_status)}
                        </div>
                        <div>
                        <svg style={{height:12}} aria-hidden="true" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16 fa-fw style__icon___1lUgT icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>    
                        Applied On {item.applied_date.substring(0,10)} 
                        </div>
                        <div>
                        Application Closes on {item.deadline.substring(0,10)}
                        </div>
                        </div>
                    </div></li><br/><br/></div>;
                    return individualDisplay; 
                 })
            }
            </ul>
        </div>;
        
        return (
            <div class="container">
                <div class="h1"> Jobs Applied </div>
                <br/><br/>
                <select name="status" class="form-control" value={this.state.status} onChange={this.inputChangeHandler}>
                    <option value="0">All</option>
                    <option value="1">Pending</option>
                    <option value="2">Reviewed</option>
                    <option value="3">Accepted</option>
                    <option value="4">Declined</option>
                </select>
                <br/><br/>

                {displayField}
            </div>
        )
    }
}

export default AppliedJobsByStudent;

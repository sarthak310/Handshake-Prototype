import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import WorkExperience from './WorkExperience';
import Cookies from 'universal-cookie';
import backendconfig from '../../backendConfig';

//Define a StudentProfile Component
class WorkExperienceDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            workList: [],
            user_id : this.props.id,
            user_type : new Cookies().get("user_type"),
            companyName : "",
            title:"" ,
            start_date : "",
            end_date : "",
            studentId : this.props.id,
            desc : "",
            loc : "",
            editFlag: false,
            authFlag: false,
        }
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
         this.submitWorkExpDetails = this.submitWorkExpDetails.bind(this);
    }


    //username change handler to update state variable with the text entered by the user
    inputChangeHandler = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }


    onClickHandler = (e) => {
        if (this.state.editFlag === true) {

            this.setState({
                editFlag: false
            })
            console.log("inside true" + this.state.editFlag);
        } else {

            this.setState({
                editFlag: true
            })
            console.log("inside false" + this.state.editFlag);
        }

    }


    submitWorkExpDetails = (e) => {
        e.preventDefault();

        
        const data = {
            user_type: 1,
            user_id: this.state.user_id,
            companyName: this.state.companyName,
            title: this.state.title,
            loc : this.state.loc,
            start_date : this.state.start_date,
            end_date: this.state.end_date,
            desc: this.state.desc, 
        }

        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(backendconfig+'/submitWorkExpDetails', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    this.setState({
                        authFlag: true
                    })
                } else {
                    console.log(response.data.msg);
                    this.setState({
                        errorMsg: response.data,
                        authFlag: false
                    })
                }
            }).catch(error=>{
                this.setstate({
                    errorMsg : error.msg
                })
            });

            this.onClickHandler();

    }

    //get the books data from backend  
    componentDidMount() {
        console.log("get WorkExperience list"+this.props.id);
        const data = {
            uid: this.props.id
        }
        axios.defaults.withCredentials = true;

        axios.post(backendconfig+'/getWorkExpDetails', data)
            .then((response) => {
                // let data =  response.data;
                console.log(response.data);
                this.setState({
                    workList: this.state.workList.concat(response.data)
                });
            });
       
    }

    componentWillMount() {
        this.setState({

            authFlag: false
        })
    }
    render() {
        console.log("For logs in render", this.state.workList);

        //redirect based on successful login
        let msg;
        let editFlag, fiedlValues , allWorkDetails ,display_according_userType;
      
        allWorkDetails =
        <div>
        {this.state.workList.map(x => {
            return <WorkExperience work={x} key={x.id} userType={this.state.user_type}></WorkExperience>
        })}
        </div>;

    if(this.state.user_type === '2') {
         display_according_userType = <div></div>;

    } else if(this.state.user_type === '1'){
         display_according_userType =   <button type="button" class="btn btn-success" value="Edit" name="editFlag" onClick={this.onClickHandler}> ADD </button>; 
    }


        if (this.state.errorMsg !== "") {
            msg = <div class="alert alert-danger" role="alert">{this.state.errorMsg}</div>;
        }
        if (!this.state.editFlag) {
            fiedlValues =
                <div>
                   
                </div>;

        } else {
            fiedlValues =
                <div>
       <form onSubmit={this.submitWorkExpDetails}>
               <button type="button" name="delete" class="btn btn-secondary" onClick={this.onClickHandler}>Cancel</button>
            <div class="row">
              
            <div class="col-sm- 8">
                 
            &nbsp;&nbsp;&nbsp;&nbsp; <label class="control-label"> Company Name </label>
                <input  style={{width:550}} type="text" class="form-control"  name="companyName" id="companyName" onChange = {this.inputChangeHandler} placeholder="company Name"  required/>
             </div>
             </div>
             <div class="row">
              
              <div class="col-sm-8">
                 <label> Title </label>
                 <input type="text" class="form-control" style={{width:550}}  name="title" id="title" onChange = {this.inputChangeHandler} placeholder=" Title"  required/>
             </div>
             </div>
             <div class="row">    
             <div class="col-sm-8 form-group">
                 <label> Location</label>
                 <input type="text" class="form-control" style={{width:550}} name="loc"  onChange = {this.inputChangeHandler} id="loc" placeholder=" Locaton"  />
             </div>
             </div>
             <div class="row form-group">      
            
            <div class="col-sm-4">
                
               <label>  Start date</label>
               <input type="date" class="form-control" style={{width:250}}  name="start_date" id="start_date" onChange = {this.inputChangeHandler} placeholder="Start Date"  />
           </div>
           
            <div class="col-sm-4">
               <label> End Date </label>
               <input type="date" class="form-control"  style={{width:250}} name="end_date"  id="end_date" onChange = {this.inputChangeHandler} placeholder="End Date"  />
           </div>
           </div> 
           <div class="row">    
             <div class="col-sm-8 form-group">
                 <label> Work Description</label>
                 <textarea  rows="4"  style={{width:550}} type="textarea" class="form-control" name="desc"  onChange = {this.inputChangeHandler} id="desc" placeholder=" Work Description"  />
             </div>
             </div>
           <div> 
             <input type="submit" class="btn btn-info" value="Save"/>
          </div>
            </form>
    
                </div>

                ;
        }

        return (
            <div class="container">
                {display_according_userType}
                <br/><br/>
                {allWorkDetails}
                {fiedlValues}
            </div>
        )
    }
}
export default WorkExperienceDetail 
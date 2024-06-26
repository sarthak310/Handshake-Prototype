import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import Education from './Eduction';
import Cookies from 'universal-cookie';
import backendconfig from '../../backendConfig';

//Define a EducationDetails Component
class EducationDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            educationList: [],
            userId : this.props.id,
            user_type : new Cookies().get("user_type"),
            collegeName : "",
            degree:"" ,
            major : "",
            yearOfPassing : "",
            cgpa :"",
            studentId : this.props.id,
            editFlag: false,
            authFlag: false,
        }
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
         this.submitEducationDetails = this.submitEducationDetails.bind(this);
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


    submitEducationDetails = (e) => {
        e.preventDefault();

        const data = {
            user_type: 1,
            user_id: this.state.userId,
            collegeName: this.state.collegeName,
            major: this.state.major,
            degree : this.state.degree,
            yearOfPassing: this.state.yearOfPassing, 
            cgpa: this.state.cgpa, 
        }
        console.log("Before submitting Education id",this.props);

        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(backendconfig+'/submitEducationDetails', data)
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
            });

            this.onClickHandler();

    }

    //get the books data from backend  
    componentDidMount() {
        console.log("get Education id",this.props.id);
        const data = {
            uid: this.props.id
        }
        axios.defaults.withCredentials = true;

        axios.post(backendconfig+'/getEducationDetails', data)
            .then((response) => {
                // let data =  response.data;
                console.log(response.data);
                this.setState({
                    educationList: this.state.educationList.concat(response.data)
                });
         });
        console.log("For logs", this.state.educationList);

    }

    componentWillMount() {
        this.setState({

            authFlag: false
        })
    }
    render() {
        console.log("For logs in render", this.state.educationList);

        //redirect based on successful login
        let msg;
        let editFlag, fiedlValues;
        let listEdu,display_according_userType, editedValues;

        if(this.state.user_type === '2') {
            display_according_userType = <div></div>;

        } else if(this.state.user_type === '1'){
            display_according_userType =  <button type="button" class="btn btn-success" value="Edit" name="editFlag" onClick={this.onClickHandler}> ADD </button>; 
        }

        if (this.state.errorMsg) {
            msg = <div class="alert alert-danger" role="alert">{this.state.errorMsg}</div>;
        }

        listEdu =   <div>
        {this.state.educationList.map(x => {
            return <Education edu={x} key={x.id} userType={this.state.user_type}></Education>
        })}
        </div>;
        if (!this.state.editFlag) {
            fiedlValues =
              <div></div>;

        } else {
            fiedlValues =
                <div>
       <form onSubmit={this.submitEducationDetails}>
               <button type="button" class="btn btn-secondary" name="cancel" onClick={this.onClickHandler}>Cancel</button>
            <div class="row">
              
            <div class="col-sm- 8">
                 
                 <label class="control-label"> School Name </label>
                 <input type="text" class="form-control"  style={{width:550}}  name="collegeName" id="collegeName" onChange = {this.inputChangeHandler} placeholder="College Name"  required/>
             </div>
             </div>
             <div class="row">
              
              <div class="col-sm-8">
                 <label> Education Level </label>
                 <input type="text" class="form-control" style={{width:550}} name="degree" id="degree" onChange = {this.inputChangeHandler} placeholder=" Degree"  required/>
             </div>
             </div>
             <div class="row">    
             <div class="col-sm-8 form-group">
                 <label> Major</label>
                 <input type="text" class="form-control" style={{width:550}} name="major"  onChange = {this.inputChangeHandler} id="major" placeholder=" Major"  />
             </div>
             </div>
             <div class="row form-group">      
            
            <div class="col-sm-4">
                
               <label>  Passing Year</label>
               <input type="text" class="form-control" style={{width:200}}  name="yearOfPassing" id="yearOfPassing" onChange = {this.inputChangeHandler} placeholder="Year Of Passing"  />
           </div>
           
            <div class="col-sm-4">
               <label> Cumulative GPA </label>
               <input type="text" class="form-control" name="cgpa" style={{width:200}} id="cgpa" onChange = {this.inputChangeHandler} placeholder="CGPA"  />
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
                {listEdu}
                {fiedlValues}
            </div>
        )
    }
}
export default EducationDetails 
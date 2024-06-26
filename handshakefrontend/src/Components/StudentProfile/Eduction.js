
import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';

import backendconfig from '../../backendConfig';

//Define a StudentProfile Component
class Education extends Component {
   
    constructor(props) {
    super(props);
    console.log("Props are" +props.edu.college_name);
        this.state = {
            id : "",
            collegeName : "",
            degree:"" ,
            major : "",
            yearOfPassing : "",
            cgpa :"",
            studentId : "",
            editFlag: false,
            authFlag: false, 
        }
        this.deleteEducation = this.deleteEducation.bind(this);
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
        this.updateEducationDetails = this.updateEducationDetails.bind(this);
    }


     //username change handler to update state variable with the text entered by the user
     inputChangeHandler = (event) => {
        const target = event.target;
        const value =  target.value;
        const name = target.name;
        this.setState({
          [name]: value
        });
    }

    updateEducationDetails = (event) =>{

        console.log('Edit education');

        event.preventDefault();

        const data = {
            id: this.props.edu.id,
            collegeName : this.state.collegeName,
            degree : this.state.degree,
            major : this.state.major,
            yearOfPassing : this.state.yearOfPassing,
            cgpa : this.state.cgpa
        }

        axios.defaults.withCredentials = true;
        //make a post request with the user data

        axios.post(backendconfig+'/updateEducationDetail',data)
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
        this.onClickHandler();
    }

    deleteEducation = (e) =>{
    
        const data = {
            id : this.props.edu.id
        }

        axios.defaults.withCredentials = true;
        //make a post request with the user data

        axios.post(backendconfig+'/deleteEducationDetail',data)
        .then(response => {
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                this.setState({
                    errorMsg : "Sussecc",
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

    onClickHandler = (e) =>{
       if(this.state.editFlag == true) {
        
        this.setState({
            editFlag : false
       })
       console.log("inside true"+this.state.editFlag);
       } else {
     
        this.setState({
            editFlag : true
       })
       console.log("inside false"+this.state.editFlag);
       }
      
    }

     //get the books data from backend  
    componentDidMount(){
      
    }

    componentWillMount() {
        this.setState({

            authFlag: false
        })
    }
    render() {
        //redirect based on successful login
        let msg;
        let editFlag ,fiedlValues;
        let originalValues , editedValues ;
        let display;
        display = 
        <div style={{backgroundColor :'whitesmoke' ,width: 700}}>
                <p> School Name : {this.props.edu.college_name} </p>
                <p>Education : {this.props.edu.degree} </p>
                <p>Major : {this.props.edu.major} </p>
                 <p>Year Of passing : {this.props.edu.yearOfPassing} </p>
               <p> CGPA : {this.props.edu.cgpa}</p>

        </div>;
        if (this.state.errorMsg) {
            msg = <div class="alert alert-danger" role="alert">{this.state.errorMsg}</div>;
        }
        if(!this.state.editFlag)  {
            fiedlValues = 
           <form onSubmit={this.deleteEducation}>
           <div>
             <input type="submit" name="delete" value="Delete" />
               {display}
               <button type="button" class="btn btn-info" value ="Edit" name="editFlag" onClick={this.onClickHandler}> Edit </button>
               <br/><br/><br/>
            </div>
            </form>   ;      

        } else {
            fiedlValues = 
       <div>
           <form onSubmit={this.updateEducationDetails}>
           <button type="button" class="btn btn-secondary" name="cancel" onClick={this.onClickHandler}>Cancel</button>
            <div class="row">
              
            <div class="col-sm- 8">
                 
                 <label class="control-label"> School Name </label>
                 <input type="text" style={{width:550}} class="form-control"  name="collegeName"  id="collegeName" onChange = {this.inputChangeHandler} placeholder="College Name"  required/>
             </div>
             </div>
             <div class="row">
              
              <div class="col-sm-8">
                 <label> Education Level </label>
                 <input type="text" style={{width:550}} class="form-control" name="degree"  id="degree" onChange = {this.inputChangeHandler} placeholder=" Degree"  required/>
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
               <input type="text" class="form-control" style={{width:200}}  name="yearOfPassing"  id="yearOfPassing" onChange = {this.inputChangeHandler} placeholder="Year Of Passing"  />
           </div>
           
            <div class="col-sm-4">
               <label> Cumulative GPA </label>
               <input type="text" class="form-control" name="cgpa" style={{width:200}}  id="cgpa" onChange = {this.inputChangeHandler} placeholder="CGPA"  />
           </div>
           </div> 
           <div> 
             <input type="submit" class="btn btn-info" value="Edit"/>
          </div>
            </form>
            </div>                 
       ;

        }
        if(this.props.userType === '2') {
            fiedlValues = display;
        }
        return (
            <div class="container">
            {fiedlValues}
            </div>
           )
    }
}
export default Education 
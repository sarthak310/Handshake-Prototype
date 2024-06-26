
import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import backendconfig from '../../backendConfig';

//Define a StudentProfile Component
class WorkExperience extends Component {
   
    constructor(props) {
    super(props);
    console.log("User id is"+props.work.user_id);
        this.state = {
            id : this.props.work.id,
            companyName : this.props.work.company_name,
            title: this.props.work.title ,
            start_date : this.props.work.start_date,
            end_date : this.props.work.end_date,
            desc : this.props.work.description,
            loc : this.props.work.location,
            editFlag: false,
            authFlag: false, 
        }
        this.deleteWorkExp = this.deleteWorkExp.bind(this);
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
        this.updateWorkExpDetails = this.updateWorkExpDetails.bind(this);
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

    updateWorkExpDetails = (event) =>{

        console.log('Edit Work');

        event.preventDefault();

        const data = {
            id: this.state.id,
            companyName : this.state.companyName,
            title : this.state.title,
            start_date : this.state.start_date,
            end_date : this.state.end_date,
            desc : this.state.desc,
            loc : this.state.loc
        }

        axios.defaults.withCredentials = true;
        //make a post request with the user data

        axios.post(backendconfig+'/updateWorkExpDetail',data)
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

    deleteWorkExp = (event) =>{
    
        const data = {
            id : this.state.id,
        }

        axios.defaults.withCredentials = true;
        //make a post request with the user data

        axios.post(backendconfig+'/deleteWorkExpDetail',data)
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

    onClickHandler = (e) =>{
       if(this.state.editFlag === true) {
        
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
        let  fiedlValues;
        console.log("userType is" , this.props.userType);
        if(this.props.userType === '2'){
            fiedlValues = 
            <div style={{backgroundColor :'whitesmoke' ,width: 700}}>
                <p> Company Name : {this.state.companyName} </p>
                <p>Title : {this.state.title} </p>
                <p> Location : {this.state.loc} </p>
                 <p> Start Date : {this.state.start_date.substring(0,10)} </p>
                 <p> End Date : {this.state.end_date.substring(0,10)}</p>
                 <p> Description : {this.state.desc}</p>
            </div>
        } else {
            if(!this.state.editFlag)  {
                fiedlValues = 
                <form onSubmit={this.deleteWorkExp}>
                <div>
                  <input type="submit" name="delete" value="Delete" />
                  <div  style={{backgroundColor :'whitesmoke' ,width: 700}}>
                  <p> Company Name : {this.state.companyName} </p>
                    <p>Title : {this.state.title} </p>
                    <p> Location : {this.state.loc} </p>
                     <p> Start Date : {this.state.start_date.substring(0,10)} </p>
                     <p> End Date : {this.state.end_date.substring(0,10)}</p>
                     <p> Description : {this.state.desc}</p>
                     </div>
                   <button type="button" class="btn btn-info" value ="Edit" name="editFlag" onClick={this.onClickHandler}> Edit </button>
                   <br/><br/><br/>
                </div>
                </form>   ;      
    
            } else {
                fiedlValues = 
           <div>
               <form onSubmit={this.updateWorkExpDetails}>
                <div class="row">
                <button type="button" name="cancel" class="btn btn-secondary" onClick={this.onClickHandler}>Cancel</button>
                <div class="col-sm- 8">
                     
                     <label class="control-label"> Company Name </label>
                     <input type="text" class="form-control"  name="companyName"  id="companyName" onChange = {this.inputChangeHandler} placeholder="Company Name"  required/>
                 </div>
                 </div>
                 <div class="row">
                  
                  <div class="col-sm-8">
                     <label> Title </label>
                     <input type="text" class="form-control" name="title"  id="title" onChange = {this.inputChangeHandler} placeholder=" Title"  required/>
                 </div>
                 </div>
                 <div class="row">    
                 <div class="col-sm-8 form-group">
                     <label> Location</label>
                     <input type="text" class="form-control" name="loc"  onChange = {this.inputChangeHandler} id="loc" placeholder=" Location"  />
                 </div>
                 </div>
                 <div class="row form-group">      
                
                <div class="col-sm-4">
                    
                   <label>  Start date</label>
                   <input type="date" class="form-control"  name="start_date"  id="start_date" onChange = {this.inputChangeHandler}  />
               </div>
               
                <div class="col-sm-4">
                   <label> End Date </label>
                   <input type="date" class="form-control" name="end_date"  id="end_date" onChange = {this.inputChangeHandler}  />
               </div>
               </div> 
               <div> 
                 <input type="submit" class="btn btn-info" value="Edit"/>
              </div>
                </form>
                </div>                 
           ;
          
            }
           
        }

        if (this.state.errorMsg) {
            msg = <div class="alert alert-danger" role="alert">{this.state.errorMsg}</div>;
        }
        
        return (
            <div class="container">
            {fiedlValues}
            </div>
           )
    }
}
export default WorkExperience 
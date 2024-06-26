import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import {Redirect} from 'react-router';
import backendconfig from '../../backendConfig';

//Define a Login Component
class SignUp extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            cname : "",
            emailId : "",
            cpwd : "",
            pwd : "",
            loc: "",
            errorMsg:"",
            authFlag : false
        }
        //Bind the handlers to this class
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.submitSignUp = this.submitSignUp.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            authFlag : false
        })
    }
   
    inputChangeHandler = (event) => {
        const target = event.target;
        const value =  target.value;
        const name = target.name;
        this.setState({
          [name]: value
        });
    }
 
    //submit Login handler to send a request to the node backend
    submitSignUp = (e) => {
       // var headers = new Headers();
        if(this.state.pwd !== this.state.cpwd) {
            this.setState({
                errorMsg : "Password does not match"
            });
            return;
        }
        //prevent page from refresh
        e.preventDefault();
        const data = {
            user_type : 2,
            cname : this.state.cname,
            emailId : this.state.emailId,
            pwd : this.state.pwd,
            cpwd : this.state.cpwd,
            loc : this.state.loc,
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(backendconfig+'/signup',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    this.setState({
                        authFlag : true
                    })
                }else{
                    console.log(response.data.msg);
                    this.setState({
                        errorMsg : response.data.msg,
                        authFlag : false
                    })
                }
            });
    }

    render(){
        //redirect based on successful login
        
        let redirectVar,msg ;
        if(this.state.authFlag) {
            redirectVar = <Redirect to= "/login"/>
        }
        if(this.state.errorMsg) {
            msg = <div class="alert alert-danger" role="alert">{this.state.errorMsg}</div>;
        }
        return(
            <div>
            {redirectVar}
            <div class="container">
                 <div class="row">
                 <div class="col-sm-6">
                 <div class="h2">Company Signup  </div>
                 </div>
                 <div class="col-sm-6">
                <form onSubmit ={this.submitSignUp} >
                <br/><br/><br/>
                 <div class="row">      
                 <br/>
                 <div class="col-sm-8">
                     
                    <label> Company Name </label>
                    <input type="text" class="form-control" value={this.state.cname} name="cname" id="cname" onChange = {this.inputChangeHandler} placeholder="Company Name"  required/>
                </div>
                </div>
                <div class="row">
                <br/>
                <div class="col-sm-8">
                    <label> Location </label>
                    <input type="text" class="form-control" name="loc" id="text" onChange = {this.inputChangeHandler} placeholder="Enter Location"  required/>
                </div>
                </div>
                <div class="row">
                <br/>
                <div class="col-sm-8">
                    <label> Email Address</label>
                    <div><small id="emailHelp" class="form-text text-muted">Please use your Company email</small></div>
                    <input type="email" class="form-control" name="emailId" id="emailId" onChange = {this.inputChangeHandler} placeholder="Enter Email"  required/>
                </div>
                </div>
                <div class="row">
                <br/>
                <div class="col-sm-4">
                    <label> Password</label>
                    <input type="password" class="form-control" name="pwd" id="pwd" onChange = {this.inputChangeHandler} placeholder="Password"  required/>
                </div>
                <div class="col-sm-4">
                    <label>Confirm  Password</label>
                    <input type="password" class="form-control" name="cpwd" id="cpwd" onChange = {this.inputChangeHandler} placeholder="Confirm  Password"  required/>
                </div>
                </div>
                <div class="row">
                <br/>
                    <div class="col-sm-2 ">
                    <input type="submit" class="btn btn-info" value="Create Account"/>
                    </div>
                </div>
                </form>
                {msg}
                </div>
                </div>
            </div>  
            </div>
        )
    }
}
//export Login Component
export default SignUp;
import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import Cookies from 'universal-cookie';
import backendconfig from '../../backendConfig';

//Define a ContactDetails Component
class ContactDetails extends Component {
   
    constructor(props) {
    super(props);
        this.state = {
            id : this.props.id,
            user_type : new Cookies().get("user_type"),
            emailId : "",
            phoneNum :"",
            errorMsg: "",
            editFlag: false,
            authFlag: false, 
        }
        this.onClickHandler = this.onClickHandler.bind(this);
        this.submitContactDetails = this.submitContactDetails.bind(this);
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

    
    submitContactDetails = (e) => {

        const data = {
            user_type : 1,
            id: this.state.id,
            emailId : this.state.emailId ,
            phoneNum : this.state.phoneNum,
        }

        axios.defaults.withCredentials = true;
        //make a post request with the user data
       // console.log(backendconfig);
        axios.post(backendconfig+'/setContactDetail',data)
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

     //get the books data from backend  
    componentDidMount(){
        const data = {
            uid : this.props.id
        }

        axios.post(backendconfig+'/studentProfileDetail',data)
        .then((response) => {
            let data = response.data;
            console.log(" Contact Detail:"+data);
        this.setState({
            id: data.id,
            emailId : data.email_id,
            phoneNum : data.phone_num
        });
    });
    }

    componentWillMount() {
        this.setState({

            authFlag: false
        })
    }
    render() {
        //redirect based on successful login
        let msg;
        let fiedlValues;
        let display_according_userType ;

        if(this.state.user_type === '2') {
            display_according_userType = <div></div>;

        } else if(this.state.user_type === '1'){
            display_according_userType =    <button type="button" class="btn btn-info" value ="Edit" name="editFlag" onClick={this.onClickHandler}> Edit </button>;
         
        }

        if (this.state.errorMsg) {
            msg = <div class="alert alert-danger" role="alert">{this.state.errorMsg}</div>;
        }
        if(!this.state.editFlag)  {
            fiedlValues = 
            // <div style ={{'border-style' : double}}>
           <div  style={{backgroundColor :'whitesmoke' ,width: 300}}>
           <div>
                <div class= "h4"> Email ID : </div>  <p>{this.state.emailId}</p>
           </div>
           <div>
           <div class= "h4">  Phone Numner :</div> <p>{this.state.phoneNum} </p>
           </div> 
            </div>   ;      

        } else {
            fiedlValues = 
       
           <form onSubmit={this.submitContactDetails}>
                  <div>
                <button type="button" class="btn btn-secondary" value ="Edit" name="editFlag" onClick={this.onClickHandler}> Cancel </button>
        
          </div>
            <div class="row">
             <div class="col-md-3">
                 
                <label> Email Id </label>
                <input  style={{width:300}} type="email" class="form-control"  name="emailId" value={this.state.emailId} id="emailId" onChange = {this.inputChangeHandler} placeholder="Enter Email"  required/>
            </div>
            </div>
            <div class="row">
             <div class="col-md-3">
                <label> Phone Name </label>
                <input  style={{width:300}} type="text" class="form-control" name="phoneNum" value={this.state.phoneNum} id="phoneNum" onChange = {this.inputChangeHandler} placeholder="Phone number"  required/>
            </div>
            </div>
            <br/>
          <div class="row">
            <input type="submit" class="btn btn-info" value="Save" />
          </div>
            </form>                 
       ;
        }
       
        return (
            
            <div class="container">
            {display_according_userType}
            <br/><br/>
            {fiedlValues}
            </div>
           )
    }
}

// let mapStateToProps = (store) => {
//     return {id:store.id, password:store.password}
// }

// export default connect(mapStateToProps)(ContactDetails);

export default ContactDetails 
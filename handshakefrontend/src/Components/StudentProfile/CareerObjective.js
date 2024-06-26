
import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import Cookies from 'universal-cookie';
import backendconfig from '../../backendConfig';

//Define a CareerObjective Component
class CareerObjective extends Component {
   
    constructor(props) {
    super(props);
        this.state = {
            id : "",
            user_type : new Cookies().get("user_type"),
            careerObj : "",
            errorMsg: "",
            editFlag: false,
            authFlag: false, 
        }
        this.inputChangeHandler = this.inputChangeHandler.bind(this);   
        this.onClickHandler = this.onClickHandler.bind(this);
        this.submitCarrerObj = this.submitCarrerObj.bind(this);
    }


     //username change handler to update state variable with the text entered by the user
     inputChangeHandler = (event) => {
        console.log(event.target.value);
        this.setState({
            careerObj : event.target.value
        });
        console.log(this.state.careerObj);
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

    
    submitCarrerObj = (e) => {
        e.preventDefault();
        const data = {
            user_type : 1,
            id: this.state.id,
            careerObj : this.state.careerObj
        }

        console.log(data.careerObj + " INSIde "+ data.id);
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(backendconfig+'/setCareerObj',data)
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
            console.log(data);
        this.setState({
            id: data.id,
            careerObj : data.careerObj
        });
    }).catch(error=>{
        this.setState({
            errorMsg : error
        })
    });
    }

    componentWillMount() {
        this.setState({
            authFlag: false
        })
    }
    render() {
        let msg;
        let  fiedlValues ,display_according_userType;
        

        if (this.state.errorMsg) {
            msg = <div class="alert alert-danger" role="alert">{this.state.errorMsg}</div>;
        }

        if(this.state.user_type === '2') {
            display_according_userType = <div></div>;

        } else if(this.state.user_type === '1'){
            display_according_userType =  <button type="button" class="btn btn-info" value ="Edit" name="editFlag" onClick={this.onClickHandler}> Edit </button>;         
        }
        
        if(this.state.editFlag)
        {fiedlValues = 
         <div>
            <button type="button" class="btn btn-secondary" name="delete" onClick={this.onClickHandler}>Cancel</button>          
            <form onSubmit={this.submitCarrerObj}>
            <div class ="form-group">
              <textarea name="careerObj" placeholder={this.state.careerObj} onChange={this.inputChangeHandler} rows="4" type="textarea" id="careerObj" class="form-control"></textarea>
           </div> 
           <div>   
            <input type="submit" class="btn btn-info" value="Save"/>
            </div>
            </form> 
            </div>        
                 
        }
        else{
            fiedlValues = <div class ="form-group" style={{backgroundColor :'whitesmoke' ,width: 700}}>
            {this.state.careerObj}
            </div>
        }
                
        return (
            <div class="container">
            {display_according_userType}    
            {fiedlValues}
            {msg}
            </div>
           )
    }
}

export default CareerObjective 

import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import backendconfig from '../../backendConfig';
// import { connect } from 'react-redux';

//Define a Company Desc Component
class CompanyDesc extends Component {
   
    constructor(props) {
    super(props);
    console.log("Comapy Desc"+ props.desc);
        this.state = {
            id : props.id,
            desc : props.desc,
            userType : props.userType,
            errorMsg: "",
            editFlag: false,
            authFlag: false, 
        }

        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
        this.changeCompanyDesc = this.changeCompanyDesc.bind(this);
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

    
    changeCompanyDesc = (e) => {

        const data = {
            id: this.state.id,
            desc : this.state.desc 
        }

        axios.defaults.withCredentials = true;
        //make a post request with the user data
         axios.post(backendconfig+'/company/updateDesc',data)
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
    }

    componentWillMount() {
        this.setState({

            authFlag: false
        })
    }
    render() {
        //redirect based on successful login
        let msg;
        let  fiedlValues,userSpecificdisplay;
        userSpecificdisplay='';
        
        if(this.state.userType === "2") {
            userSpecificdisplay= <button type="button" class="btn btn-info" value ="Edit" name="editFlag" onClick={this.onClickHandler}> Edit </button>
        }

        if (this.state.errorMsg) {
            msg = <div class="alert alert-danger" role="alert">{this.state.errorMsg}</div>;
        }
        if(this.state.editFlag)
        {fiedlValues = 
         <div>
            <button type="button" name="delete" onClick={this.onClickHandler}>Cancel</button>          
            <form onSubmit={this.changeCompanyDesc}>
            <div class ="form-group">
              <textarea name="desc" placeholder="Enter job description" onChange={this.inputChangeHandler} rows="4" type="textarea" id="desc" class="form-control"></textarea>
           </div> 
           <div>   
            <input type="submit" class="btn btn-info" value="Save"/>
            </div>
            </form> 
            </div>        
                 
        }
        else{
            fiedlValues = <div class ="form-group">
             <h4>Company Description</h4>   
            {this.state.desc}
            </div>
        }
                
       
        return (
            
            <div class="container">
            {userSpecificdisplay}  
            <br/><br/>  
            {fiedlValues}
            {msg}
            </div>
           )
    }
}

// let mapStateToProps = (store) => {
//     return {id:store.id, password:store.password}
// }

export default CompanyDesc;

//export default ContactDetails 
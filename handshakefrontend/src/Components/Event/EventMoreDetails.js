
import React, { Component } from 'react';
import '../../App.css';
import {Link} from 'react-router-dom';

//Define a StudentProfile Component
class EventMoreDetails extends Component {
   
    constructor(props) {
    super(props);
    console.log("Inside Event More Details" + props.moredetail.jid);
        this.state = {
            userType :  2,//props.moredetail.userType,
            jid :  props.moredetail.jid,
            title :  props.moredetail.title,
            desc :  props.moredetail.descrip,
            postdate :  props.moredetail.posting_date ,
            lastdate : props.moredetail.deadline,
            salary :  props.moredetail.salary,
            catagory :  props.moredetail.job_category,
            c_city :  props.moredetail.city,
            c_state :  props.moredetail.state,
            c_country :  props.moredetail.country,
            errorMsg : "" ,
            selectedFile: null,
            editFlag: false,
            authFlag: false, 
        }
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
    }
 

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
       } else {     
        this.setState({
            editFlag : true
       })
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
        let editFlag ,allFields;
        if(this.state.userType ===2) {
            
        }
        if (this.state.errorMsg) {
            msg = <div class="alert alert-danger" role="alert">{this.state.errorMsg}</div>;
        }
        return (
            <div class="container">
             <div>
                <span>Job Title :{this.state.title}</span>
                </div>
                <div>
                <span> Job Location : {this.state.c_city},{this.state.c_state}</span>
                </div>
                <div>
                <span> Job catagory : {this.state.catagory}</span>
                </div>
                <div>
                <span> Job Posted On:{this.state.postdate.substring(0,10)}</span>
                </div>
                <div>
                <span> Job Description : <br/>{this.state.desc}</span>
                </div>
                <div>
                <span> DeadLine : {this.state.lastdate.substring(0,10)}</span>
                </div>
                <div>
                <span> salary : {this.state.salary}</span>
             </div>
            </div>
           )
    }
}



export default EventMoreDetails;

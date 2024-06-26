import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import Cookies from 'universal-cookie';
import backendconfig from '../../backendConfig';
import StudentCommon from './StudentCommon';
//Define a StudentProfile Component
class StudentListCommon extends Component {
   
    
    constructor(props) {

    super(props);
    console.log(props.location);
    const cookies = new Cookies();
    if(this.props.location.state) {
        cookies.set("type",{expires: Date.now()});
        cookies.set("id",{expires: Date.now()});
        cookies.set("type", props.location.state.type,{maxAge : 600000});
        cookies.set("id", props.location.state.id,{maxAge : 600000});
    }
    console.log("Inside Student List" + cookies.get("id"));
        this.state = {
            id : this.props.location.state === undefined ? cookies.get("id") : this.props.location.state.id,
            type : this.props.location.state === undefined ? cookies.get("type") : this.props.location.state.type,
            userType : cookies.get("user_type"),
            studentList : []
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

     //get Student List from backend  
    componentDidMount(){
        
        let url ;
        const data = {
            id : this.state.id
        }
        console.log("Inside data"+ data.id);
        if(this.state.type === 1) {
            url = backendconfig+'/job/getStudentsWithJobId';
        
        } else if(this.state.type === 2) {
            url = backendconfig+'/event/getregisteredStudents';
        }
        axios.post(url,data)
        .then((response) => {
            let data = response.data;
            console.log('Student data',data);
        this.setState({
            studentList : data
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
        let allStudent ;

        allStudent = 
        <div> {
            this.state.studentList.map(item => {
                return <StudentCommon student={item} type={this.state.type} history={this.props.history}></StudentCommon>          
            })
            }
           
        </div>;
        if(this.state.userType ===2) {
            
        }
        
        if (this.state.errorMsg) {
            msg = <div class="alert alert-danger" role="alert">{this.state.errorMsg}</div>;
        }
        return (
            <div class="container">
                <div class="h1"> Students </div>
                {allStudent}
                {msg}
            </div>
           )
    }
}



export default StudentListCommon; 
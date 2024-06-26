import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import backendconfig from '../../backendConfig';
import StudentCommon from '../StudentProfile/StudentCommon';

//Define a Jobs Component
class AllStudentTab extends Component {
   
    constructor(props) {
        super(props);
        this.state = {
            id : "",
            userType : "1",
            searchName:"",
            searchSchool : "",
            searchSkills : "",
            filteredResult : [],
            errorMsg: "",
            authFlag: false
        }
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
    }

    inputChangeHandler = (event) => {
        const target = event.target;
        const value =  target.value;
        const name = target.name;
        this.setState({
          [name]: value
        }, ()=>{
            this.searchStudentApi()
        });
    }

     //get the books data from backend  
    componentDidMount(){
       this.searchStudentApi();
    }

    searchStudentApi = () => {

        console.log("Search Api called" , this.state);
        
        axios.get(backendconfig+'/user/getAllStudentsForComapany',{
            params: {
              searchName: this.state.searchName,
              searchSchool : this.state.searchSchool,
              searchSkills : this.state.searchSkills
            }
          }).then((response) =>{
           // console.log("All data " ,response.data);
            this.setState({
                filteredResult : response.data
            });
          }).catch((err) =>{
            console.log("Error occurred" + err);
          })
   

    }

    componentWillMount() {
        this.setState({
            authFlag: false
        })
    }
    render() {
                
        let displayField ;
        console.log("filtered data",this.state.filteredResult);
        displayField = <div> {
            this.state.filteredResult.map( item => {
               return <div><StudentCommon student={item} type="2" history={this.props.history}></StudentCommon><br/><br/></div>;
            })
        }
        </div>;
        return (
            <div class="container">
                <div class="h1"> List All the Student</div>
                <div class="row">
                    <div class="col-sm-4">
                    <input type= "text" name="searchName"  class="form-control" placeholder="Student  Name" autoComplete="off" onChange={this.inputChangeHandler}/>
               </div>
               <div class="col-sm-4">
                <input type= "text" name="searchSchool" class="form-control" placeholder=" Search College"  autoComplete="off" onChange={this.inputChangeHandler}/>
               </div> 
               <div class="col-sm-4">
               <input type= "text" name="searchSkills" class="form-control" placeholder=" Search Skills"  autoComplete="off" onChange={this.inputChangeHandler}/>
               </div> 
               </div> 
               <br/><br/>
               {displayField} 
            </div>
        )
    }
}

export default AllStudentTab;

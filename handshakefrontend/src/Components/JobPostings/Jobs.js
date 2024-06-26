import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import backendconfig from '../../backendConfig';
import { Dropdown } from "semantic-ui-react";
import JobDetails from '../JobPostings/JobDetails';

//Define a Jobs Component
class Jobs extends Component {
   
    constructor(props) {
        super(props);
        this.state = {
            id : "",
            userType : "1",
            searchName:"",
            searchLocation : "",
            searchCategory : [],
            filteredResult : [],
            errorMsg: "",
            authFlag: false,
            categories: [
                { key: "1", value: "Full Time",  text: "Full Time" },        
                { key: "2", value: "Part Time", text: "Part Time" } ,
                { key: "3", value: "On Campus",  text: "On Campus" },  
                { key: "4", value: "Internship",  text: "Internship" },  
            ]
        }
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    handleOnChange = (e,data) =>{
        this.setState({
            searchCategory : data.value
           },()=>{
            this.searchJobApi()
        });
       }

    inputChangeHandler = (event) => {
        const target = event.target;
        const value =  target.value;
        const name = target.name;
        this.setState({
          [name]: value
        }, ()=>{
            this.searchJobApi()
        });
    }

     //get the books data from backend  
    componentDidMount(){
       this.searchJobApi();
    }

    searchJobApi = () => {

        console.log("Search Api called" , this.state);
        
        axios.get(backendconfig+'/job/getAllJobs',{
            params: {
              searchName: this.state.searchName,
              searchLocation : this.state.searchLocation,
              searchCategory : this.state.searchCategory.toString()
            }
          }).then((response) =>{
            console.log("All data " ,response.data);
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
        displayField = <div> {
            this.state.filteredResult.map( item => {
               return  <JobDetails details={item} userType={this.state.userType}></JobDetails> 
            })
        }
        </div>;
        return (
            <div class="container">
                <div class="h1">Jobs </div>
                <div class ="row form-group">
                    <div class="col-sm-5">
                    <input type= "text" name="searchName" aria-label="Job titles or employers  " class="form-control" placeholder="Job titles, employers, or keywords" autoComplete="off" onChange={this.inputChangeHandler}/>
                    </div> 
                    <div class="col-sm-5">
                    <input type= "text" name="searchLocation" class="form-control" placeholder="Location"  autoComplete="off" onChange={this.inputChangeHandler}/>
                    </div>     
               </div>
               <div class="row form-group">
               <div  class="col-sm-10">
                    <Dropdown name = "searchCategory" id="searchCategory" placeholder="Search Category"  fluid  search  selection multiple  options={this.state.categories}  onChange={this.handleOnChange} /> 
               </div>       
               </div> 
              
               <br/><br/>
               {displayField} 
            </div>
        )
    }
}

export default Jobs;

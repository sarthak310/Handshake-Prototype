import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import backendconfig from '../../backendConfig';
import Cookies from 'universal-cookie';

class JobPosting extends Component {
   
    constructor(props) {
        super(props);
        this.state = {
            id: new Cookies().get("company_user_id"),
            title : "",
            desc:"",
            salary : "",
            loc: "" ,
            job_type : "",
            deadline : "",
            errorMsg: "",
            contact : {},
            authFlag: false,
        }
        this.createNewJob = this.createNewJob.bind(this);
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
    }

    inputChangeHandler = (event) => {
        const target = event.target;
        const value =  target.value;
        const name = target.name;
        this.setState({
          [name]: value
        });
        console.log(name+" "+value);
    }


    //get the books data from backend  
    componentDidMount(){
       
    }

    componentWillMount() {
        this.setState({
            authFlag: false
        })
    }

    createNewJob = (e) => {
        console.log(this.state.job_type);

        e.preventDefault();
        const data = {
            title : this.state.title,
            desc: this.state.desc,
            salary : this.state.salary,
            loc : this.state.loc,
            job_type : this.state.job_type,
            deadline : this.state.deadline,
            user_id : new Cookies().get("company_user_id")
        }

        axios.post(backendconfig+'/job/jobPosting',data)
        .then(response => {
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                this.setState({
                    authFlag : true
                },() =>{
                    this.props.history.push('/company/joblisting');
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

    render() {
                           
        return (
            <div class="container">
                <h2> Post Jobs</h2>
                <form onSubmit={this.createNewJob}>
                <div class="form-group">
                    <label> Job title </label>
                    <input type="text" name="title" id="title" class="form-control" onChange={this.inputChangeHandler} required/>
                </div>
                
                <div class="form-group">
                    <label> Job Catagory </label> <br/>
                    <input type="radio" name="job_type" id="full_time"  value="Full Time" onChange={this.inputChangeHandler} />
                    <label htmlFor="full_time">Full Time</label><br/>
                    <input type="radio" name="job_type" id="part_time"  value="Part Time" onChange={this.inputChangeHandler} />
                    <label htmlFor="part_time">Part Time</label><br/>
                    <input type="radio" name="job_type" id="intern"  value="Internship" onChange={this.inputChangeHandler} />
                    <label htmlFor="Internship"> Internship</label><br/>
                    <input type="radio" name="job_type" id="on_campus"  value="On Campus" onChange={this.inputChangeHandler} />
                    <label htmlFor="on_campus"> On Campus</label>
                </div>
                <div class="form-group">
                    <label> Job Description </label>
                    <textarea name="desc" id="desc" maxLength="1000" class="form-control"  onChange={this.inputChangeHandler} required/>
                </div>
                <div class="form-group">
                    <label> Applicaton Deadline </label>
                    <input type="date" name="deadline" id="deadline" class="form-control" onChange={this.inputChangeHandler} required/>
                </div>
                <div class="form-group">
                    <label> Salary </label>
                    <input type="text" name="salary" id="salary" class="form-control" onChange={this.inputChangeHandler} required/>
                </div>
                <div class="form-group">
                    <label> locaton </label>
                    <input type="text" name="loc" id="loc" class="form-control" onChange={this.inputChangeHandler} required/>
                </div>
                <div class="form-group">
                  
                    <input type="submit"  class="btn btn-info" value="Post Job"/>
                </div>
                </form>
            </div>
        )
    }
}

// let mapStateToProps = (store) => {
//     return {id:store.id, password:store.password}
// }

export default JobPosting;


import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import backendconfig from '../../backendConfig';
import Cookies from 'universal-cookie';

//Define a StudentProfile Component
class StudentCommon extends Component {

    constructor(props) {
        super(props);
        console.log("Inside Student List", props);
        this.state = {
            type: '',
            userType: '',
            status_id: '',
            student_id: '',
            status: '',
            major: '',
            profile: '',
            school: '',
            name: '',
            uid: ''
        }
        this.updateJobStatus = this.updateJobStatus.bind(this);
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
        this.onClickProfile = this.onClickProfile.bind(this);
    }

    componentDidMount(){
        console.log("component mounted");
        this.setState({
            type: this.props.type,
            userType: new Cookies().get("user_type"),
            status_id: this.props.student.status_id,
            student_id: this.props.student.id,
            status: this.props.student.status,
            major: this.props.student.major,
            profile: this.props.student.profile,
            school: this.props.student.school,
            name: this.props.student.name,
            uid: this.props.student.uid
        });
    }

    updateJobStatus = (e) => {

        e.preventDefault();
        const data = {
            status_id: this.state.status_id,
            status: this.state.status
        }
        console.log(data.status_id + "Request" + data.status)
        axios.post(backendconfig + '/job/updatestudentStatus', data)
            .then((response) => {
                console.log('Updated Status data', response.data);
            }).catch(error=>{
                console.log(error.msg);
            });

    }

    onClickProfile = (e) => {
        console.log("Printing student id : ", this.props.student.uid);
        this.props.history.push({
            pathname: '/student/studentprofile',
            id: this.props.student.uid
        })
    }

    inputChangeHandler = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        console.log(name+value);
        this.setState({
            [name]: value
        });
    }


    onClickHandler = (e) => {
        if (this.state.editFlag === true) {

            this.setState({
                editFlag: false
            })
        } else {
            this.setState({
                editFlag: true
            })
        }
    }

    componentWillMount() {
        this.setState({

            authFlag: false
        })
    }
    render() {
        //redirect based on successful login
        let msg;
        let fieldDisplay, userSpecificDisplay;

        console.log(" Inside Student Common  Type" , this.state , typeof this.state.type)
        if (this.state.type === 1) {
            fieldDisplay =
                <div class="container">
                    <form onSubmit={this.updateJobStatus}>
                        <div>
                            <button type="button" onClick={this.onClickProfile} title="click to view profile" class="btn btn-primary-outline" style={{backgroundColor : "transparent"}}> <span class="h3"> {this.props.student.name}</span></button>
                            <br />
                            <div>
                        <svg style={{height:10 ,width:10}}  aria-hidden="true" data-prefix="fas" data-icon="school" class="svg-inline--fa fa-school fa-w-20 icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M0 224v272c0 8.84 7.16 16 16 16h80V192H32c-17.67 0-32 14.33-32 32zm360-48h-24v-40c0-4.42-3.58-8-8-8h-16c-4.42 0-8 3.58-8 8v64c0 4.42 3.58 8 8 8h48c4.42 0 8-3.58 8-8v-16c0-4.42-3.58-8-8-8zm137.75-63.96l-160-106.67a32.02 32.02 0 0 0-35.5 0l-160 106.67A32.002 32.002 0 0 0 128 138.66V512h128V368c0-8.84 7.16-16 16-16h96c8.84 0 16 7.16 16 16v144h128V138.67c0-10.7-5.35-20.7-14.25-26.63zM320 256c-44.18 0-80-35.82-80-80s35.82-80 80-80 80 35.82 80 80-35.82 80-80 80zm288-64h-64v320h80c8.84 0 16-7.16 16-16V224c0-17.67-14.33-32-32-32z"></path></svg>
                        </div>
                        <span class="h5">  {this.props.student.major}  at {this.props.student.school}</span>
                       <p> <a href={backendconfig + '/uploads/' + this.props.student.resume.trim()} target="_blank"> View resume</a></p>
                            <select name="status" onChange={this.inputChangeHandler}>
                                <option value="1">Pending</option>
                                <option value="2">Reviewed</option>
                                <option value="3">Accepted</option>
                                <option value="4">Declined</option>
                            </select>
                            <input type="submit" name="updateStatus" />
                        </div>
                    </form>
                </div>;
        } else if (this.state.type == 2) {
            fieldDisplay = <div class="container">
                <form >
                    <li>
                    <div>
                        <button type="button" onClick={this.onClickProfile} title="click to view profile" class="btn btn-primary-outline" style={{backgroundColor : "transparent"}}> <span class="h3"> {this.props.student.name}</span></button>
                        <br />
                        <div>
                        <svg style={{height:12 ,width:12}} aria-hidden="true" data-prefix="fas" data-icon="school" class="svg-inline--fa fa-school fa-w-20 icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M0 224v272c0 8.84 7.16 16 16 16h80V192H32c-17.67 0-32 14.33-32 32zm360-48h-24v-40c0-4.42-3.58-8-8-8h-16c-4.42 0-8 3.58-8 8v64c0 4.42 3.58 8 8 8h48c4.42 0 8-3.58 8-8v-16c0-4.42-3.58-8-8-8zm137.75-63.96l-160-106.67a32.02 32.02 0 0 0-35.5 0l-160 106.67A32.002 32.002 0 0 0 128 138.66V512h128V368c0-8.84 7.16-16 16-16h96c8.84 0 16 7.16 16 16v144h128V138.67c0-10.7-5.35-20.7-14.25-26.63zM320 256c-44.18 0-80-35.82-80-80s35.82-80 80-80 80 35.82 80 80-35.82 80-80 80zm288-64h-64v320h80c8.84 0 16-7.16 16-16V224c0-17.67-14.33-32-32-32z"></path></svg>
                        
                        <span class="h5">  {this.props.student.major}  at {this.props.student.school}</span>
                        </div>
                    </div>
                    </li>
                </form>
            </div>;
        }


        if (this.state.userType === '2') {
            userSpecificDisplay = fieldDisplay;

        } else if (this.state.userType === '1') {
            userSpecificDisplay = <div class="container">
                <form >
                    <div>
                    <button type="button" onClick={this.onClickProfile} title="click to view profile" class="btn btn-primary-outline" style={{backgroundColor : "transparent"}}> <span class="h3"> {this.props.student.name}</span></button>
                         <br />
                        <svg style={{height:12 ,width:12}} aria-hidden="true" data-prefix="fas" data-icon="school" class="svg-inline--fa fa-school fa-w-20 icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M0 224v272c0 8.84 7.16 16 16 16h80V192H32c-17.67 0-32 14.33-32 32zm360-48h-24v-40c0-4.42-3.58-8-8-8h-16c-4.42 0-8 3.58-8 8v64c0 4.42 3.58 8 8 8h48c4.42 0 8-3.58 8-8v-16c0-4.42-3.58-8-8-8zm137.75-63.96l-160-106.67a32.02 32.02 0 0 0-35.5 0l-160 106.67A32.002 32.002 0 0 0 128 138.66V512h128V368c0-8.84 7.16-16 16-16h96c8.84 0 16 7.16 16 16v144h128V138.67c0-10.7-5.35-20.7-14.25-26.63zM320 256c-44.18 0-80-35.82-80-80s35.82-80 80-80 80 35.82 80 80-35.82 80-80 80zm288-64h-64v320h80c8.84 0 16-7.16 16-16V224c0-17.67-14.33-32-32-32z"></path></svg>
                        
                        <span class="h5"> {this.props.student.major},{this.props.student.school}</span>
                        <br />
                    </div>
                </form>
            </div>;

        }

        if (this.state.errorMsg) {
            msg = <div class="alert alert-danger" role="alert">{this.state.errorMsg}</div>;
        }
        return (
            <div  style={{boxShadow: '5px 5px 10px rgba(0,0,0,0.5)'}}>
                {userSpecificDisplay}
                {msg}
            </div>
        )

    }
}



export default StudentCommon;

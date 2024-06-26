
import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import backendconfig from '../../backendConfig';

//Define a StudentProfile Component
class Student extends Component {

    constructor(props) {
        super(props);
        console.log("Inside Student List", props);
        this.state = {
            status_id: props.student.status_id,
            student_id: props.student.id,
            status: props.student.status,
            major: props.student.major,
            profile: props.student.profile,
            school: props.student.school,
            name: props.student.name,
            uid: props.student.uid,
            resume: !!(props.student.resume) ? backendconfig + '/uploads/' + props.student.resume.trim() : ''
        }
        this.updateJobStatus = this.updateJobStatus.bind(this);
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
        this.onClickProfile = this.onClickProfile.bind(this);
    //     this.viewResume = this.viewResume.bind(this);
     }

    // viewResume = async e => {
    //     const source = await fileToBinary(this.state.resume);
    //     this.setState({
    //         resume: source
    //     })
    // }


    updateJobStatus = (e) => {

        const data = {
            status_id: this.state.status_id,
            status: this.state.status
        }
        console.log(data.status_id + "Request" + data.status)
        axios.post(backendconfig + '/job/updatestudentStatus', data)
            .then((response) => {
                console.log('Updated Status data', data);
            });

    }

    onClickProfile = (e) => {
        console.log("Printing student id : ", this.state.uid);
        this.props.history.push({
            pathname: '/student/studentprofile',
            id: this.state.uid
        })
    }

    inputChangeHandler = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    onError(e) {
        console.log(e);
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

    //get Student List from backend  
    componentDidMount() {

    }

    componentWillMount() {
        this.setState({

            authFlag: false
        })
    }
    render() {
        //redirect based on successful login
        let msg;



        if (this.state.userType === 2) {

        }

        if (this.state.errorMsg) {
            msg = <div class="alert alert-danger" role="alert">{this.state.errorMsg}</div>;
        }
        return (
            <div class="container">
                <form onSubmit={this.updateJobStatus}>
                    <div>
                        <button type="button" title="click to view profile" class="btn btn-primary-outline" style={{backgroundColor : "transparent"}} onClick={this.onClickProfile}> <span class="h3"> {this.state.name}</span></button>
                        <br />
                        <div>
                        <svg aria-hidden="true" data-prefix="fas" data-icon="school" class="svg-inline--fa fa-school fa-w-20 icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M0 224v272c0 8.84 7.16 16 16 16h80V192H32c-17.67 0-32 14.33-32 32zm360-48h-24v-40c0-4.42-3.58-8-8-8h-16c-4.42 0-8 3.58-8 8v64c0 4.42 3.58 8 8 8h48c4.42 0 8-3.58 8-8v-16c0-4.42-3.58-8-8-8zm137.75-63.96l-160-106.67a32.02 32.02 0 0 0-35.5 0l-160 106.67A32.002 32.002 0 0 0 128 138.66V512h128V368c0-8.84 7.16-16 16-16h96c8.84 0 16 7.16 16 16v144h128V138.67c0-10.7-5.35-20.7-14.25-26.63zM320 256c-44.18 0-80-35.82-80-80s35.82-80 80-80 80 35.82 80 80-35.82 80-80 80zm288-64h-64v320h80c8.84 0 16-7.16 16-16V224c0-17.67-14.33-32-32-32z"></path></svg>
                        </div>
                        <span class="h5">  {this.state.major}  at {this.state.school}</span>
                        <br />
                        <a href={this.state.resume}> View resume</a>
                        {/* <span> <button type="button" onclick={this.viewResume}>View Resume : </button> </span> */}
                        <br />
                        <select name="status" value={this.state.status} onChange={this.inputChangeHandler}>
                            <option value="1">Pending</option>
                            <option value="2">Reviewed</option>
                            <option value="3">Accepted</option>
                            <option value="4">Declined</option>
                        </select>
                        <input type="submit" name="updateStatus" />
                    </div>
                </form>
                {msg}
            </div>
        )
    }
}



export default Student;


import React, { Component } from 'react';
import '../../App.css';
import { Link, Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';
import backendconfig from '../../backendConfig';

//Define a StudentProfile Component
class JobMoreDetail extends Component {

    constructor(props) {
        super(props);
        console.log("Inside Job More Details", props.moredetail);
        this.state = {
            userType: new Cookies().get("user_type"),
            loginUserId: new Cookies().get("student_user_id"),
            jid: props.moredetail.jid,
            title: props.moredetail.title,
            loc: props.moredetail.location,
            desc: props.moredetail.descrip,
            c_userId: props.moredetail.user_id,
            postdate: props.moredetail.posting_date,
            lastdate: props.moredetail.deadline,
            salary: props.moredetail.salary,
            catagory: props.moredetail.job_category,
            c_name: props.moredetail.c_name,
            c_city: props.moredetail.city,
            c_state: props.moredetail.state,
            c_country: props.moredetail.country,
            profile: !!(props.moredetail.c_profile) ? backendconfig + '/uploads/' + props.moredetail.c_profile.trim() : backendconfig + '/uploads/noprofile.jpg',
            errorMsg: "",
            selectedFile: null,
            editFlag: false,
            authFlag: false,
            status: 0
        }
        this.onChangeFileHandler = this.onChangeFileHandler.bind(this);
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.applyForJob = this.applyForJob.bind(this);
    }

    applyForJob = (event) => {

        event.preventDefault();

        const data = new FormData();

        data.append("file", this.state.selectedFile, this.state.selectedFile.name);
        data.set("student_userId", this.state.loginUserId);
        data.set("jid", this.state.jid);

        axios.post(backendconfig + '/job/applyForJob', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200 && (typeof response.data === "string")) {
                    this.setState({
                        authFlag: true
                    })
                } else {
                    console.log(response.data.msg);
                    this.setState({
                        errorMsg: response.data.msg,
                        authFlag: false,
                        status: 1
                    })
                }
            }).catch(error => {
                this.setState({
                    errorMsg: error.msg
                });
            });
    }


    onChangeFileHandler = (event) => {
        console.log(event.target.files[0]);
        this.setState({
            selectedFile: event.target.files[0]
        })
        console.log(this.state.selectedFile);
    }


    inputChangeHandler = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }


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
        let redirectVar = null, userSpecificdisplay;
        if (this.state.authFlag) {
            redirectVar = <Redirect to={'/student/appliedjobs'}></Redirect>
        }
        console.log("Here" + this.state.status + typeof this.state.status);
        if (this.state.userType === "2") {
            userSpecificdisplay = <div>
                <Link to={{
                    pathname: '/studentListCommon',
                    state: {
                        id: this.state.jid,
                        type: 1
                    }
                }}>  See All the Student Applied for this Jobs </Link>
            </div>;
        } else if (this.state.userType === "1" && this.state.status !== 1) {
            userSpecificdisplay =
                <form onSubmit={this.applyForJob} >
                    <input type="file" name="selectedFile" onChange={this.onChangeFileHandler} /><br />
                    <input type="submit" class="btn btn-primary" name="apply" value="Apply For Job" />
                </form>
        }
        if (this.state.errorMsg) {
            msg = <div class="alert alert-danger" role="alert">{this.state.errorMsg}</div>;
        }
        return (
            <div class="container" >
                {redirectVar}
                {/* <div >
                    <img src={!!(props.moredetail.c_profile) ? backendconfig + '/uploads/' + props.moredetail.c_profile.trim() : backendconfig + '/uploads/noprofile.jpg'} alt="Company profile" style={{ height: 100, width: 100 }}></img>
                </div>*/}
                <div class="h2"> 
                    <span>{this.state.title}</span>
                </div>
                <div class="h5">
                    <Link to={{
                        pathname: '/company',
                        id: this.state.c_userId
                    }}>{this.state.c_name}</Link>
                </div>
                <div class="h5">
                    <svg style={{ height: 10, width: 10 }} aria-hidden="true" data-prefix="far" data-icon="map-marker-alt" class="svg-inline--fa fa-map-marker-alt fa-w-12 fa-fw style__icon___vzmpm icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M192 0C85.903 0 0 86.014 0 192c0 71.117 23.991 93.341 151.271 297.424 18.785 30.119 62.694 30.083 81.457 0C360.075 285.234 384 263.103 384 192 384 85.903 297.986 0 192 0zm0 464C64.576 259.686 48 246.788 48 192c0-79.529 64.471-144 144-144s144 64.471 144 144c0 54.553-15.166 65.425-144 272zm-80-272c0-44.183 35.817-80 80-80s80 35.817 80 80-35.817 80-80 80-80-35.817-80-80z"></path></svg>
                    <span> {this.state.loc}</span>
                </div>
                <div>
                    <svg style={{ height: 10, width: 10 }} aria-hidden="true" data-prefix="far" data-icon="briefcase" class="svg-inline--fa fa-briefcase fa-w-16 fa-fw style__icon___vzmpm icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 128h-80V80c0-26.51-21.49-48-48-48H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v256c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48zM176 80h160v48H176V80zM54 176h404c3.31 0 6 2.69 6 6v74H48v-74c0-3.31 2.69-6 6-6zm404 256H54c-3.31 0-6-2.69-6-6V304h144v24c0 13.25 10.75 24 24 24h80c13.25 0 24-10.75 24-24v-24h144v122c0 3.31-2.69 6-6 6z"></path></svg>
                    <span> {this.state.catagory}</span>
                </div>
                <div class="h5">
                    <svg style={{ height: 10, width: 10 }} aria-hidden="true" data-prefix="far" data-icon="money-bill-alt" class="svg-inline--fa fa-money-bill-alt fa-w-20 fa-fw style__icon___vzmpm icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M320 144c-53.02 0-96 50.14-96 112 0 61.85 42.98 112 96 112 53 0 96-50.13 96-112 0-61.86-42.98-112-96-112zm40 168c0 4.42-3.58 8-8 8h-64c-4.42 0-8-3.58-8-8v-16c0-4.42 3.58-8 8-8h16v-55.44l-.47.31a7.992 7.992 0 0 1-11.09-2.22l-8.88-13.31a7.992 7.992 0 0 1 2.22-11.09l15.33-10.22a23.99 23.99 0 0 1 13.31-4.03H328c4.42 0 8 3.58 8 8v88h16c4.42 0 8 3.58 8 8v16zM608 64H32C14.33 64 0 78.33 0 96v320c0 17.67 14.33 32 32 32h576c17.67 0 32-14.33 32-32V96c0-17.67-14.33-32-32-32zm-16 272c-35.35 0-64 28.65-64 64H112c0-35.35-28.65-64-64-64V176c35.35 0 64-28.65 64-64h416c0 35.35 28.65 64 64 64v160z"></path></svg>
                    <span>  {this.state.salary}</span>
                </div>
                <div class="h5">
                    <svg style={{ height: 10, width: 10 }} aria-hidden="true" data-prefix="far" data-icon="clock" class="svg-inline--fa fa-clock fa-w-16 fa-fw style__icon___vzmpm icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z"></path></svg>
                    <span> Posted On:{this.state.postdate.substring(0, 10)}</span>
                </div>
                <div style={{ border: "1px solid gray", borderRadius: "25px" }}>
                    <span style={{ textAlign: "right" }}> 	&nbsp;	&nbsp;Applications close on : {this.state.lastdate.substring(0, 10)}</span>
                </div>
                <div class="h4">
                    Job Description :
                    </div>
                <div>
                    <span> <br />{this.state.desc}</span>
                </div>
                <div>
                    {userSpecificdisplay}
                    {this.state.errorMsg}
                </div>
            </div>
        )
    }
}



export default JobMoreDetail;

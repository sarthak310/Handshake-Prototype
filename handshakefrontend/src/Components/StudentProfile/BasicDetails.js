import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import backendconfig from '../../backendConfig';
import Cookies from 'universal-cookie';

//Define a StudentProfile Component
class BasicDetails extends Component {

    constructor(props) {
        super(props);
        console.log("Inside basic details" + this.props.id);
        this.state = {
            id: "",
            userId: "",
            loginUserId: new Cookies().get("student_user_id"),
            user_type: new Cookies().get("user_type"),
            fname: "",
            lname: "",
            school: "",
            emailId: "",
            birthdate: "",
            major: "",
            city: "",
            state: "",
            country: "",
            phoneNum: "",
            errorMsg: "",
            profile: "",
            editFlag: false,
            authFlag: false,

        }
        this.onChangeFileHandler = this.onChangeFileHandler.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
        this.submitbasicDetails = this.submitbasicDetails.bind(this);
    }

    onChangeFileHandler = (event) => {
        this.setState({
            selectedFile: event.target.files[0]
        }, () => {
            this.uploadProfile();
        })
    }

    uploadProfile = () => {
   
        console.log(this.state.selectedFile);
        const data = new FormData();

        data.append("file", this.state.selectedFile, this.state.selectedFile.name);
        data.set("id", this.state.id)
        axios({
            method: 'post',
            url: backendconfig + '/user/uploadProfilePhoto',
            data: data,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    this.setState({
                        authFlag: true
                    })
                } else {
                    console.log(response.data.msg);
                    this.setState({
                        errorMsg: response.data,
                        authFlag: false
                    })
                }
            });
    }

    inputChangeHandler = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }


    onClickHandler = (e) => {
        this.setState(prevState => ({
            editFlag: !prevState.editFlag
        }));
    }


    submitbasicDetails = (e) => {

        const data = {
            //  user_type: 1,
            id: this.state.id,
            fname: this.state.fname,
            lname: this.state.lname,
            city: this.state.city, // === undefined ? "" : this.state.city,
            state: this.state.state, //=== undefined ? "" :this.state.state,
            country: this.state.country, // === undefined ? "" : this.state.country,
            birthdate: this.state.birthDate// === undefined ? "" : this.state.birthDate  
        }

        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(backendconfig + '/setbasicDetail', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    this.setState({
                        authFlag: true
                    })
                } else {
                    console.log(response.data.msg);
                    this.setState({
                        errorMsg: response.data,
                        authFlag: false
                    })
                }
            });
        this.onClickHandler();
    }

    //get the books data from backend  
    componentDidMount() {

        const data = {
            uid: this.props.id
        }
        console.log("In Student Basic data is", data.id);
        axios.post(backendconfig + '/studentProfileDetail', data)
            .then((response) => {
                let data = response.data;
                console.log(data);
                this.setState({
                    id: data.id,
                    userId: data.user_id,
                    fname: data.fname,
                    lname: data.lname,
                    school: data.school,
                    emailId: data.email_id,
                    birthdate: !!(data.birthDate) ? data.birthDate : '',
                    major: !!(data.major) ? data.major : '',
                    city: !!(data.city) ? data.city : '',
                    state: !!(data.state) ? data.state : '',
                    country: !!(data.country) ? data.country : '',
                    phoneNum: !!(data.phone_num) ? data.phone_num : '',
                    profile: (data.profile !== null) ? backendconfig + '/uploads/' + data.profile.trim() : backendconfig + '/uploads/noprofile.jpg'
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
        let fiedlValues;
        let display_according_userType;

        console.log("Getting user-type" + this.state.userId === this.state.loginUserId);
        if (this.state.errorMsg) {
            msg = <div class="alert alert-danger" role="alert">{this.state.errorMsg}</div>;
        }

        if (this.state.user_type === '2') {
            display_according_userType = <div></div>;

        } else if (this.state.user_type === '1' && parseInt(this.state.userId) === parseInt(this.state.loginUserId)) {
            display_according_userType = <button type="button" class="btn btn-info" value="Edit" name="editFlag" onClick={this.onClickHandler}> Edit </button>;

        }
        if (!this.state.editFlag) {
            fiedlValues =
                <div style={{ backgroundColor: 'whitesmoke', width: 300 }}>
                    <div >
                        <img src={this.state.profile} alt="Student profile" style={{ borderRadius: 25, border: "1px solid black", height: 100, width: 100 }}></img>
                    </div>
                    <div >

                        <label> First Name </label> :{this.state.fname}

                    </div>
                    <div >
                        <label> Last Name </label> :{this.state.lname}

                    </div>


                    <div >
                        <label> Birth Date</label> : {this.state.birthdate}

                    </div>

                    <div>
                        <label> School</label> :{this.state.school}

                    </div>


                    <div class="">
                        <label> Major</label> :{this.state.major}
                    </div>

                    <div class="">

                        <label>  City</label> :{this.state.city}

                    </div>

                    <div>
                        <label> State </label> :{this.state.state}

                    </div>
                    <div >
                        <label> Country </label> :{this.state.country}

                    </div>
                </div>
                ;

        } else {
            fiedlValues =

                <form onSubmit={this.submitbasicDetails}>
                    <div>
                        <button type="button" class="btn btn-secondary" value="Edit" name="editFlag" onClick={this.onClickHandler}> Cancel </button>

                    </div>
                    <input type="file"
                        onChange={this.onChangeFileHandler}
                        style={{ display: 'none' }}
                        ref={fileInput => this.fileInput = fileInput} />
                    <button type="button" onClick={() => { this.fileInput.click() }} > Upload Image</button>
                    <div>
                        <label> First Name </label>
                        <input style={{width:300}} class="form-control" type="text" name="fname" value={this.state.fname} id="fname" onChange={this.inputChangeHandler} placeholder="First Name" required />
                    </div>
                    <div>
                        <label> Last Name </label>
                        <input  style={{width:300}} class="form-control" type="text" name="lname" value={this.state.lname} id="lname" onChange={this.inputChangeHandler} placeholder="Last Name" required />
                    </div>
                    <div >
                        <label> School</label>
                        <input  style={{width:300}} class="form-control" type="email" name="school" value={this.state.school} id="school" readOnly />
                    </div>

                    <div>

                        <div >
                            <label> Major</label>
                            <input class="form-control"  style={{width:300}} type="text" name="major" value={this.state.major} id="major" readOnly />
                        </div>
                        <div>
                            <label> Birth Date</label>
                            <input class="form-control"  style={{width:300}} type="date" name="birthdate" value={this.state.birthdate} id="birthdate" onChange={this.inputChangeHandler} placeholder="Birth Date" />
                        </div>
                    </div>

                    <div>
                        <label>  City</label>
                        <input class="form-control"  style={{width:300}}  type="text" name="city" value={this.state.city} id="city" onChange={this.inputChangeHandler} placeholder="City" />
                    </div>

                    <div class="">
                        <label> State </label>
                        <input type="text"  style={{width:300}} class="form-control" name="state" value={this.state.state} id="state" onChange={this.inputChangeHandler} placeholder="State" />
                    </div>
                    <div class="">
                        <label> Country </label>
                        <input type="text"  style={{width:300}} class="form-control" name="country" value={this.state.country} id="country" onChange={this.inputChangeHandler} placeholder="Country" />
                    </div>
                    <br />
                    <div class="row">
                        <input type="submit" class="btn btn-info" value="Save" onSubmit={this.submitbasicDetails} />
                    </div>
                </form>
                ;
        }

        return (
            <div class="container">
                {display_according_userType}
                <br /><br />
                {fiedlValues}
            </div>
        )
    }
}

export default BasicDetails 
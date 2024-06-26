
import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import backendconfig from '../../backendConfig';

//Define a StudentProfile Component
class CompanyContact extends Component {

    constructor(props) {
        super(props);
        console.log("Inside Company Contact" + props.contact.emailId);
        this.state = {
            id: props.contact.id,
            userType: props.userType,
            emailId: props.contact.emailId,
            phoneNum: props.contact.phone,
            web: props.contact.website,
            errorMsg: "",
            editFlag: false,
            authFlag: false,
        }
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
        this.updateContactDetails = this.updateContactDetails.bind(this);
    }


    //username change handler to update state variable with the text entered by the user
    inputChangeHandler = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }


    onClickHandler = (e) => {
        if (this.state.editFlag === true) {

            this.setState({
                editFlag: false
            })
            console.log("inside true" + this.state.editFlag);
        } else {
            this.setState({
                editFlag: true
            })
            console.log("inside false" + this.state.editFlag);
        }
    }


    updateContactDetails = (e) => {

        e.preventDefault();

        const data = {
            id: this.state.id,
            emailId: this.state.emailId,
            phoneNum: this.state.phoneNum,
            website: this.state.web
        }

        axios.defaults.withCredentials = true;
        //make a post request with the user data
        console.log(backendconfig);
        axios.post(backendconfig + '/company/updateContactDetail', data)
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
    }

    componentWillMount() {
        this.setState({

            authFlag: false
        })
    }
    render() {
        //redirect based on successful login
        let msg;
        let fiedlValues, userSpecificdisplay;
        userSpecificdisplay = '';
        if (this.state.userType === "2") {
            userSpecificdisplay = <button type="button" class="btn btn-info" value="Edit" name="editFlag" onClick={this.onClickHandler}> Edit </button>;
        }
        if (this.state.errorMsg) {
            msg = <div class="alert alert-danger" role="alert">{this.state.errorMsg}</div>;
        }
        if (!this.state.editFlag) {
            fiedlValues =
                // <div style ={{'border-style' : double}}>
                <div>
                    <div>
                        <h4> Email ID : </h4>  <p>{this.state.emailId}</p>
                    </div>
                    <div>
                        <h4> Phone Numner :</h4> <p>{this.state.phoneNum} </p>
                    </div>
                    <div>
                        <h4> Web Site :</h4> <p>{this.state.web} </p>
                    </div>
                </div>;

        } else {
            fiedlValues =

                <form onSubmit={this.updateContactDetails}>
                    <div>
                        <button type="button" class="btn btn-info" value="Edit" name="editFlag" onClick={this.onClickHandler}> Cancel </button>

                    </div>
                    <div class="row">
                        <div class="col-md-3">

                            <label> Email Id </label>
                            <input type="email" class="form-control" name="emailId" value={this.state.emailId} id="emailId" onChange={this.inputChangeHandler} placeholder="Enter Email" required />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-3">
                            <label> Phone Name </label>
                            <input type="text" class="form-control" name="phoneNum" id="phoneNum" onChange={this.inputChangeHandler} placeholder="Phone number" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-3">
                            <label> Website </label>
                            <input type="text" class="form-control" name="web" id="web" onChange={this.inputChangeHandler} placeholder="Web Site" />
                        </div>
                    </div>
                    <div class="row">
                        <input type="submit" class="btn btn-info" value="Save" />
                    </div>
                </form>
                ;
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

//export default connect(mapStateToProps)(ContactDetails);

export default CompanyContact 
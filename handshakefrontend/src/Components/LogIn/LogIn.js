import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { login as loginAction } from './../../js/Actions/action'
import Cookies from 'universal-cookie';
import backendconfig from '../../backendConfig';

//Define a Login Component
class LogIn extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            emailId: "",
            pwd: "",
            userType: 1,
            type: 1,
            errorMsg: "",
            authFlag: false
        }
        //Bind the handlers to this class
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.onClickUserType = this.onClickUserType.bind(this);
        // this.handleOnChange = this.handleOnChange.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount() {
        this.setState({
            authFlag: false
        })
    }

    onClickUserType = (e) => {
        if (this.state.userType === 1) {

            this.setState({
                userType: 2
            })
        } else if (this.state.userType === 2) {
            this.setState({
                userType: 1
            })
        }
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

    //submit Login handler to send a request to the node backend
    submitLogin = (e) => {

        //prevent page from refresh
        e.preventDefault();

        const cookies = new Cookies();

        const data = {
            userType: this.state.userType,
            emailId: this.state.emailId,
            pwd: this.state.pwd,
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(backendconfig + '/login', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200 && !(typeof response.data.msg === "string")) {
                    this.setState({
                        authFlag: true
                    }, () => {
                        this.props.dispatch(loginAction({ id: response.data.msg, userType: this.state.userType }))
                        if (this.state.userType === 1) {
                            cookies.set("student_user_id", response.data.msg, { path: "/", maxAge: 600000 });
                            this.props.history.push({
                                pathname:'/jobs',
                            })
                        }
                        else if (this.state.userType === 2) {
                            cookies.set("company_user_id", response.data.msg, { path: "/", maxAge: 600000 });
                            //  this.props.history.push('/company');
                            this.props.history.push({
                                pathname: '/company/joblisting',
                                id: response.data.msg
                            })
                        }
                        cookies.set("user_type", this.state.userType, { path: "/", maxAge: 600000 })

                    })
                } else {
                    this.setState({
                        errorMsg: response.data.msg,
                        authFlag: false
                    })
                }
            }).catch(error => {
                this.setState({
                    errorMsg: "Some Error has occured.",
                    authFlag: false
                })
            });
    }

    render() {

        let msg;
        let alternateLogin;
        if (this.state.userType === 1) {
            alternateLogin = <div>
                <div>
                    If you are  Employer
                  <button type="button" class="btn btn-light" name="userType" onClick={this.onClickUserType}>ClickMe</button>
                </div>
            </div>;
        } else if (this.state.userType === 2) {
            alternateLogin = <div>
                <div>
                    If you are Student
                    <button type="button" class="btn btn-light" name="userType" onClick={this.onClickUserType}>ClickMe</button>
                </div>
            </div>;
        }
        if (this.state.errorMsg) {
            msg = <div class="alert alert-danger" role="alert">{this.state.errorMsg}</div>;
        }
        return (
            <div class="container">

                <fieldset class="form-group ">
                    <legend class="col-form-label">Log In</legend>
                    <form onSubmit={this.submitLogin} >
                        <div class="row">
                            <div class="col-sm-5 form-group">
                                <label> Email Address</label>
                                <input type="email" class="form-control" name="emailId" id="emailId" onChange={this.inputChangeHandler} placeholder="Enter Email" required />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-5 form-group ">
                                <label> Password</label>
                                <input type="password" class="form-control" name="pwd" id="pwd" onChange={this.inputChangeHandler} placeholder="Password" required />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-2 form-group">
                                <input type="submit" class="btn btn-info" value="Login" />
                            </div>
                        </div>
                    </form>
                    {msg}
                </fieldset>
                <div>
                    If you are new user
                    <Link to="/signup">&nbsp;Click Here</Link>
                </div>
                <div>
                    {alternateLogin}
                </div>
            </div>

        )
    }
}

let mapDispatchToProps = (store) => {
    return { id: store.id, password: store.password }
}

export default connect(mapDispatchToProps)(LogIn);

// export default LogIn;
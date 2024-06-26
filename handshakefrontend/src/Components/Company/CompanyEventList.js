
import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import backendconfig from '../../backendConfig';
import { connect } from 'react-redux';
import EventDetails from '../Event/EventDetails';
import Cookies from 'universal-cookie';

//Define a Company Component
class CompanyEventList extends Component {

    constructor(props) {
        super(props);
        console.log("Inside Company Basic" + props.id);
        this.state = {
            eventList: [],
            userType: new Cookies().get("user_type"),
            errorMsg: "",
        }
    }

    componentDidMount() {
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        const data = {
            user_id: new Cookies().get("company_user_id"),
        }
        console.log(backendconfig);
        axios.post(backendconfig + '/company/getAllEventsByUserId', data)
            .then(response => {
                let eventListData = response.data;
                console.log(eventListData);
                this.setState({
                    eventList: eventListData
                })
            }).catch(error => {
                this.setState({
                    errorMsg: error
                })
            });
    }

    render() {
        //redirect based on successful login
        let msg;
        let allFields;

        allFields = <ol> {
            this.state.eventList.map(item => {
                return <div><EventDetails details={item} userType={this.state.userType}></EventDetails><br/><br/></div>
            })
        }
        </ol>;
        if (this.state.errorMsg) {
            msg = <div class="alert alert-danger" role="alert">{this.state.errorMsg}</div>;
        }
        return (
            <div class="container">
                <div class="h1"> List Of Events Posted </div>
                {allFields}
                {msg}
            </div>
        )
    }
}

let mapStateToProps = (store) => {
    return { id: store.id, userType: store.userType }
}

export default connect(mapStateToProps)(CompanyEventList);


//export default CompanyBasicDetail 
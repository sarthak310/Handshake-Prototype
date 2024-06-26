
import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import JobDetails from '../JobPostings/JobDetails';
import backendconfig from '../../backendConfig';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';

//Define a StudentProfile Component
class CompanyJobListing extends Component {

    constructor(props) {
        super(props);
        console.log("Inside Company Basic" + props.id);
        this.state = {
            jobDetailList: [],
            errorMsg: "",
            authFlag: false,
        }
    }


    componentDidMount() {
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        const data = {
            user_id: new Cookies().get("company_user_id"),
        }
        console.log(backendconfig);
        axios.post(backendconfig + '/company/getAllJobsByCompanyId', data)
            .then(response => {
                let jobDetailsData = response.data;
                console.log(jobDetailsData);
                this.setState({
                    jobDetailList: jobDetailsData
                })
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
        let allFields;

        allFields = <ol> {
            this.state.jobDetailList.map(item => {
                return <JobDetails details={item} userType={this.props.userType}></JobDetails>
            })
        }
        </ol>;
        if (this.state.errorMsg) {
            msg = <div class="alert alert-danger" role="alert">{this.state.errorMsg}</div>;
        }
        return (
            <div class="container">
                <div class="h1"> List Of Jobs Posted </div>
                {allFields}
                {msg}
            </div>
        )
    }
}

let mapStateToProps = (store) => {
    return { id: store.id, userType: store.userType }
}

export default connect(mapStateToProps)(CompanyJobListing);


//export default CompanyBasicDetail 
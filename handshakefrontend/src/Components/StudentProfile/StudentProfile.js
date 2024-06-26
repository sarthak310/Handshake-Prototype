import React, { Component } from 'react';
import '../../App.css';
import BasicDetails from './BasicDetails';
import ContactDetails from './ContactDetails';
import CareerObjective from './CareerObjective';
import EducationDetails from './EducationDetails';
import WorkExperienceDetail from './WorkExperienceDetail';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import Skills from './Skills';

//Define a StudentProfile Component
class StudentProfile extends Component {

    constructor(props) {
        super(props);
        const cookies = new Cookies();

        if (this.props.location.id) {
            cookies.set("student_user_id", this.props.location.id, { path: "/" });
        }
        console.log('Id in student profile:', this.props);
        this.state = {
            id: props.location.id === undefined ? cookies.get("student_user_id") : props.location.id,    //make it user_id
            errorMsg: "",
            authFlag: false,
        }
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

        return (
            <div class="container">
                <div class="row">
                    <div class="col-md-4">
                        <div style={{border:"1px solid white",boxShadow: '5px 5px 10px rgba(0,0,0,0.5)',margin :'2 2 2 2'}}>
                            <div class="h3"> Basic Details</div>
                            <BasicDetails id={this.state.id}> </BasicDetails>
                        </div>
                        <br/><br/>
                        <div style={{border:"1px solid white",boxShadow: '5px 5px 10px rgba(0,0,0,0.5)',margin :'2 2 2 2'}}>
                            <div class="h3"> Contact Details</div>
                            <ContactDetails id={this.state.id}></ContactDetails>
                        </div>
                        <br/><br/>
                        <div style={{border:"1px solid white",boxShadow: '5px 5px 10px rgba(0,0,0,0.5)',margin :'2 2 2 2'}}>
                            <div class="h3"> Skills</div>
                            <Skills id={this.state.id}></Skills>
                        </div>
                    </div>
                    <br/><br/>
                    <div class="col-md-8">
                        <div style={{border:"1px solid white",boxShadow: '5px 5px 10px rgba(0,0,0,0.5)'}}>
                            <div class="h3"> My Journey</div>
                            <CareerObjective id={this.state.id}></CareerObjective>
                        </div>
                        <br/><br/>
                        <div style={{border:"1px solid white",boxShadow: '5px 5px 10px rgba(0,0,0,0.5)'}}>
                            <div class="h3"> Education</div>
                            <EducationDetails id={this.state.id}></EducationDetails>
                        </div>
                        <br/><br/>
                        <div style={{border:"1px solid white",boxShadow: '5px 5px 10px rgba(0,0,0,0.5)'}}>
                            <div class="h3"> Work Experience</div>
                            <WorkExperienceDetail id={this.state.id}></WorkExperienceDetail>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

let mapDispatchToProps = (store) => {
    return { id: store.id, password: store.password }
}

export default connect(mapDispatchToProps)(StudentProfile);

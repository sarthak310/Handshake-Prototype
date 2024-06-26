import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import LogIn from './LogIn/LogIn';
import SignUp from './SignUp/SignUp';
import StudentProfile from './StudentProfile/StudentProfile';
import CompanyProfile from './Company/CompanyProfile';
import JobPosting from './JobPostings/jobPosting';
import JobMoreDetail from './JobPostings/JobMoredetail';
import CompanyJobListing from './Company/CompanyJobListing';
import StudentList from './StudentProfile/StudentList';
import EventPosting from './Company/EventPosting';
import StudentListCommon from './StudentProfile/StudentListCommon';
import CompanyEventList from './Company/CompanyEventList';
import Jobs from './JobPostings/Jobs';
import Events from './Event/Events';
import AppliedJobsByStudent from './JobPostings/AppliedJobsByStudent';
import AllStudents from './StudentProfile/AllStudents';
import EventsRegisteredByStudents from './Event/EventsRegisteredByStudent';
import AllStudentTab from './Company/AllStudentTab';
import Navbar from './Navbar';
import CompanySignup from './SignUp/companySignup';

//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
                
                  
                    <Route path="/" component={Navbar}/>
                    <Route path="/signup" component={SignUp}/>
                    <Route path="/company/signup" component={CompanySignup}/>   
                    <Route path="/login" component={LogIn}/>
                    <Route exact path="/company" component={CompanyProfile} />
                    <Route path="/company/jobposting" component={JobPosting}/>
                    <Route path="/company/joblisting" component={CompanyJobListing}/>
                    <Route path="/company/eventlisting" component={CompanyEventList}/>
                    <Route path='/company/eventposting' component={EventPosting} />
                    <Route path='/company/allStudents' component={AllStudentTab}/>
                    <Route path="/student/studentprofile" component={StudentProfile} />
                    <Route path="/jobs" component={Jobs}/>
                    <Route path='/student/appliedjobs' component={AppliedJobsByStudent}/>
                    <Route path='/jobMoredetails' component={JobMoreDetail} />
                    <Route path='/studentList' component={StudentList} />
                    <Route path='/student/events' component={Events} />
                    <Route path='/student/allStudents' component={AllStudents}/>
                    <Route path='/student/registeredEvents' component ={EventsRegisteredByStudents}/>
                    <Route path='/studentListCommon' component={StudentListCommon}/>
               
            </div>
        )
    }
}
//Export The Main Component
export default Main;
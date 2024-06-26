
import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import Student from './Student';
import Cookies from 'universal-cookie';
import backendconfig from '../../backendConfig';


//Define a StudentProfile Component
class StudentList extends Component {


    constructor(props) {

        super(props);

        const cookies = new Cookies();
        if (this.props.location.state) {

            cookies.set("job_id", props.location.state.id, { path: "/" });
        }
        console.log("Inside Student List" + cookies.get("job_id"));
        this.state = {
            j_id: this.props.location.state === undefined ? cookies.get("job_id") : this.props.location.state.id,
            studentList: []
        }
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
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
        const data = {
            jid: this.state.j_id
        }
        console.log("get students applied for job id :", data.jid);
        axios.post(backendconfig + '/job/getStudentsWithJobId', data)
            .then((response) => {
                let data = response.data;
                console.log('Student data', data);
                this.setState({
                    studentList: data
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
        let allStudent;

        allStudent =
            <div> {
                this.state.studentList.map(item => {
                    return <Student student={item} key={item.id} history={this.props.history}></Student>
                })
            }

            </div>;
        if (this.state.userType === 2) {

        }

        if (this.state.errorMsg) {
            msg = <div class="alert alert-danger" role="alert">{this.state.errorMsg}</div>;
        }
        return (
            <div class="container">
                {allStudent}
                {msg}
            </div>
        )
    }
}



export default StudentList;

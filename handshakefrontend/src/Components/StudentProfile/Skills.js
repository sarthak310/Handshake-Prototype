import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import backendconfig from '../../backendConfig';
import { Dropdown } from "semantic-ui-react";
import Cookies from 'universal-cookie';

//Define a skills Component
class Skills extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: "",
            loginUserId : new Cookies().get("student_user_id"),
            user_type : new Cookies().get("user_type"),
            userId : props.id,
            errorMsg: "",
            authFlag: false,
            allSkills : [],
            skillset: [
                { key: "1", value: "Java", text: "Java" },
                { key: "2", value: "Python", text: "Python" },
                { key: "3", value: "React", text: "React" },
                { key: "4", value: "NodeJs", text: "NodeJs" },
                { key: "5", value: "DevOps", text: "DevOps" },
                { key: "6", value: "PHP", text: "PHP" }
            ]
        }
        this.setSkills = this.setSkills.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    handleOnChange = (e, data) => {
        this.setState({
            allSkills: data.value
        });
    }

    onClickHandler = (e) =>{
        this.setState(prevState => ({
            editFlag: !prevState.editFlag
        }));       
     }

    componentDidMount() {
        //console
        axios.get(backendconfig+'/user/getSkills',{
            params: {
                user_id: this.state.userId
            }
          })
        .then(respose => {
            console.log("skills",respose.data);
            this.setState({
                id : respose.data.id,
                allSkills : respose.data.skills.split(',')
            });
        })
        .catch(error =>{
            this.setState({
                errorMsg : error.msg
            });
        });

    }

    setSkills = (e) => {

        e.preventDefault();

       console.log("For setting skills",this.state.allSkills.join());
       axios.defaults.withCredentials = true;

        const data = {
            id: this.state.id,
            skills : this.state.allSkills.join()
        };

        axios.post(backendconfig+'/user/setskills',data)
        .then(respose => {
            console.log(respose);
            if(respose.data.status === 200) {
                this.setState({
                    authFlag : true
                })
            }
        }).catch(error =>{
            this.setState({
                errorMsg : error.msg
            })
            console.log("Error has occured");
        });
        this.onClickHandler();
    }

    componentWillMount() {
        this.setState({
            authFlag: false
        })
    }
    render() {
        let msg;
        let fiedlValues, display_according_userType;
//        console.log("All skills are"+ this.state.allSkills);

        if (this.state.errorMsg !== "") {
            msg = <div class="alert alert-danger" role="alert">{this.state.errorMsg}</div>;
        }

        if (this.state.user_type === '2') {
            display_according_userType = <div></div>;

        } else if (this.state.user_type === '1' && this.state.userId === this.state.loginUserId) {
            display_according_userType = <button type="button" class="btn btn-info" value="Edit" name="editFlag" onClick={this.onClickHandler}> Edit </button>;
        }

        if (this.state.editFlag) {
            fiedlValues =
                <div>
                    <button type="button" name="delete" onClick={this.onClickHandler}>Cancel</button>
                    <form onSubmit={this.setSkills}>
                        <div class="form-group">
                            <Dropdown  style={{width:300}} name="skills" id="skills" placeholder="Select your SkillSet" fluid search selection multiple options={this.state.skillset} onChange={this.handleOnChange} defaultValue={this.state.allSkills} />
                        </div>
                        <div>
                            <input type="submit" class="btn btn-info" value="Save" />
                        </div>
                    </form>
                </div>

        }
        else {
            fiedlValues = <div class="form-group" style={{backgroundColor :'whitesmoke' ,width: 300}}>
                <ul>
                {this.state.allSkills.map(item => {
                   return <li> {item}   </li>;
                })}
                </ul>
            </div>
        }

        return (
            <div class="container">
                {display_according_userType}
                {fiedlValues}
                {/* {msg} */}
            </div>
        )
    }
}

export default Skills;

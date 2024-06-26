import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { connect } from 'react-redux';
import CompanyBasicDetail from './CompanyBasicDetail';
import CompanyDesc from './CompanyDesc';
import CompanyContact from './CompanyContact';
import Cookies from 'universal-cookie';
import backendconfig from '../../backendConfig';

//Define a StudentProfile Component
class CompanyProfile extends Component {
   
    constructor(props) {
        super(props);
        const cookies = new Cookies();
        
        if(this.props.location.id) {
            cookies.set("company_user_id", this.props.location.id, {path: "/"});
        }
        this.state = {
            id: "",
            desc: "" ,
            userId : this.props.location.id === undefined ? cookies.get("company_user_id") : this.props.location.id,
            useType: this.props.location.userType === undefined ? "2" : this.props.location.userType,
            errorMsg: "",
            basic:{},
            contact : {},
            authFlag: false,
        }
    }

    //get the books data from backend  
    componentDidMount(){

        const data = {
            uid : this.state.userId
        }
        console.log("All props data is"+this.props.id+ ""+data.uid);
        axios.post(backendconfig+'/company/getCompanyData',data)
        .then((response) => {
            let data = response.data;
        this.setState({
            id: data.id,
            desc: data.c_description ,
            userId : data.user_id,
            basic: {
                "id" : data.id,
                "name" : data.c_name,
                "loc": data.location ,
                "profile" : data.c_profile,
            },
            contact : {
                "phone" : data.c_phone,
                "id": data.id,
                "website" :data.c_website,
                "emailId" : data.email_id
            }
        });
    }); 
    }

    componentWillMount() {
        this.setState({
            authFlag: false
        })
    }
    render() {
                let renderFields ;
                if(this.state.id) {
                  console.log("Inside company profile" , this.props)  
                renderFields = 
                <div>
                <div style={{border:"1px solid white",boxShadow: '5px 5px 10px rgba(0,0,0,0.5)',margin :'2 2 2 2'}}> 
                <CompanyBasicDetail basic={this.state.basic} userType={this.state.useType}></CompanyBasicDetail>    
                </div>
                <br/><br/>
                <div style={{border:"1px solid white",boxShadow: '5px 5px 10px rgba(0,0,0,0.5)',margin :'2 2 2 2'}}> 
                <CompanyDesc desc={this.state.desc} id={this.state.id} userType={this.state.useType}></CompanyDesc> 
                </div>
                <br/><br/>
                <div style={{border:"1px solid white",boxShadow: '5px 5px 10px rgba(0,0,0,0.5)',margin :'2 2 2 2'}}>
                <CompanyContact contact = {this.state.contact} userType={this.state.useType}></CompanyContact> 
                </div>
                </div>
                ;
                }
        return (
            <div class="container">
                <div class="h1">Company Profile</div>
                <div class="row">
                    {console.log(this.state.desc)}
                    {/* <CompanyBasicDetail name = {this.state.name} loc={this.state.loc}  id={this.state.id}></CompanyBasicDetail> */}
                    {/* <CompanyDesc desc={this.state.desc} id={this.state.id}></CompanyDesc> 
                    <CompanyContact contact = {this.state.contact} ></CompanyContact>  */}
                    {renderFields}
                </div>
            </div>
        )
    }
}

let mapStateToProps = (store) => {
    return {id:store.id, password:store.password}
}

export default connect(mapStateToProps)(CompanyProfile);

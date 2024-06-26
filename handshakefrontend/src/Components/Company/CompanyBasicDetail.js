
import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import backendconfig from '../../backendConfig';
// import { connect } from 'react-redux';

//Define a StudentProfile Component
class CompanyBasicDetail extends Component {
   
    constructor(props) {
    super(props);
    this.state = {
            userType : props.userType,
            id : props.basic.id,
            name : props.basic.name,
            loc :props.basic.loc,
            profile : !!(props.basic.profile) ? backendconfig+'/uploads/'+props.basic.profile.trim() :backendconfig+'/uploads/noprofile.jpg',
            errorMsg: "",
            selectedFile: null,
            editFlag: false,
            authFlag: false, 
        }
        this.onChangeFileHandler = this.onChangeFileHandler.bind(this);
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
        this.updateBasicDetails = this.updateBasicDetails.bind(this);
    }


    onChangeFileHandler = (event)=>{


        console.log(event.target.files[0]);
        this.setState({
            selectedFile: event.target.files[0]
          })

          console.log(this.state.selectedFile);
    }

     inputChangeHandler = (event) => {
        const target = event.target;
        const value =  target.value;
        const name = target.name;
        this.setState({
          [name]: value
        });
    }


    onClickHandler = (e) =>{
       if(this.state.editFlag === true) {
        
        this.setState({
            editFlag : false
       })
       } else {     
        this.setState({
            editFlag : true
       })
       }      
    }

    
    updateBasicDetails = (e) => {

        console.log(this.state.selectedFile);
        const data = new FormData();

        data.append("file", this.state.selectedFile, this.state.selectedFile.name);
        data.set("id", this.state.id);
        data.set("name", this.state.name);
        data.set("loc" , this.state.loc);

        axios.defaults.withCredentials = true;
        //make a post request with the user data
        console.log(data);
        // axios.post('http://localhost:3001/company/updateBasicDetail',data)
        axios({
            method: 'post',
            url: backendconfig+'/company/updateBasicDetail',
            data: data,
            headers: {'Content-Type': 'multipart/form-data' }
            })    
        .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    this.setState({
                        authFlag : true
                    })
                }else{
                    console.log(response.data.msg);
                    this.setState({
                        errorMsg : response.data,
                        authFlag : false
                    })
                }
            });

            this.onClickHandler();
      
    }

     //get the books data from backend  
    componentDidMount(){
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
        userSpecificdisplay ='';
        console.log(this.state.userType , typeof this.state.userType);
        if(this.state.userType === "2") {
            userSpecificdisplay= <button type="button" class="btn btn-info" value ="Edit" name="editFlag" onClick={this.onClickHandler}> Edit </button>
        }

        if (this.state.errorMsg) {
            msg = <div class="alert alert-danger" role="alert">{this.state.errorMsg}</div>;
        }
        if(!this.state.editFlag)  {
            fiedlValues = 
            // <div style ={{'border-style' : double}}>
           <div>
            <div >
                <img src={this.state.profile} alt="Company profile" style={{height:100 ,width:100}}></img>
           </div>
           <div>
                <h4> Company Name :</h4> <p>{this.state.name} </p>
           </div> 
           <div>
                <h4> Location :</h4> <p>{this.state.loc} </p>
           </div> 
            </div>   ;      

        } else {
            fiedlValues = 
       
           <form type="" onSubmit={this.updateBasicDetails}>
                  <div>
                <button type="button" class="btn btn-info" value ="Edit" name="editFlag" onClick={this.onClickHandler}> Cancel </button>
        
          </div>
            <div class="row">
             <div class="col-md-3">
                 
                <label> Profile </label>
                <input type="file" name="file" ref={fileInput => this.fileInput = fileInput} onChange={this.onChangeFileHandler}/>
                {/* <button onClick={() =>{ this.fileInput.click()}}>Pick File</button> */}
                {/* <input type="file" class="form-control"  name="profile"  id="profile" onChange = {this.inputChangeHandler} placeholder="Upload"  /> */}
            </div>
            </div>
            <div class="row">
             <div class="col-md-3">
                <label> Company Name </label>
                <input type="text" class="form-control" name="name" value={this.state.name} id="name" readOnly required/>
            </div>
            </div>
            <div class="row">
             <div class="col-md-3">
                <label> Location </label>
                <input type="text" class="form-control" name="loc" value={this.state.loc} id="loc" onChange = {this.inputChangeHandler} placeholder="location" />
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
            </div>
           )
    }
}

// let mapStateToProps = (store) => {
//     return {id:store.id, password:store.password}
// }

//export default connect(mapStateToProps)(ContactDetails);

export default CompanyBasicDetail;
//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var path=require('path');
const config = require('./config');
const serverconfig = require('./serverConfig');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
app.set('view engine', 'ejs');
//app.use(express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//use cors to allow cross origin resource sharing
app.use(cors({ origin: serverconfig, credentials: true }));

// //use express session to maintain session data
// app.use(session({
//   secret: 'cmpe273_kafka_passport_mongo',
//   resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
//   saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
//   duration: 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
//   activeDuration: 5 * 60 * 1000
// }));

// app.use(bodyParser.urlencoded({
//     extended: true
//   }));
app.use(bodyParser.json());

//Allow Access Control
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', serverconfig);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

var sess;


var companypath = '/company';
var jobPath = '/job';
var eventPath = '/event';
var studentPath = '/student';
var userPath = '/user';
var companyroutes = require('./src/routes/Company');
var jobroutes = require('./src/routes/JobPosting');
var studentroutes = require('./src/routes/Student');
var eventroutes = require('./src/routes/Event');
var userroutes = require('./src/routes/User');

//app.use(express.static('/uploads'))

//


app.use(studentPath, studentroutes);
app.use(companypath, companyroutes);
app.use(jobPath, jobroutes);
app.use(eventPath,eventroutes);
app.use(userPath, userroutes);



//Route to handle Post Request Call
app.post('/signup', function (req, res) {

  let errorMsg;
  const con = mysql.createConnection(config);
  let hash = bcrypt.hashSync(req.body.pwd, 10);
  con.connect(function (err) {
    if (err) errorMsg = err.message;
    if(req.body.user_type === 1) {
      console.log("It's Student");
      var sql = "CALL insert_student(?,?,?,?,?,?,?)";
      con.query(sql, [req.body.emailId, hash, req.body.user_type, req.body.fname, req.body.lname, req.body.major, req.body.school], function (err, result) {
        if (err) errorMsg = err.message;
      });
    } else if(req.body.user_type === 2) {
      console.log("It's company"+req.body.loc);
      var sql = "CALL insert_company(?,?,?,?,?)";
      con.query(sql, [req.body.emailId, hash, req.body.user_type, req.body.cname, req.body.loc], function (err, result) {
        if (err) errorMsg = err.message;
      });
    }
   
  });
  if (errorMsg) {
    res.status(401).send({ "msg": err.message });
  } else
    res.status(200).send({ "msg": "Successful" });

});


app.post('/login', function (req, res) {

  let errorMsg;
  console.log("LogIn API");
  
  let con = mysql.createConnection(config);
  con.connect(function (err) {
    if (err) res.status(401).send({ "msg": err.message });
    let sql = "Select id,email_id,pwd from handshake.User where email_id = '" + req.body.emailId + "' and user_type = '"+ req.body.userType +"'";
    con.query(sql, function (err, result, fields) {
      if (err) {
        res.status(401).end({ "msg": err });

      } else {
        if (result.length > 0) {
          bcrypt.compare(req.body.pwd, result[0].pwd, function (err, response) {

            if (response) {
              //sess = req.session;
              //sess.user_id = result[0].id;
              res.cookie('cookie', "admin", { maxAge: 90000000, httpOnly: false, path: '/' });
            } else {
              res.writeHead(200, {
                'Content-Type': 'application/json'
              })
              res.end(JSON.stringify({ "msg": "Invalid Credentials", status: 0 }))
            }
            //let await getUserSpecificId(req,res);
            res.writeHead(200, {
              'Content-Type': 'application/json'
            })
            res.end(JSON.stringify({ "msg": result[0].id, status: 1 }))
          });
        } else {
            res.writeHead(200, {
            'Content-Type': 'application/json'
          })
          res.end(JSON.stringify({ "msg": "Invalid Credentials", status: 0 }))

        }

      }
    });
  });
});


// //Route to handle Post Request Call
// app.post('/login', function (req, res) {
//   let errorMsg;
//   console.log("Inside LogIn Post Request");
//   console.log("Req Body : ", req.body);
//   let con = mysql.createConnection(config);
//   con.connect(function (err) {
//     if (err) res.status(401).send({ "msg": err.message });
//     let sql = "Select id,email_id,pwd from handshake.User where email_id = '" + req.body.emailId + "'";
//     con.query(sql, function (err, result, fields) {
//       if (err) {
//         res.status(401).send({ "msg": err });
//       } else {
//         if (result.length > 0) {
//           bcrypt.compare(req.body.pwd, result[0].pwd, function (err, response) {
//             if (response) {
//               res.cookie('cookie', "admin", { maxAge: 900000, httpOnly: false, path: '/' });
//             } else {
//               res.writeHead(200, {
//                 'Content-Type': 'application/json'
//               })
//               res.end(JSON.stringify({ "msg": "Invalid Credentials", status: 0 }))
//             }
//             res.writeHead(200, {
//               'Content-Type': 'application/json'
//             })
//             res.end(JSON.stringify({ "msg": "success",id: result[0].id, status: 1 }))
//           });
//         } else {
//           res.writeHead(200, {
//             'Content-Type': 'application/json'
//           })
//           res.end(JSON.stringify({ "msg": "Invalid Credentials", status: 0 }))
//         }
//       }
//     });
//   });
// });

//getting eductation req
app.post('/getEducationDetails',function(req,res){
 // console.log("getting eductation req"+ req.body);
  let con = mysql.createConnection(config);
  let sql = "select * from StudentEducationDetails where user_id = '"+ req.body.uid+"'";

  con.connect(function(err){
    if(err) {
      res.status(401).send({ "msg": err.message });
    } else {
      con.query(sql,function(error,result,fields){
        if(error) 
        res.status(401).send({ "msg": error.message });
        else {
          //console.log("Getting edu data"+ JSON.stringify(result));        
        }
        res.writeHead(200, {
          'Content-Type': 'application/json'
        })
        res.end(JSON.stringify(result));
      });
    }
  });
})


//Getting WorkExperience 
app.post('/getWorkExpDetails',function(req,res){
  // console.log("getting eductation req"+ req.body);
   let con = mysql.createConnection(config);
   let sql = "select * from WorkExperienceDetail where user_id = '"+ req.body.uid+"'";
   console.log(sql);
   con.connect(function(err){
     if(err) {
       res.status(401).send({ "msg": err.message });
     } else {
       con.query(sql,function(error,result,fields){
         if(error) 
         res.status(401).send({ "msg": error.message });
         else {
           //console.log("Getting edu data"+ JSON.stringify(result));        
         }
         res.writeHead(200, {
           'Content-Type': 'application/json'
         })
         res.end(JSON.stringify(result));
       });
     }
   });
 })
 


// Update Contact Details

app.post('/setContactDetail',function(req,res){

  console.log("Putting Contact Details");
  let con = mysql.createConnection(config);
  
  let sql = "update StudentDetails set phone_num='"+ req.body.phoneNum +"' ,email_id ='"+ req.body.emailId +"' where id='"+req.body.id+"'";

  console.log(sql);

  con.connect(function(err){
    if(err) {
      res.status(401).send({ "msg": err.message });
    } else { 
      con.query(sql,function(error,result){
        if(error)
        res.status(401).send({ "msg": error.message });
        else {
          res.status(200).send({ "msg": "Successful" });
        }
      });
    }
  });

})

//CareerObjective update

app.post('/setCareerObj',function(req,res){

  console.log("Putting Career Objective"+ req.body.careerObj);
  let con = mysql.createConnection(config);
  
  let sql = "update StudentDetails set careerObj='"+ req.body.careerObj +"' where id='"+req.body.id+"'";

  console.log(sql);

  con.connect(function(err){
    if(err) {
      res.status(401).send({ "msg": err.message });
    } else { 
      con.query(sql,function(error,result){
        if(error)
        res.status(401).send({ "msg": error.message });
        else {
          res.status(200).send({ "msg": "Successful" });
        }
      });
    }
  });

})


//Update basic details
app.post('/setbasicDetail',function(req,res){

  console.log("Putting Basic Data");
  let con = mysql.createConnection(config);
  
  let sql = "update StudentDetails set fname='"+ req.body.fname +"' ,lname ='"+ req.body.lname +"',city='" + req.body.city +"' , state='"+ req.body.state +"',country= '"+ req.body.country +"',birthDate ='"+ req.body.birthdate+"' where id='"+req.body.id+"'";

  console.log(sql);

  con.connect(function(err){
    if(err) {
      res.status(401).send({ "msg": err.message });
    } else { 
      con.query(sql,function(error,result){
        if(error)
        res.status(401).send({ "msg": error.message });
        else {
          res.status(200).send({ "msg": "Successful" });
        }
      });
    }
  });
})

//delete education details
app.post('/deleteEducationDetail',function(req,res){

  console.log("Putting Basic Data");
  let con = mysql.createConnection(config);
  
  let sql = "delete from StudentEducationDetails where id='"+req.body.id+"'";// and user_id ='"+ req.body.student_id+"'";

  console.log(sql);

  con.connect(function(err){
    if(err) {
      res.status(401).send({ "msg": err.message });
    } else { 
      con.query(sql,function(error,result){
        if(error)
        res.status(401).send({ "msg": error.message });
        else {
          res.status(200).send({ "msg": "Successful" });
        }
      });
    }
  });
})


//delete  WorkExperience details
app.post('/deleteWorkExpDetail',function(req,res){

  console.log("Delete Work Exp");
  let con = mysql.createConnection(config);
  
  let sql = "delete from WorkExperienceDetail where id='"+req.body.id+"'";

  console.log(sql);

  con.connect(function(err){
    if(err) {
      res.status(401).send({ "msg": err.message });
    } else { 
      con.query(sql,function(error,result){
        if(error)
        res.status(401).send({ "msg": error.message });
        else {
          res.status(200).send({ "msg": "Successful" });
        }
      });
    }
  });
})


//Update WorkExperience Details
app.post('/updateWorkExpDetail',function(req,res){

  console.log("Update education details");
  let con = mysql.createConnection(config);
  
  let sql = "Update WorkExperienceDetail set location= '"+ req.body.loc+"',company_name='"+ req.body.companyName +"',title =' "+ req.body.title +"' ,start_date='"+ req.body.start_date +"' ,end_date ='"+ req.body.end_date  +"',description='"+ req.body.desc+"'  where id='"+req.body.id+"'";

  console.log(sql);

  con.connect(function(err){
    if(err) {
      res.status(401).send({ "msg": err.message });
    } else { 
      con.query(sql,function(error,result){
        if(error)
        res.status(401).send({ "msg": error.message });
        else {
          res.status(200).send({ "msg": "Successful" });
        }
      });
    }
  });
})


//Insert Work Education Details 
app.post('/submitWorkExpDetails',function(req,res){
  console.log(" Updating work"+req.body);
  let con = mysql.createConnection(config);
  
  let sql = "insert into WorkExperienceDetail (company_name,title,start_date,end_date,description,location,user_id) values ('"+ req.body.companyName +"',' "+ req.body.title +"' ,'"+ req.body.start_date +"' ,'"+ req.body.end_date  +"','"+ req.body.desc+"','"+ req.body.loc+"','"+ req.body.user_id+"')";

  console.log(sql);
  con.connect(function(err){
    if(err) {
      res.status(401).send({ "msg": err.message });
    } else { 
      con.query(sql,function(error,result){
        if(error)
        res.status(401).send({ "msg": error.message });
        else {
          res.status(200).send({ "msg": "Successful" });
        }
      });
    }
  });
})




//update education details
app.post('/updateEducationDetail',function(req,res){

  console.log("Update education details");
  let con = mysql.createConnection(config);
  
  let sql = "Update StudentEducationDetails set college_name='"+ req.body.collegeName +"',degree =' "+ req.body.degree +"' ,major='"+ req.body.major +"' ,yearOfPassing ='"+ req.body.yearOfPassing  +"',cgpa='"+ req.body.cgpa+"'  where id='"+req.body.id+"'";

  console.log(sql);

  con.connect(function(err){
    if(err) {
      res.status(401).send({ "msg": err.message });
    } else { 
      con.query(sql,function(error,result){
        if(error)
        res.status(401).send({ "msg": error.message });
        else {
          res.status(200).send({ "msg": "Successful" });
        }
      });
    }
  });
})



//Routes to post submitEducationDetails

app.post('/submitEducationDetails',function(req,res){
  console.log(" Inserting education data"+req.body);
  let con = mysql.createConnection(config);
  
  let sql = "insert into StudentEducationDetails (college_name,degree,major,yearOfPassing,cgpa,user_id) values ('"+ req.body.collegeName +"',' "+ req.body.degree +"' ,'"+ req.body.major +"' ,'"+ req.body.yearOfPassing  +"','"+ req.body.cgpa+"'  ,'"+ req.body.user_id+"')";

  console.log(sql);
  con.connect(function(err){
    if(err) {
      res.status(401).send({ "msg": err.message });
    } else { 
      con.query(sql,function(error,result){
        if(error)
        res.status(401).send({ "msg": error.message });
        else {
          res.status(200).send({ "msg": "Successful" });
        }
      });
    }
  });
})


//Route to get All studentProfileDetail when user visits the Home Page
app.post('/studentProfileDetail', function (req, res) {
  console.log("Getting Profile Data"+req.body.uid);
  let con = mysql.createConnection(config);
  
  let sql = "select * from StudentDetails where user_id= "+  req.body.uid;

  con.connect(function(err){

    if(err) {
      res.status(401).send({ "msg": err.message });
    } else {
      con.query(sql, function(error,result,fields){
          if(error) {
            res.status(401).send({ "msg": error.message });
          } else {
            res.writeHead(200, {
              'Content-Type': 'application/json'
            })
            res.end(JSON.stringify(result[0]));
          }     
      });
    }
  });
})
//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");

module.exports = app;
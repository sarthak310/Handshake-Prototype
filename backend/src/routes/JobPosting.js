var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
const config = require('../../config');
var multer = require('multer')
var cors = require('cors');
const mime = require('mime/lite');  

const fileFilter = (req,file,cb) => {
    if(file.mimetype === 'pdf' ||file.mimetype === 'txt')
        cb(null,true);
    else    
        cb(null,false);
};

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
  
    cb(null,   Date.now() + file.originalname)

  }
})

var upload = multer({ storage: storage  }).single('file')


router.post('/jobPosting',function(req,res){
  
    console.log("get Job Posting");
    let con = mysql.createConnection(config);
  
    let sql = "insert into Job(job_title, job_desc, posting_date,deadline, salary,location ,job_category ,user_id) values ('"+ req.body.title +"', '"+ req.body.desc +"','"+ new Date().toISOString().slice(0,10) +"' ,'"+ req.body.deadline +"','"+ req.body.salary +"','"+ req.body.loc +"','"+ req.body.job_type+"','"+ req.body.user_id +"')";
    
    console.log(sql);
    con.connect(function(err){
        if(err) 
            res.status(401).send(err);
        con.query(sql,function(error,result,field) {
            if(error)
                res.status(401).send(error);
            else {
                res.status(200).send(JSON.stringify(result[0]));
            }
        })
    })   
})

// student  - apply for job 
router.post('/applyForJob', function(req,res) {
    //console.log("Inside Apply Job " + checkSql);
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log("MulterError ");
           return res.status(500).json(err)
        } else if (err) {
            console.log("Just err ");
           return res.status(500).json(err)
        } else {
            console.log(req.file);
           // let filepath =  req.file.path.split('\\').join('\\\\');
           let checkSql = "select id from StudentJobStatus where job_id =" +req.body.jid+" and user_id =" +req.body.student_userId;
    
            let con = mysql.createConnection(config);
            let sql = "CALL insert_jobStatus(?,?,?)"
        //    let sql = "insert into studentjobstatus(job_id, user_id, resume) values ('"+ req.body.jid +"', '"+ req.body.student_userId +"','"+ req.file.filename +"')";  
            con.connect(function(err) {
                if(err) 
                    res.status(401).send(err);

                con.query(checkSql, function(error,result,fields){
                    console.log(checkSql);
                    if(error) 
                        res.status(401).send(error);
                    else {
                        console.log(result);
                        if(!(result.length > 0)) {
                            console.log("Not applied before");
                            con.query(sql,[req.body.jid,req.body.student_userId,req.file.filename],function(sqlerror,result) {
                                if(sqlerror)
                                    res.status(401).send({"msg" : sqlerror});
                                res.status(200).send("Successful");    
                            })
                        } else {
                            console.log(" applied before");
                            res.status(200).send({"msg" : "Already applied"});
                        }       
                    }    
                });    
            })
        }
    })
})
//Get all students with JobId
router.post('/getStudentsWithJobId', function(req,res){
    console.log("Get Students With JobId ");
    let con = mysql.createConnection(config);
  
    let sql = "SELECT ss.id as status_id,sd.user_id as uid,ss.resume, ss.job_status as status,sd.id,concat(sd.fname,' ',sd.lname) as name, sd.major ,sd.school,sd.profile as profile  FROM StudentJobStatus as ss ,StudentDetails as sd where ss.user_id = sd.user_id and ss.job_id="+ req.body.id;
    console.log(sql);

    con.connect((err) => {
        if(err)
            res.status(401).send(err);
        con.query(sql,(error, result, fields)=> {
            if (error)
            res.status(401).send(error);
        else 
            res.status(200).send(JSON.stringify(result));
        })
    })
})

//Get all Jobs applied by student
router.post('/getAppliedJobs', (req,res) => {
    
    console.log("get Jobs applied by student ");

    let con = mysql.createConnection(config);
  
    let sql = "Select j.id as jid,c.c_name,c.c_profile,j.job_title,j.job_category,j.location,j.deadline,sjs.applied_date,sjs.job_status from Job j , StudentJobStatus sjs, CompanyProfile c where sjs.user_id='"+ req.body.user_id +"' and j.id = sjs.job_id and c.user_id= j.user_id";
   
    console.log(sql);
    con.connect(function(err){
       if(err)
            res.status(401).send(err);
       con.query(sql, function (error, result, fields) {
        if (error)
            res.status(401).send(error);
        else 
            res.status(200).send(result);
      });
    })

})
//Get All Jobs
router.get('/getAllJobs', (req,res) => {
   
    
    let con = mysql.createConnection(config);
    let jobCategory = (!!req.query.searchCategory) ? "and j.job_category in (\""+  req.query.searchCategory.split(',').join("\",\"") +"\")" : "";

    console.log("get All Job ", req.query.searchCategory);

    let sql ="SELECT j.id as jid, j.job_title as title, j.job_desc as descrip,j.salary as salary ,j.posting_date , j.deadline,j.job_category ,c.c_name,c.c_profile, j.user_id FROM Job j, CompanyProfile c  where c.user_id = j.user_id and (c.c_name like '%"+ req.query.searchName +"%' or job_title like '%"+ req.query.searchName +"%') and j.location like '%"+req.query.searchLocation+"%'"+ jobCategory +"";
    console.log(sql);
    con.connect(function(err){
       if(err)
            res.status(401).send(err);
       con.query(sql, function (error, result, fields) {
        if (error)
            res.status(401).send(error);
        else 
            res.status(200).send(result);
      });
    })
})

//Update Application Status
router.post('/updatestudentStatus', function(req,res) {
    console.log("update basic data");
            
   let con = mysql.createConnection(config);
   let sql = "update StudentJobStatus set job_status ='" + req.body.status +" 'where id="+req.body.status_id;
           
    console.log(sql);
    con.connect(function(err){
        if(err) 
            res.status(401).send(err);
        con.query(sql,function(error,result) {
        if(error)
            res.status(401).send(error);
        else {
            res.status(200).send(result);
            }
        })
    })
})

module.exports = router;
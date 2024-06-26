var express = require('express');
var router = express.Router();
const config = require('../../config');
const mysql = require('mysql2');
var multer = require('multer')
var cors = require('cors');
const mime = require('mime/lite');  

const fileFilter = (req,file,cb) => {
    if(file.mimetype === 'image/jpeg' ||file.mimetype === 'image/png')
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

var upload = multer({ storage: storage ,fileFilter : fileFilter }).single('file')


router.post('/demoupload',function(req, res) {
     
    console.log("Uploading demo file");
    
    upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
            } else if (err) {
               return res.status(500).json(err)
            }
        return res.status(200).send(req.file)
    })
});

router.post('/getCompanyData',function(req,res){
  
    console.log("get all data");
    let con = mysql.createConnection(config);
  
    let sql = "Select * from CompanyProfile where user_id="+req.body.uid;
    console.log(sql);
    con.connect(function(err){
        if(err) 
            res.status(401).end(err);
        con.query(sql,function(error,result,field) {
            if(error)
                res.status(401).end(error);
            else {
                //console.log(result);
                res.status(200).send(JSON.stringify(result[0]));
            }
        })
    })   
})

//Update Comapny desc
router.post('/updateDesc', function(req,res) {
    console.log("update data");
    let con = mysql.createConnection(config);
  
    let sql = "update CompanyProfile set c_description = ' "+ req.body.desc+ "' where id="+req.body.id;
    con.connect(function(err){
        if(err) 
            res.status(401).send(err);
        con.query(sql,function(error,result) {
            if(error)
                res.status(401).send(error);
            else {
                console.log(result);
                res.status(200).send(result);
            }
        })
    })
})

//Update Company Contact Info
router.post('/updateContactDetail', function(req,res) {
    console.log("update data");
    let con = mysql.createConnection(config);
  
    let sql = "update CompanyProfile set c_website = ' "+ req.body.website + "',c_phone='"+ req.body.phoneNum+"',email_id='"+ req.body.emailId+"' where id="+req.body.id;
    con.connect(function(err){
        if(err) 
            res.status(401).send(err);
        con.query(sql,function(error,result) {
            if(error)
                res.status(401).send(error);
            else {
                console.log(result);
                res.status(200).send(result);
            }
        })
    })
})


//Update Company Basic Info
router.post('/updateBasicDetail', function(req,res) {
    console.log("update basic data"+ req.file);

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
           return res.status(500).json(err)
        } else if (err) {
           return res.status(500).json(err)
        } else {
            let con = mysql.createConnection(config);
  
            let sql = "update CompanyProfile set c_profile = ' "+ req.file.filename + "',location='"+ req.body.loc+"' where id="+req.body.id;
           
            console.log(sql);
            con.connect(function(err){
                if(err) 
                    res.status(401).send(err);
                con.query(sql,function(error,result) {
                    if(error)
                        res.status(401).send(error);
                    else {
                        console.log(result);
                        res.status(200).send(result);
                    }
                })
            })
        }
    })


})


//Get All Jobs Posted By Company
router.post('/getAllJobsByCompanyId', (req,res) => {
   
    console.log("get All Job with this company");
    let con = mysql.createConnection(config);
  
    let sql = "SELECT j.id as jid, j.location,j.job_title as title, j.job_desc as descrip,j.salary as salary ,j.posting_date , j.deadline,j.job_category FROM Job as j  where user_id = " + req.body.user_id;
   // let sql = "SELECT * FROM Job as j , CompanyProfile as cp where j.c_id = cp.id and cp.user_id "+ req.body.user_id;
     console.log(sql);

    con.connect((err) => {
        con.query(sql,(error, result, fields)=> {
            if (error)
            res.status(401).send(error);
        else 
            res.status(200).send(JSON.stringify( result));
        })
    })
})

//Get All Events Posted By Company
router.post('/getAllEventsByUserId', (req,res) => {
   
    console.log("get All Events with this company");
    let con = mysql.createConnection(config);
  
    let sql = "SELECT * FROM Events where user_id = "+ req.body.user_id;
    console.log(sql);

    con.connect((err) => {
        con.query(sql,(error, result, fields)=> {
            if (error)
            res.status(401).send(error);
        else 
            res.status(200).send(JSON.stringify( result));
        })
    })
})

// //Get All Students with CompanyId
// router.post('/getStudents', function(req,res){
//     console.log("get All Job ");
//     let con = mysql.createConnection(config);
  
//     let sql = "select * from Job where job_id="+ req.body.jid;
//     console.log(sql);

//     con.createConnection((err) => {
//         con.query(sql,(error, result, fields)=> {
//             if (error)
//             res.status(401).send(error);
//         else 
//             res.status(200).send(JSON.stringify( result[0]));
//         })
//     })
// })


module.exports = router;
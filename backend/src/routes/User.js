var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
const config = require('../../config');
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


router.post('/uploadProfilePhoto',function(req, res) {
     
    console.log("Uploading demo file");
    
    upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
            } else if (err) {
               return res.status(500).json(err)
            } 

            let con = mysql.createConnection(config);

            let sql = "update StudentDetails set profile='"+ req.file.filename +"' where id =" + req.body.id ;
             console.log(sql);

             con.connect((err) =>{
                if(err)
                    res.status(401).send({"msg" : err});
                con.query(sql,(error,result)=> {
                    if(error)
                         res.status(401).send({"msg" : err});
                    else 
                        res.status(200).send({"msg" :"Success"});     
                })    
             })
            
            
    })
});



//Get Student Skills
router.get('/getSkills',(req,res) => {
    console.log("get Skills Of Student ");
    let con = mysql.createConnection(config);

   let sql = "select id,skills from StudentDetails where user_id =" + req.query.user_id ;
    console.log(sql);
    con.connect(function(err){
       if(err)
            res.status(401).send(err);
       con.query(sql, function (error, result, fields) {
        if (error)
            res.status(401).send(error);
        else {
            console.log(result);
            res.status(200).send(result[0]);
        }  
      });
    })
})


//set skill of student
router.post('/setskills',(req,res) => {
    console.log("update Student skills " , req.body.skills);
    let con = mysql.createConnection(config);

    let sql = "update StudentDetails set skills ='"+req.body.skills+"' where id ="+ req.body.id;
    console.log(sql);
    con.connect(function(err){
        if(err)
            res.status(401).send({"msg":err});
        con.query(sql,function(error,result){
            if(error)
                res.status(401).send({"msg" : error});
            else
                res.status(200).send({"msg":"successful"});    
        });    
    })

})

router.get('/getAllStudents',(req,res) =>{
    
    console.log("get All Students ");
    let con = mysql.createConnection(config);

    let fname =  req.query.name === undefined ? '': req.query.name;
    let school =  req.query.school === undefined ? '': req.query.school;
    let major =  req.query.major === undefined ? '': req.query.major;

    let sql ="SELECT  s.id,s.school,s.major,s.profile,concat(s.fname,' ',s.lname) as name,s.user_id as uid FROM studentdetails s where s.fname like '%"+ fname+"%' and s.school like '%"+ school+"%' and s.major like '%"+major+"%'";
    console.log(sql);
    con.connect(function(err){
       if(err)
            res.status(401).send(err);
       con.query(sql, function (error, result, fields) {
        if (error)
            res.status(401).send(error);
        else {
            console.log(result);
            res.status(200).send(result);
        }  
      });
    })
})


//Get All Students For Comapany
router.get('/getAllStudentsForComapany', (req,res) => {
   
    console.log(" Get Student Company filter",req.body);
    let con = mysql.createConnection(config);
    
   let sql ="SELECT  s.id,s.school,s.major,s.profile,concat(s.fname,' ',s.lname) as name,s.user_id as uid FROM StudentDetails s where (s.fname like '%"+ req.query.searchName +"%' or s.lname like '%"+ req.query.searchName +"%') and s.skills like '%"+ req.query.searchSkills +"%'and s.school like '%"+ req.query.searchSchool +"%'";
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



module.exports = router;
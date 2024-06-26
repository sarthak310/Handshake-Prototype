var express = require('express');
var router = express.Router();
const config = require('../../config');
const mysql = require('mysql2');

router.post('/insertstudentStatus', function(req,res) {
    console.log("update basic data");
            
   let con = mysql.createConnection(config);

   // set job status 1 for pending 
   let sql = "insert into StudentJobStatus(job_id,student_id,job_status) values('"+ req.body.j_id +"','"+ req.body.s_id+"',1)";          
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
})

module.exports = router;

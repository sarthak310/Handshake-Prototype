var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
const config = require('../../config');

//create new event
router.post('/createNewEvent', (req, res) => {

    console.log("create new event" + req.body);
    let con = mysql.createConnection(config);
    let sql = "insert into Events(e_name,e_desc,time,date,location,eligibility,user_id) values ('" + req.body.name + "','" + req.body.desc + "','" + req.body.etime + "','" + req.body.edate + "','" + req.body.loc + "','" + req.body.eligibility + "' ,'" + req.body.userId + "')";
    console.log(sql);
    con.connect(function (err) {
        if (err)
            res.status(401).send(err);
        con.query(sql, function (error, result) {
            if (error)
                res.status(401).send(error);
            else {
                res.status(200).send("Susseccful");
            }
        })
    })
})


// Apply for Event
router.post('/rsvpevent', (req, res) => {

    console.log("RSVP in event", req.body);
    let con = mysql.createConnection(config);
    let check = "select major from StudentDetails where user_id = " + req.body.userId;
    let sql = "insert into EventRegisterStatus(event_id,user_id,status) values('" + req.body.eid + "','" + req.body.userId + "',1)";
    console.log(sql);
    con.connect(function (err) {
        if (err)
            res.status(401).send(err);
        if (req.body.eligibility !== 'All') {
            console.log("eligibility is" + req.body.eligibility);
            con.query(check, function (error, result) {
                if (error)
                    res.status(401).send({ "msg": error });
                else if (result.major != req.body.eligibility) {
                    console.log("eligibility match is", result.major !== req.body.eligibility);
                    res.status(200).send({ "msg": "Sorry !This event is for " + req.body.eligibility + " major Only" });
                } else {
                    con.query(sql, function (erro, result) {
                        if (erro)
                            res.status(401).send({ "msg": erro });
                        else
                            res.status(200).send({ "msg": "Successful" });
                    });
                }
            });
        } else {
            con.query(sql, function (erro, result) {
                if (erro)
                    res.status(401).send({ "msg": erro });
                else
                    res.status(200).send({ "msg": "Successful" });
            });
        }

    })
})


//Get list of student registered for events
router.post('/getregisteredStudents', (req, res) => {
    console.log("Get Students With JobId " + req.body.id);
    let con = mysql.createConnection(config);

    let sql = "select es.id as status_id,sd.user_id as uid,sd.id,concat(sd.fname,' ',sd.lname) as name, sd.major ,sd.school,sd.profile as profile  from EventRegisterStatus as es ,StudentDetails sd where es.user_id = sd.user_id and es.event_id =" + req.body.id;
    //console.log(sql);

    con.connect((err) => {
        if (err)
            res.status(401).send(err);
        con.query(sql, (error, result, fields) => {
            if (error)
                res.status(401).send(error);
            else
                res.status(200).send(JSON.stringify(result));
        })
    })
})


//Get registerd events 
router.get('/getRegisteredEvents', (req, res) => {

    console.log("get registered Events by students");
    let con = mysql.createConnection(config);

    let sql = "select e.id as id,e.e_name,e.e_desc,e.time,e.date,e.location,e.eligibility,es.status from events e, eventregisterstatus es where e.id = es.event_id and es.user_id =" + req.query.user_id;
  //  console.log(sql);
    con.connect(function (err) {
        if (err)
            res.status(401).send(err);
        con.query(sql, function (error, result, fields) {
            if (error)
                res.status(401).send(error);
            else {
               // console.log(result);
                res.status(200).send(result);
            }
        });
    })
})

//Get all Events 
router.get('/getAllEvents', (req, res) => {

    console.log("get All Events ");
    let con = mysql.createConnection(config);

    let sql = "SELECT * FROM Events where date>=CURDATE() order by date asc";
    
   console.log(sql);
    con.connect(function (err) {
        if (err)
            res.status(401).send(err);
        con.query(sql, function (error, result, fields) {
            if (error)
                res.status(401).send(error);
            else {
                //console.log(result);
                res.status(200).send(result);
            }
        });
    })
})

module.exports = router;
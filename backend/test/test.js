var app = require('../index');
var chai = require('chai');
chai.use(require('chai-http'));
var expect = chai.expect;

var agent = require('chai').request.agent(app);

describe('HandShake Test Cases', function() {


    it('check LogIn For Comapny',function(done){
        // this.timeout(10000);
         agent.post('/login')
            .send({"emailId" : "k@k.com","userType": 2,"pwd" :"abcd"})
             .then(function(res){
                 console.log(res.body);
                 expect(res.body.msg).to.equal(2);
                 done();
             })
             .catch((e) => {
                 done(e);
             });
     });

     it('check LogIn For Company with wrong userType',function(done){
        // this.timeout(10000);
         agent.post('/login')
            .send({"emailId" : "k@k.com","userType": 1,"pwd" :"abcd"})
             .then(function(res){
                 console.log(res.body);
                 expect(res.body.msg).to.equal("Invalid Credentials");
                 done();
             })
             .catch((e) => {
                 done(e);
             });
     });

    it('Get All Events as array',function(done){
        // this.timeout(10000);
         agent.get('/event/getAllEvents')
             .then(function(res){
                 console.log(res.body);
                 expect(res.body).to.be.an('array');
                 done();
             })
             .catch((e) => {
                 done(e);
             });
     });

     it('Get All Jobs as array',function(done){
        // this.timeout(10000);
         agent.get('/job/getAllJobs')
         .query({"searchCategory" : '',"searchName" : "H","searchLocation":""})
             .then(function(res){
                 console.log(res.body);
                 expect(res.body).to.be.an('array');
                 done();
             })
             .catch((e) => {
                 done(e);
             });
     });

     it('Get Registered Event as array',function(done){
        // this.timeout(10000);
         agent.get('/event/getRegisteredEvents')
            .query({"user_id" : 1})
             .then(function(res){
                 console.log(res.body);
                 expect(res.body).to.be.an('array');
                 done();
             })
             .catch((e) => {
                 done(e);
             });
     });



});
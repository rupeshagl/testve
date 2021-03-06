var express = require('express');
var router = express.Router();
var pg = require('pg');
var path = require('path');
var Combinatorics = require('js-combinatorics');
var request = require('request'),
_ = require("lodash"),
csv = require("fast-csv"),
csvStream = csv.format({
	headers: true
}),
fs = require("graceful-fs");
var connectionString = process.env.DATABASE_URL || 'postgres://postgres:rupesh@123@localhost:5432/mytestdb';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/v1/import', (req, res, next) => {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      //console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    //Read file from URL
    request.get('http://localhost:3000/my.csv', function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	        // Continue with your processing here.
	        var query;
	        var csvStream = csv.fromString(body, {headers: true})

			.on("data", function(data) {
		 		if(data.clientId){
		 			// SQL Query > Select Data
				    query = client.query('SELECT clientId FROM clients where clientId=($1);',[data.clientId]);
				    // Stream results back one row at a time
				    query.on('row', (row) => {
				      //check clientId exist or not.
				      if(row.clientid) {
				      	 client.query('INSERT INTO orders(orderId, clientId, reuqest, duration) values($1, $2, $3, $4)',
    						[data.orderId, data.clientId, data.requset, data.duration]);
				      }
				    });
		 		}
			})
		    .on("end", function(){
		    	res.status(200).json({success: true, result: "result"});
		    });
	    } else {
	    	return res.status(500).json({success: false, data: error});
	    }
	});
  });
});



// For assign butlers
router.get('/api/v1/assignRequest', (req, res, next) => {
	var eRequests = [
	    {
	        clientId: 1,
	        requestId: 'abc',
	        hours: 6
	    },
	    {
	        clientId: 2,
	        requestId: 'ghi',
	        hours: 1
	    },
	    {
	        clientId: 1,
	        requestId: 'def',
	        hours: 4
	    },
	    {
	        clientId: 1,
	        requestId: 'zzz',
	        hours: 2
	    }
	]
/

	function allocateAndReport(requests) {

		var output = {butlers : [], spreadClientIds : []}, reqObj = {}, spreadClientIds = [];;
		var cmb, a;
		cmb = Combinatorics.power(requests);
		cmb.forEach(function(a){ 
			if(a.length > 1) {
				var hours = 0;
				reqObj = {requests:[]}
			a.forEach(function(b){	
				hours +=b.hours;
				output.spreadClientIds.push(b.clientId);
				reqObj.requests.push(b.requestId)
			}) 
			if(hours < 9 ) output.butlers.push(reqObj);
		}
		});
		output.spreadClientIds = _.uniq(output.spreadClientIds);
	    res.status(200).json({success: true, result: output});
	    
	}

	allocateAndReport(eRequests);
});

module.exports = router;

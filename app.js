var express = require('express');
var Promise = require('bluebird');
var _ = require('underscore');
var app = express();
var server = require('http').Server(app);
var port = process.env.PORT || 5000;

var data = {
	key: 'value', 
	hello: 'world',
	arr: _.range(5),
	test_url: '' + process.env.TEST_URL,
	version :process.version,
	
};

app.get('/', function(req, res){
    res.writeHead(200, {"Content-Type": "application/json"});
    //res.write("<h2>Hello World</h2>");
    res.write(JSON.stringify(data));
	res.end();
});

app.get('/test', function(req, res){
	console.log('test page');
	testDelay().then(function(rs){

		res.writeHead(200, {"Content-Type": "text/html"});
		res.write('<h2>Hello Test -> ' + rs + '</h2>');
		res.end();
	});
});

app.get('/test2', function(req, res){
	getTest2().then(function(rs){

		res.writeHead(200, {"Content-Type": "text/html"});
		res.write(rs);
		res.end();
	});
});


app.get('/db', function(req, res){
try{
	
	var pg = require('pg');
	
	console.log('test db');

	pg.defaults.ssl = true;
	pg.connect(process.env.DATABASE_URL, function(err, client) {
	  if (err){
		 //throw err;
		 console.log('Error---> ' + err);
		 res.writeHead(200, {"Content-Type": "text/html"});
		 res.write('Error---> ' + err);
		 res.end();
		 return;
	  }  
	  console.log('Connected to postgres! Getting schemas...');

	  client
		//.query('SELECT table_schema,table_name FROM information_schema.tables;')
		.query('select * from test1;')
		.on('row', function(row) {
		    res.writeHead(200, {"Content-Type": "text/html"});
			res.write(JSON.stringify(row));
			console.log(JSON.stringify(row));
			res.end();
		});
	});
}catch(err){
	res.writeHead(200, {"Content-Type": "text/html"});
	res.write(JSON.stringify(err));
	res.end();
}

});

function testDelay(){
	return Promise.delay(1000).then(function(){
		return 'delay result';
	});
}

function getTest2(){
var pg = require('pg');
return new Promise(function(resolve, reject){

	var client = new pg.Client(process.env.DATABASE_URL);

	// connect to our database
	client.connect(function (err) {
	  if (err){
		  reject(err);
	  } else {
	  
	 
		  client.query('SELECT * from test2', function (err, result) {
			  if (err){
				  reject(err);
			  } else {

			
				// disconnect the client
				client.end(function (err) {
				  if (err){
					  reject(err);
				  } else {
					 resolve(result);  
				  }
				});
			   }
		  });
	   }
	});
});
}



server.listen(port, function(){
	console.log('socket on *:' + port)
});

process.on('uncaughtException', function(error) {
    console.error('Caught exception: ' + error);
});
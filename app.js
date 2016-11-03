var express = require('express');
var _ = require('underscore');
var app = express();
var server = require('http').Server(app);
var port = process.env.PORT || 5000;

var data = {
	key: 'value', 
	hello: 'world',
	arr: _.range(5),
	database_url: '' + process.env.DATABASE_URL,
	
};

app.get('/', function(req, res){
    res.writeHead(200, {"Content-Type": "application/json"});
    //res.write("<h2>Hello World</h2>");
    res.write(JSON.stringify(data));
	res.end();
});

app.get('/test', function(req, res){
	console.log('test page');
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write("<h2>Hello Test</h2>");
	res.end();
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
		.query('SELECT table_schema,table_name FROM information_schema.tables;')
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

server.listen(port, function(){
	console.log('socket on *:' + port)
});

process.on('uncaughtException', function(error) {
    console.error('Caught exception: ' + error);
});
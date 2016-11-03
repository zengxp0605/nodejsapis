var express = require('express');
var _ = require('underscore');
var app = express();
var server = require('http').Server(app);
var port = process.env.PORT || 5000;

var data = {
	key: 'value', 
	hello: 'world',
	arr: _.range(10),
};

app.get('/', function(req, res){
    res.writeHead(200, {"Content-Type": "application/json"});
    //res.write("<h2>Hello World</h2>");
    res.write(JSON.stringify(data));
	res.end();
});

server.listen(port, function(){
	console.log('socket on *:' + port)
});
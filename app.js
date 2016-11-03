var express = require('express');
var app = express();
var server = require('http').Server(app);
var port = process.env.PORT || 5000;

var data = {key: 'value', hello: 'world'};

app.get('/', function(req, res){
    res.writeHead(200, {"Content-Type": "application/json"});
    //res.write("<h2>Hello World</h2>");
    res.write(JSON.stringify(data));
	res.end();
});

server.listen(port, function(){
	console.log('socket on *:' + port)
});
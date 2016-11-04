var express = require('express');
var Promise = require('bluebird');
var _ = require('underscore');
var app = express();
var server = require('http').Server(app);
var isProdDB = process.env.NODE_PG_DB_PROD ? true : false;
var port = process.env.PORT || 5000;
var databaseUrl = process.env.PG_DATABASE_URL; // || 'postgres://postgres:123456@localhost:5432/postgres';
var testCount = 0;

var data = {
	key: 'value',
	hello: 'world',
	arr: _.range(5),
	test_url: '' + process.env.TEST_URL,
	PG_DATABASE_URL: '' + process.env.PG_DATABASE_URL,
	isProdDB: isProdDB,
	version: process.version,

};

//设置服务器跨域权限
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	next();
});

app.get('/', function (req, res) {
	res.writeHead(200, { "Content-Type": "application/json" });
	//res.write("<h2>Hello World</h2>");
	res.write(JSON.stringify(data));
	res.end();
});

app.get('/test', function (req, res) {
	console.log('test page');
	testCount++;
	testDelay().then(function (rs) {

		res.writeHead(200, { "Content-Type": "text/html" });
		res.write('<h2>Hello Test -> ' + rs + '</h2> count:' + testCount);
		res.end();
	});
});

app.get('/test2', function (req, res) {
	getTest2().then(function (rs) {

		res.writeHead(200, { "Content-Type": "application/json" });
		res.write(JSON.stringify(rs));
		res.end();
	});
});


app.get('/db', function (req, res) {
	var pg = require('pg');
	console.log('test db');
	isProdDB && (pg.defaults.ssl = true);
	pg.connect(databaseUrl, function (err, client) {
		if (err) {
			//throw err;
			console.log('Error---> ' + err);
			res.writeHead(200, { "Content-Type": "text/html" });
			res.write('Error---> ' + err);
			res.end();
			return;
		}
		console.log('Connected to postgres! Getting schemas...');

		client
			.query('SELECT table_schema,table_name FROM information_schema.tables;')
			//.query('select * from test1;')
			.on('row', function (row) {
				res.writeHead(200, { "Content-Type": "text/html" });
				res.write(JSON.stringify(row));
				console.log(JSON.stringify(row));
				res.end();
			});
	});
});

function testDelay() {
	return Promise.delay(1000).then(function () {
		return 'delay result';
	});
}

function getTest2() {
	var pg = require('pg');
	return new Promise(function (resolve, reject) {
		isProdDB && (pg.defaults.ssl = true);
		var client = new pg.Client(databaseUrl);
		// connect to our database
		client.connect(function (err) {
			if (err) {
				reject(err);
				return;
			}
			client.query('SELECT * from test2 where 1 = 1;', function (err, result) {
				if (err) {
					reject(err);
				} else {
					resolve(result.rows);
					// disconnect the client
					// client.end(function (err) {
					// 	if (err) {
					// 		reject(err);
					// 	} else {
					// 		resolve(result.rows);
					// 	}
					// });
				}
			});
		});
	});
}


server.listen(port, function () {
	console.log('socket on *:' + port)
});

process.on('uncaughtException', function (error) {
	console.error('Caught exception: ' + error);
});
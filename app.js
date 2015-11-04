var params = {
	scheme: process.env.VCAP_SIMPLICITE_SCHEME || 'http',
	host: process.env.VCAP_SIMPLICITE_HOST || 'demo.apps.simplicite.io',
	port: process.env.VCAP_SIMPLICITE_PORT || 80,
	root: process.env.VCAP_SIMPLICITE_ROOT || '',
	user: process.env.VCAP_SIMPLICITE_USER || 'admin',
	password: process.env.VCAP_SIMPLICITE_PASSWORD || 'admin',
	debug: true
};
var demo = require('simplicite').session(params);

var prd = demo.getBusinessObject('DemoProduct');

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
	console.log('Home page requested');
	prd.search(undefined, { inlineDocs: true }).then(function(list) {
		console.log(list.length + ' products loaded !');
		res.render('index', { products: JSON.stringify(list), });
	});
});

app.get('/user', function(req, res) {
	console.log('User page requested');
	demo.getGrant({ inlinePicture: true }).then(function(grant) {
		res.render('user', { grant: JSON.stringify(grant), });
	});
});

app.get('/health', function(req, res) {
	console.log('Health page requested');
	demo.getHealth().then(function(health) {
		res.render('health', health);
	});
});

var host = (process.env.VCAP_APP_HOST || 'localhost');
var port = (process.env.VCAP_APP_PORT || 3000);

app.listen(port, host);

console.log('Server listening on ' + host + ':' + port);
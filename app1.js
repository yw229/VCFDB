
/**
 * Module dependencies.
 */

var express = require('express');
//var routes = require('./routes');
//var user = require('./routes/user');
var http = require('http');
var path = require('path');

// added module dependencies 
var cons = require('consolidate') ;
var swig = require('swig') ;
var flowcells = require('./routes/flowcells') ; // key -- change the routes of client data query control 

// import data layer 
var dbUrl = 'mongodb://mongodb-1.nygenome.org/test';  
var mongoose = require('mongoose'); 
mongoose.connect(dbUrl) ;

// Express configuration 
var app = module.exports  = express();
app.engine('.html',cons.swig) ; // swig view engine 

app.configure( function() {
		app.set('port', process.env.PORT || 7180);
		app.set('view engine' , 'html');
		app.use(express.static(__dirname + '/public')) ;
		app.use(express.logger('dev')); 
		app.use(express.json());
		app.use(express.urlencoded());
		app.use(express.methodOverride());
		app.use(express.cookieParser()) ;
		app.use(express.bodyParser()) ;
		app.use(express.session( {secret: 'keyboard cat' } ) ) ;
		app.use( function(req, res, next){
				console.log('------');
				next() ;

		}) ;

		app.use(app.router) ;
}) ;

// all environments
//app.set('port', process.env.PORT || 3000);
//app.set('views', path.join(__dirname, 'views'));
/*app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

*/



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// application endpoint 
app.get('/' , flowcells.findAll) ;
//app.get('/flowcells/:flowcell_id', flowcells.findById) ; 
//app.post('/flowcells/', flowcells.post) ;
//app.put('/flowcells/:flowcell_id' , flowcells.put) ;
//app.delete('/flowcells/:flowcell_id' , flowcells.delete) ;

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/*
* Module dependencies 
*
*/

var     cons            = require('consolidate')
        ,express        = require('express')
        ,swig           = require('swig')
        //
        ,flowcells      = require('./routes/flowcells')
        //
        ,dbPath         =  //'mongodb://timessquare.nygenome.org/Analytics' ;//
                           'mongodb://mongodb-1.nygenome.org/test';



// import data layer , access to mongodb , build connection by using mongoose 
var mongoose = require('mongoose') ;
mongoose.connect(dbPath) ; 


// Express configuration 

var app = module.exports = express() ; 
app.engine('.html' , cons.swig) ; 


app.configure(function() {
        app.set('port', process.env.PORT || 7180);
        app.set('view engine', 'html');
        app.use(express.static(__dirname + '/public'));
        app.use(express.logger());
        app.use(express.cookieParser());
        app.use(express.bodyParser());
        app.use(express.session({ secret: 'keyboard cat' }));
        app.use(function(req, res, next) {
                console.log('-------------');
                next()
        });
        app.use(app.router);
});

app.use( express.errorHandler( { dumpExceptions: true , showStack: true } ) ) ; 

//--------------------
//Application Endpoint
//--------------------
var js = flowcells.findAll ; 
//console.log( typeof(js)) ; 
app.get('/' , js) ;
console.log( typeof( app.get('/' , js) )) ;

/*app.get('/:id', flowcells.findById) ;
app.get('/chr/:chr',flowcells.findByChr) ;
app.get('/pos/:pos',flowcells.findByPOS) ;
app.get('/ref/:ref', flowcells.findByRef) ;
app.get('/alt/:alt', flowcells.findByAlt) ;
*/
app.get('/page/' , function(req, res){
        res.render('page')

    }) ; 

app.get('/tb/', function(req, res) 
    {
        res.render('tb') ; 
    }
    ) ;
app.get('/test', function(req, res) 
                    { 
                    mongoose.connection.db.eval('db.NSFP.find().limit(10).toArray()' , function(err,v)
                    {
                        if(err)
                            coonsole.log() ; 
                        else
                            res.json(v) ; 

                    } ) ;

   } );


// create server 
app.listen(app.get('port'), function(){
        console.log("Express server listening on port " + app.get('port'));
});



// Create the server 


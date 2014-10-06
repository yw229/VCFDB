// DB connections and Schema Design 

/*
* Module dependencies 
in the  apps.js flowcells = require('./routes/flowcells') ; 
Using mongoose to build up the Schema 
*
*/

var mongoose    = require('mongoose');

var Schema      = mongoose.Schema;
var ObjectId 	= Schema.Types.ObjectId ; 

// Model Schema 
var Flowcell = new Schema
(	{
		"_id" : ObjectId,
		"#chr" : { type: Number, min: 0 }
    }, 
	{strict: false}
) ; // build schema from mongodb Document 

var Flowcell    =  mongoose.model('NSFP', Flowcell);


/*exports.findAll = function(callback){

		var q = Flowcell.find({},{"_id":1, "#chr":1 }).limit(2); 
		
		q.exec( function(err, flowcell)
			{
				callback(flowcell) ;
			}
		)
} ;
*/


exports.findAll = function(callback){
		mongoose.connection.db.eval('db.NSFP.find().limit(50).toArray()' , function(err,v){
			if(err) 
				console.log(err) ;
			else
				callback(v) ;
		}) ;
} ; 




/*exports.findById = function(id , callback) {
		console.log(typeof(id)) ; 
		Flowcell.findOne( {'_id' : id } , function(err,flowcell)
		{
				callback(flowcell) ; 
		} );

} ;*/
exports.findById = function(id, callback){
	mongoose.connection.db.eval('db.NSFP.find({_id: ObjectId("' + id + '")}).limit(10).toArray()' , 
	function(err,v){
		callback(v) ;
	}) ;

};

exports.findByChr = function(chr, callback){
	mongoose.connection.db.eval('db.NSFP.find({ "#chr" : ' + chr + ' }).limit(10).toArray()' , 
	function(err,v){
			if(err) 
				console.log(err) ;
			else
				callback(v) ;
		
	}) ;

};

exports.findByPOS = function(pos, callback)
{
	mongoose.connection.db.eval('db.NSFP.find({ "pos(1-coor)" : '+ pos + '}).limit(10).toArray()' , 
		function(err,v)
		{
			if(err)
				console.log(err);
			else
				callback(v) ;

		}
		) ;
} ;

exports.findByRef = function(ref, callback)
{
		mongoose.connection.db.eval('db.NSFP.find({"ref" : "'+ref+'"}).limit(10).toArray()' , function(err,v) { 
			if (err)
				console.log(err) ;
			else
				callback(v) ;
		}	) ;

} ;

exports.findByAlt = function(alt, callback)
{
	mongoose.connection.db.eval('db.NSFP.find({"alt" : "' + alt + '" } ).limit(10).toArray()' , function(err, v){
		if (err)
			console.log(err) ;
		else
			callback(v) ;
	}

	 ) ;
}; 

exports.delete = function(flowcell_id , callback) 
{
		Flowcell.find({'_id': flowcell_id } ).remove(
			function(err)
			{
				callback() ;
			}

		);
};

exports.update = function( flowcell_id , flowcellItem , callback ) 
{
		Flowcell.update(
			{ '_id ' : flowcell_id  } ,
			{ $set: flowcellItem } ,

			function(err,result)
			{
				callback(result) ;
			}

		) ;

} ; 

exports.save  = function( flowcellItem , callback)
{
		var instance = new Flowcell( flowcellItem ) ;  // create new instance of Flowcell 
		instance.save(

			) ;
} ; 




exports.save = function(flowcellItem, callback) 
{
	var instance = new Flowcell(flowcellItem) ;

	instance.save( function(err)
			 { 
			 	callback() ;
			 }
			 ) ; 
} ; 

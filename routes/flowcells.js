/*
*	FlowCell model dependencies 
*/

var FlowcellsContainer = require('../models/Flowcells');


exports.findAll = 
         function(req, res) {
                FlowcellsContainer.findAll(function(flowcells) {
                        res.jsonp(flowcells);
                        var r = res.jsonp(flowcells) ;
                        console.log( r );
                        
                })
        }
;


exports.findById = 
	function(req, res) 
	{
		var id = req.params.id ; 
		FlowcellsContainer.findById(id , function(security){
				res.jsonp(security) ; 
		} ) ;  	
		
	}
;

exports.findByChr = [
	function(req, res)
	{
		var chr = req.params.chr;
		FlowcellsContainer.findByChr(chr, function(security)
			{ res.jsonp(security) ; }) ;
	}

] ;

exports.findByPOS = [
	function(req,res)
	{
		var pos = req.params.pos ;
		FlowcellsContainer.findByPOS(pos , function(security)
			{	
				res.jsonp(security) } 
			);
	}
] ;

exports.findByRef = [
	function(req,res)
	{

		var ref = req.params.ref ;
		FlowcellsContainer.findByRef(ref, function(security)
			{
				res.jsonp(security) ; 
			}
			) ;
	}

] ;

exports.findByAlt = [
	function(req, res) 
	{
		var alt = req.params.alt ;
		FlowcellsContainer.findByAlt(alt , function(security)
		{
			res.jsonp(security) ; 
		}

			);

	}

] ;

exports.post =
 [
	function(req, res)
	{
		FlowCellsContainer.save( req.body, function()
				{	
					res.jsonp( { Status: "Success" } ) ;
				}
		) ; 
	}

];

exports.put = [
	function(req, res) 
	{
		var security_id = req.params.security_id ; 
		var item = req.body ;
		FlowCellsContainer.update( security_id , item , function(error, result) 
			{
				res.jsonp(result) ;
			}
		)
	}

] ;

exports.delete = [
	function(res, req) {
		var security_id = req.params.security_id ;
		FlowCellsContainer.delete(security_id , function(result) 
		{
			res.jsonp({Status : "deleted"}) ;
		}
		)
	}
] ;

exports.unknown = [
	function(res, req)
	{
		res.send({Status:" Not implemented"}) ;
	}

] ;
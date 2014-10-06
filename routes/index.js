
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.helloworld = function(req, res) {

	res.render('helloworld', {title : 'Hello World render'}) ; 
} ; 

//export.vcf = function(req, res )
exports.vcflist = function(db)
{
	return function(req, res) 
	{
		var coll = db.NSFP;
		coll.find( {} , {}, function(e, docs)
		{
			res.render('vcflist', { "vcflist" : docs });
		}).limit(10) ; 
	} ;

};
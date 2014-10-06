// build in function to get column idex by giving the column label  name 
function getColmnIndex(datatb, label)
{

		for(var i = 0 ; i < datatb.getNumberOfColumns() ; i ++)
		{
			if(datatb.getColumnLabel(i) == label)
				return i ;

		}
		return -1 ;
}
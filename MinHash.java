public ArrayList<String> getUniq(ArrayList<String> input)
{
    Hashmap<String, String> validSubs = new Hashmap<String, String>(); // all valid subs of one given string 
    HashSet<String> usedSubs = new HashSet<String>(); // check if sub used 
    
    ArrayList<String> shortestCodeList= new ArrayList<String>() ;
    
for (String option : input) {
  for(int i = 0; i <= option.length; i++) {
    String sub = option.substring(0, i);  // get all possible substring
    if(usedSubs.contains(sub)) {
      validSubs.remove(sub); 
    } else {
      validSubs.add(sub, option);
      usedSubs.add(sub);
    }
  }
}

for(String str : input)
{
  String shortestHashCode = getShortestPrefix(validSubs , str) ; 
  shortestCodeList.add(shortestHashCode) ; 
}
   return shortestCodeList ;
}

// supporting method to return the shortest HashCode prefix for given string
public String getShortestPrefix(Hashmap<String, String> map ,String a)  
{
    int minL = Integer.MAX ; 
    String shortest = '' ; 
    for(String s : map.keySet()) // valid substring for given string
    {
        if(map.get(s) == a && s.length <= minL) 
        {
            //minL = Math.min(s.length(), minL) ;
          //  if(s.length <= minL)              
                shortest = s ;
                minL = s.length ; 
            
        }
    }
    return shortest ; 
}
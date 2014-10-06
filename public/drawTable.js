//google.load('visualization', '1', {packages:['table']});
google.load('visualization', '1.0', {packages:['controls']});  

google.setOnLoadCallback(drawTable);
//google.setOnLoadCallback(drawDashboard); 

var options = {'showRowNumber': true};
var data ; //= new google.visualization.DataTable() ; 
var table ;
var dashboard ;  
// filter controller 
var stringFilter ; 
var posFilter;
var refFilter ; 
var altFilter ; 
var hgFilter ;
var aaaltFilter ; 
var aarefFilter ; 
var genenameFileter ;
var refcodonFilter ;
var SIFTScoreFilter ;


function drawTable() 
{
  data = new google.visualization.DataTable() ;  

  $.ajax( {
          url: '/',
          //url : 'js.json',
          mimetype: 'application/json',
          type: 'GET',
          success: function(myjson) {
                    var rows = [];
   
                    var firstElst = myjson[0]; // define each column field name from the first JSON list
   
                    for( var i in firstElst) //every key labe in JSON list  ; elt[ek] is the corresponding value for every key  e.g ( ek: elt[ek] =>#chr:1 )
                      {
                          if(i!='_id')
                          {
                              var val = firstElst[i] ;
                               //alert( typeof( val ) ) ; 
                              data.addColumn( typeof( val ) , i);  // make each filed type from first JSON list 
                          }
                      };

                    for(var k in myjson) 
                    {
                          alert(k) ;
                           elt = myjson[k] ;  // each JSON list 
                            //elt = JSON.parse(elt) ; 
                           
                            var nelt = [] ;
                          for(ek in elt)  // every key in each JSON list  ; elt[ek] is the corrospondent value for every key  e.g ( ek: elt[ek] =>#chr:1 )
                          { 
                              alert( typeof (ek) )  ;
                              if( ek != '_id')
                                {
                                   //alert( ek + " is " + elt[ek]) ;
                                   var colIndex =  getColmnIndex(data, ek) ;   // from build-in .js
                                    //alert( colIndex ) ; 
                                   var colType =  data.getColumnType(colIndex) // from google data table API 
                                      //alert( colType ) ;
                                  if( colType != typeof( elt[ek]) ) 
                                    {
                                        // var val = elt([ek])  ;
                                        // alert(colType + " " + typeof(  elt[ek]) + " " + ek ) ; // elt[ek] is the value 
                                      if ( colType == 'string')
                                      {
                                          //alert("before the type is " + typeof( elt[ek]) )  ; 
                                          elt[ek] = elt[ek].toString() ;
                                           //alert("after convert" + typeof ( elt[ek] ) ) ;
                                      }
                                      if ( colType == 'number')
                                      {
                                          // alert(elt[ek] + 'is number') ;  
                                          elt[ek] = Number(elt[ek]) ; 
                                      }
                            }
                            nelt.push( elt[ek] ) ; 
                  //alert (nelt) ;
                  //nelt. push(elt[ek]) ; 
                          }
                      }
                  rows.push(nelt) ;
                } ;
      data.addRows(rows);

     
      options['page'] = 'enable';
      options['pageSize'] = 10;
      options['pagingSymbols'] = {prev: 'prev', next: 'next'};
      options['pagingButtonsConfiguration'] = 'auto';

      // Set the width and height options using the UI controls.
      options['width'] = null;
      options['height'] = null; 
      
     // table = new google.visualization.Table(document.getElementById('table_div'));
  //alert (options) ; 
   table = new google.visualization.ChartWrapper({
          'chartType': 'Table',
          'containerId': 'table_div'          
          }
        ); 

   // alert( table.getOptions() ) ;

   table.setOptions(options) ; 
  // alert(options['page']) ; 
  // alert( table.getOption('page') == options['page']) ;
  //  alert(table.getOption('page')) ; 
   
       // Define a StringFilter control for the '#chrom' column
       stringFilter = new google.visualization.ControlWrapper({
        'controlType': 'StringFilter',
        'containerId': 'control1',
        'options': {
          'filterColumnLabel': "#chr", 
          "ui": {"label": "CHROM"},
          'minValue': 1,
          'maxValue': 23
          //'ui': {'labelStacking': 'vertical'} 
        }
      });

      //alert(stringFilter.getOption('ui.label')) ;  
     // alert(stringFilter.getContainerId()) ; 

      posFilter = new google.visualization.ControlWrapper({
        'controlType': 'NumberRangeFilter',
        'containerId': 'control2',
        'options': {
          'filterColumnLabel': "pos(1-coor)" ,
           "ui": {"label": "POS"} 
        }
      });

      refFilter = new google.visualization.ControlWrapper({
        'controlType': 'CategoryFilter',
        'containerId': 'control3',
        'options': {
          'filterColumnLabel': "ref",
           "ui": {"label": "REF"} 
        }
      });

       altFilter = new google.visualization.ControlWrapper({
        'controlType': 'CategoryFilter',
        'containerId': 'control4',
        'options': {
          'filterColumnLabel': "alt",
           "ui": {"label": "ALT"} 
        }
      });
     
      hgFilter = new google.visualization.ControlWrapper({
        'controlType': 'NumberRangeFilter',
        'containerId': 'control5',
        'options': {
          'filterColumnLabel': "hg18_pos(1-coor)",
           "ui": {"label": "HG18_POS"} 

        }
      });

     aaaltFilter = new google.visualization.ControlWrapper({
        'controlType': 'CategoryFilter',
        'containerId': 'control6',
        'options': {
          'filterColumnLabel': "aaalt",
           "ui": {"label": "AAALT"} 
        }
      });

      aarefFilter = new google.visualization.ControlWrapper({
        'controlType': 'CategoryFilter',
        'containerId': 'control7',
        'options': {
          'filterColumnLabel': "aaref",
           "ui": {"label": "AAREF"} 
        }
      });

     genenameFileter = new google.visualization.ControlWrapper({
        'controlType': 'CategoryFilter',
        'containerId': 'control8',
        'options': {
          'filterColumnLabel': "genename",
           "ui": {"label": "GENENAME"}
        }
      }
      ) ;

      refcodonFilter = new google.visualization.ControlWrapper({
        'controlType': 'CategoryFilter',
        'containerId': 'control9',
        'options': {
          'filterColumnLabel': "refcodon",
          "ui": {"label": "REFCODON"}
        }
      });

      SIFTScoreFilter = new google.visualization.ControlWrapper({
        'controlType': 'CategoryFilter',
        'containerId': 'control10',
        'options': {
          'filterColumnLabel': "SIFT_score",
          "ui": {"label": "SIFT Score"}
        }
      });


     
     // Create the dashboard.
   dashboard = new google.visualization.Dashboard(document.getElementById('dashboard')).
    // Configure the string filter to affect the table contents
    bind(stringFilter, table).
    bind(posFilter,table).
    bind(refFilter,table).
    bind(altFilter, table).
    bind(hgFilter,table).
    bind(aaaltFilter,table).
    bind(aarefFilter,table).
    bind(genenameFileter,table).
    bind(refcodonFilter,table).
    bind(SIFTScoreFilter,table).draw(data) ; 
    // Draw the dashboard
    //draw(data);

   // google.visualization.events.addListener(dashboard, 'ready', dashboardReady);
    //draw() ;
    // hide a filter untile it has been selected 

   // initilize all controller to be hidden 
       /* document.getElementById(stringFilter.getContainerId()).style.visibility = 'hidden'; 
        document.getElementById(posFilter.getContainerId()).style.visibility = 'hidden';
        document.getElementById(refFilter.getContainerId()).style.visibility = 'hidden' ; 
        document.getElementById(altFilter.getContainerId() ).style.visibility ='hidden' ;
        document.getElementById(hgFilter.getContainerId()).style.visibility = 'hidden' ; 
        document.getElementById(aarefFilter.getContainerId()).style.visibility = 'hidden' ; 
        document.getElementById(aaaltFilter.getContainerId()).style.visibility = 'hidden' ; 
        document.getElementById(genenameFileter.getContainerId()).style.visibility = 'hidden' ; 
        document.getElementById(refcodonFilter.getContainerId() ).style.visibility = 'hidden' ; 
        document.getElementById(SIFTScoreFilter.getContainerId() ).style.visibility = 'hidden' ;
     */ 
  /* google.visualization.events.addListener(dashboard, 'ready', function() {
        

  } ) ;*/
     
      $('.ctr1').hide(); 
      $('.ctr2').hide(); 
      $('.ctr3').hide(); 
      $('.ctr4').hide(); 
      $('.ctr5').hide(); 
      $('.ctr6').hide(); 
      $('.ctr7').hide(); 
      $('.ctr8').hide();
      $('.ctr9').hide();  
      $('.ctr10').hide(); 

      //google.visualization.events.addListener(dashboard, 'ready', dashboardReady); 
      //dashboard.bind(posFilter,table).draw(data);
    
    },
  error: function(jqXHR, exception) {// pass  
        }
    } 
  
  );

};

//function StringFilter() 
 

function draw() {
     table.draw(data, options);
    // alert(options) ;
    } 
;

    //google.setOnLoadCallback(drawTable);

    // sets the number of pages according to the user selection.
function setNumberOfPages(value) {
      if (value) {
         /* options['pageSize'] = parseInt(value, 10);
          options['page'] = 'enable';
          */
          table.setOption('pageSize', parseInt(value, 10) ) ; 
          table.setOption('page', 'enable') ; 
        
      } else {
       /* options['pageSize'] = null;
        options['page'] = null;  
        */
         table.setOption('pageSize', null ) ; 
         table.setOption('page', null) ; 
       
      }
      draw() ; 
    }
     // sets the width/height of the table
function setDimension(dimension, value) {
      if (value) {
        options[dimension] = value;
      } else {
        options[dimension] = null;
      }
      draw();
    }
    


    // Sets custom paging symbols "Prev"/"Next"
function setCustomPagingButtons(toSet) {
      options['pagingSymbols'] = toSet ? {next: 'next', prev: 'prev'} : null;
      draw();  
    }

    function setPagingButtonsConfiguration(value) {
      options['pagingButtonsConfiguration'] = value;
      draw();
    }


function setDisplayFilter(value) {
    var chromlabel = stringFilter.getOption('ui.label'); 
     //alert(chromlabel ==value) ; 
    var poslabel = posFilter.getOption('ui.label') ; 

    var reflabel = refFilter.getOption('ui.label');

    var altlabel = altFilter.getOption('ui.label') ;

    var hg18label = hgFilter.getOption('ui.label') ; 

    var aaaltlabel = aaaltFilter.getOption('ui.label') ;

    var aareflabel = aarefFilter.getOption('ui.label') ;

    var genenamelabel = genenameFileter.getOption('ui.label') ;

    var refcodonlabel = refcodonFilter.getOption('ui.label');

    var SIFTlabel = SIFTScoreFilter.getOption('ui.label') ;
   // alert(stringFilter.getContainerId()) ;
   if(value == chromlabel)
    {
      // var vis = document.getElementById('control1').style.visibility ;
       var vis = $( "#control1" ).is(":visible") ; 
      
       vis == true ? $( ".ctr1" ).hide() : $( ".ctr1" ).show() ; 
      //chrmLable = 'visible' ;
    }
    else
      if(value == poslabel )
      {
          //  var vis = document.getElementById('control2').style.visibility ;
          var vis = $( "#control2" ).is(":visible") ;  
         
         vis == true ? $( ".ctr2" ).hide() : $( ".ctr2" ).show() ;   
      }
    else
      if(value == reflabel)
      {
        //var vis = document.getElementById('control3').style.visibility ; 
          var vis = $( "#control3" ).is(":visible") ;  
      
          vis == true ? $('.ctr3').hide() : $('.ctr3').show() ; 
      }
    else
      if(value == altlabel )
      {
        //var vis = document.getElementById('control4').style.visibility ; 
        var vis = $( "#control4" ).is(":visible") ;   
       
        vis == true ? $('.ctr4').hide() : $('.ctr4').show() ; 
      }
    else
      if (value == hg18label)
      {
        //var vis = document.getElementById('control5').style.visibility ; 
        var vis = $( "#control5" ).is(":visible") ;  
      
        vis == true ? $('.ctr5').hide() : $('.ctr5').show() ; 
      }
    else
      if(value == aaaltlabel)
      {
        //var vis = document.getElementById('control6').style.visibility ; 
        var vis = $( "#control6" ).is(":visible") ;  
       
        vis == true ? $('.ctr6').hide() : $('.ctr6').show() ; 
      }
      else 
      if(value == aareflabel)
      {
        //var vis = document.getElementById('control7').style.visibility ; 
         var vis = $( "#control7" ).is(":visible") ;   
       
         vis == true ? $('.ctr7').hide() : $('.ctr7').show() ; 
      }
    
    else
      if( value == genenamelabel )
      {
        //var vis = document.getElementById('control8').style.visibility ;
        var vis = $( "#control8" ).is(":visible") ; 
       
        vis == true ? $('.ctr8').hide() : $('.ctr8').show() ; 
      }
    else
      if( value == refcodonlabel )
      {
        //var vis = document.getElementById('control9').style.visibility ;
        var vis = $( "#control9" ).is(":visible") ; 
     
        vis == true ? $('.ctr9').hide() : $('.ctr9').show() ; 
      }
    else
      if( value == SIFTlabel )
      {
        //var vis = document.getElementById('control10').style.visibility ;
        var vis = $( "#control10" ).is(":visible") ;  
     
         vis == true ? $('.ctr10').hide() : $('.ctr10').show() ; 
      }
      else
      {
        
         $('.ctr1').hide(); 
         $('.ctr2').hide(); 
         $('.ctr3').hide(); 
         $('.ctr4').hide(); 
         $('.ctr5').hide(); 
         $('.ctr6').hide(); 
         $('.ctr7').hide(); 
         $('.ctr8').hide();
         $('.ctr9').hide();  
         $('.ctr10').hide(); 
      
      }



}

function click() 
{
    

     var selected= new Array();
      $(document).ready( function() {

      $("input[type='checkbox']").on('change', function () {
        if ($(this).is(":checked")) { // click the check box 

            var chromlabel = stringFilter.getOption('ui.label'); 

            var poslabel = posFilter.getOption('ui.label') ; 

            var reflabel = refFilter.getOption('ui.label');

            var altlabel = altFilter.getOption('ui.label') ;

            var hg18label = hgFilter.getOption('ui.label') ; 

            var aaaltlabel = aaaltFilter.getOption('ui.label') ;

            var aareflabel = aarefFilter.getOption('ui.label') ;

            var genenamelabel = genenameFileter.getOption('ui.label') ;

            var refcodonlabel = refcodonFilter.getOption('ui.label');

            var SIFTlabel = SIFTScoreFilter.getOption('ui.label') ; 

            //$('.ctr1').hide();
           // alert(chromlabel);
            
            if( $(this).val() == chromlabel )
              {
                //alert($(this).val()) ; 

               // alert( $(this).val() ) ; 
                //selected.push( $('.ctr1') ); 
                selected.push( stringFilter)  ;
               
                
              }
              if( $(this).val() == poslabel )
              {
                //alert($(this).val()) ; 

               // alert( $(this).val() ) ; 
                //selected.push( $('.ctr1') ); 
                selected.push( posFilter )  ;
              
                
              }
              if( $(this).val() == reflabel )
              {
                //alert($(this).val()) ; 
                //alert( $(this).val() ) ; 
                //selected.push( $('.ctr1') ); 
                selected.push( refFilter )  ;
                              
              }
              if( $(this).val() == altlabel )
              {
                //alert($(this).val()) ; 
              //  alert( $(this).val() ) ; 
                selected.push( altFilter )  ;                 
              }
              if( $(this).val() == hg18label )
              {
                //alert($(this).val()) ; 
               // alert( $(this).val() ) ; 
                selected.push( hgFilter )  ;                 
              }
               if( $(this).val() == aaaltlabel )
              {
                //alert($(this).val()) ; 
               // alert( $(this).val() ) ; 
                selected.push( aaaltFilter )  ;                 
              }
              if( $(this).val() == aareflabel )
              {
                //alert($(this).val()) ; 
               // alert( $(this).val() ) ; 
                selected.push( aarefFilter )  ;                 
              }
               if( $(this).val() == genenamelabel  )
              {
                //alert($(this).val()) ; 
               // alert( $(this).val() ) ; 
                selected.push( genenameFileter )  ;                 
              }

               if( $(this).val() == refcodonlabel )
              {
                //alert($(this).val()) ; 
                //alert( $(this).val() ) ; 
                selected.push( refcodonFilter )  ;                 
              }

               if( $(this).val() == SIFTlabel )
              {
                //alert($(this).val()) ; 
                //alert( $(this).val() ) ; 
                selected.push( SIFTScoreFilter)  ;                 
              }
           // selected.push($(this).val());
        } else { // uncheck the box 
            for (var i = 0; i < selected.length; i++) {
                if (selected[i].getOption('ui.label') == $(this).val()) {

                    //alert(selected[i].getContainerId()  ) ;
                    selected.splice(i, 1);

                  //  alert(selected[i].getContainerId());
                    // alert(SIFTScoreFilter.getContainerId() == selected[i].getContainerId() )  ;

                }
            }
        }

        // output selected
        var output = "";
        for (var o = 0; o < selected.length; o++) {
            if (output.length) {
                alert(selected[o].getOption('ui.label') ) ;
                output += ", " + selected[o];
                //alert( selected[o].getContainerId() ) ;
               // alert($("#dashboard")) ;
                //var 
                alert(selected[0].getContainerId()) ; 

                $("#root").append( $('#'+selected[0].getContainerId()+'') ) ; 
               // $("#dashboard").append( $("#") );
            } else {
                output += selected[o];
            }
        }
         $("#root").append(output);
    });
  });
  
}

function dashboardReady() {
  // The dashboard is ready to accept interaction. Configure the buttons to
  // programmatically affect the dashboard when clicked.

  // Change the slider selected range when clicked.
  document.getElementById('rangeButton').onclick = function(value) {
   // slider.setState({'lowValue': 2, 'highValue': 5});
   // slider.draw();
   var filedlabe = stringFilter.getOption('ui.label'); 
  // alert(filedlabe ==value) ; 
   posFilter.setState({'lowValue': 35152, 'highValue': 35158});
          posFilter.draw();

  }
}
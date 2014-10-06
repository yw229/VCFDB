google.load('visualization', '1', {packages:['table']});
google.setOnLoadCallback(drawTable);
      function drawTable() {




        var data = new google.visualization.DataTable();
        data.addColumn('number', 'CHROM');
        data.addColumn('number', 'POS');
        data.addColumn('string', 'REF');
        data.addColumn('string', 'ALT') ;

        data.addRows([
          [ 1 ,  {v: 35138, f: '$35138'},'T', 'G' ],
          [ 1 ,  {v: 35138},'T', 'A' ],
         
        ]);

        $.ajax(



          ) ; 

        var table = new google.visualization.Table(document.getElementById('table_div'));
        table.draw(data, {showRowNumber: true});
      }
      




DataTable = function(options) {
	var self = this;

	self._columns	= options.columns;
	self._table	= options.table;

};



// named contructor

DataTable.reader = function(options) {
	var self = this;

	var data = options.data || "";
	var delimiter = options.delimited || ',';
	var quotechar = options.quotechar || '"';
	var head = options.head || false;

	var rows = new Array();
	var cols = new Array();
	var quated = false;
	var colStartIndex = 0;
	var quateCount = 0;


	var unescape = function(value) {
		if(	value.charAt(0) == '"' && 
			value.charAt(value.length-1) == '"') {
			value = value.substring(1, value.length-1);
		}
		value = value.replace(/""/g, '"');
		return value;
	};


	for(i=0; i<data.length; i++) {
		var c = data.charAt(i);
        
		if(c == quotechar) {
			quateCount++;
            
			if(!quated) {
				quated = true;
			}
			else {
				if (quateCount % 2 == 0 ) {
					if (i == data.length - 1 
						|| data.charAt(i + 1) != quotechar) {
							quated = false;
					}
				}
			}
		}
        
		if(!quated) {
			if(c == delimiter) {
				var value = data.substring(colStartIndex, i);
				value = unescape(value);
				cols.push(value);
				colStartIndex = i + 1;
			}
			else if(c == "\r") {
				var value = data.substring(colStartIndex, i);
				value = unescape(value);
				cols.push(value);
				i += 1;
				colStartIndex = i + 1;
				rows.push(cols);
				cols = new Array();
			}
			else if(c == "\n") {
				var value = data.substring(colStartIndex, i);
				value = unescape(value);
				cols.push(value);
				colStartIndex = i + 1;
				rows.push(cols);
				cols = new Array();
			}
		}
	}


	var value = data.substring(colStartIndex, i);
	value = unescape(value);
	cols.push(value);
	colStartIndex = i + 1;
	rows.push(cols);
	cols = new Array();


	var header = [];
	if(head) {
		header = rows[0];
	}
	var table = rows.slice(1,rows.length+1);


	var table_json = new Array();
	for(var i=0; i<table.length; i++) {
		var elt = new Object();
		for(var j=0; j<header.length; j++) {
			elt[header[j]] = table[i][j];
		}
		table_json.push(elt);
	}

	var columnDefs = new Array();
	for(var i=0; i<header.length; i++) {
		var elt = new Object();
		elt["key"] = header[i];
		columnDefs.push(elt)
	}


	return new DataTable({columns: columnDefs, table: table_json});

};


DataTable.prototype.toCSV = function(options) {
	var self = this;

	options = options || {};
	var columns = options.columns || self._columns;


	var data = new Array();

	var row = new Array();
	$.each(columns, function(id, obj) {
		row.push(obj["key"]);
	});
	data.push(row.join(","));


	$.each(self._table, function(id, obj) {
		row = new Array();
		$.each(columns, function(idx, val) {
			row.push(obj[val["key"]]);
		});
		data.push(row.join(","));
	});

	return data.join("\n");
};


DataTable.prototype.render = function(elt, options) {
	var self	= this;
	options		= options || {};

	var jelt	= $(elt).addClass("yui-dt");
	var columns	= options.columns || self._columns;

	var table	= $('<table></table>');
	var row		= null;
	var data	= null;

	thead = $('<thead></thead>');
	row = $('<tr></tr>');
	$.each(columns, function(id, obj) {
		data = $('<td></td>', {
				text: obj["label"] || obj["key"]
		}).appendTo(row);
	});
	row.appendTo(thead);
	thead.appendTo(table);


	tbody = $('<tbody></tbody>');
	$.each(self._table, function(id, obj) {
		row = $('<tr></tr>');
		if( id % 2 == 0 ) {
			row.addClass("yui-dt-even");
		}
		else {
			row.addClass("yui-dt-odd");
		}

		$.each(columns, function(idx, val) {
			var key = val["key"];
			var label = val["label"] || key;
			var editor = val["editor"] || {};
			var formatter = val["formatter"] || function(x) { return x; };

			data = $('<td></td>', {
				text : formatter(obj[key]) 
			});

			data.hover(function() {
				$(this).addClass('yui-dt-highlighted');
			},function() {
				$(this).removeClass('yui-dt-highlighted');
			});


			if(editor["type"] == "dropdownTextEditor") {
				data.click(dropdownTextEditor(self, editor));
			}
			else {
				data.click(baseTextEditor(self));
			}


			data.appendTo(row); 
		});

		row.appendTo(tbody);
	});
	tbody.appendTo(table);

	jelt.empty();
	table.appendTo(jelt);
};


var baseTextEditor = function(self) {
	return function() {
		var position = $(this).position();

		var text = $(this).text();
		// $(this).text('');

		var j = this.cellIndex;
		var i = this.parentNode.rowIndex;
		i -= 1;

		var editor = $('<div></div>');
		editor.addClass('yui-dt-editor');
		editor.css('left', position.left);
		editor.css('top', position.top);

		editor.blur(function() {
			$(this).parent().remove();
		});

		var elt = $('<input type="text" />');
		elt.val(text);
		elt.blur(function() {
			var newText = $(this).val();

			self._table[i][self._columns[j]["key"]] = newText;

			$(this).parent().parent().text(newText);

			$(this).parent().remove();
                });
		elt.appendTo(editor);



		editor.appendTo($(this));
		$(this).find('input:text').focus();
	}
}


var dropdownTextEditor = function(self, options) {
	return function() {
		var position = $(this).position();

		options = options || {};
		var dropdownOptions = options.dropdownOptions || [];

		var text = $(this).text();

		var j = this.cellIndex;
		var i = this.parentNode.rowIndex;
		i -= 1;

		var editor = $('<div></div>');
		editor.addClass('yui-dt-editor');
		editor.css('left', position.left);
		editor.css('top', position.top);

		editor.blur(function() {
			$(this).parent().remove();
		});


		var elt = $('<select></select>');
		$.each(dropdownOptions, function(idx,obj) {
			var opt = $('<option></option>');
			opt.text(obj["label"]);
			opt.val(obj["value"]);
			opt.appendTo(elt);
		});

		elt.blur(function(){
			var newText = $(this).find('option:selected').val();
			self._table[i][self._columns[j]["key"]] = newText;

			$(this).parent().parent().text(newText);
			$(this).parent().remove();
		});
		elt.val(text);
		elt.appendTo(editor);

		editor.appendTo($(this));
		$(this).find('div').find('select').focus();
	}
}

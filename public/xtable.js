
xTable = function(eltid, options) {
	var self		= this;
	self.chart		= document.getElementById(eltid);
	self.options		= options || {};
	self.data		= options['data'];
	self.columns		= options['columns'];

	self.redraw()();
};


xTable.prototype.update = function() {
	var self = this;

	d3.select(self.chart).select("table").remove();
	self.table	= d3.select(this.chart).append("table");
	self.thead	= self.table.append("thead");
	self.tbody	= self.table.append("tbody");

	// Add header
	self.thead.append("tr")
		.selectAll("th")
		.data(self.columns)
		.enter()
		.append("th")
			.text(function(column) { return column; });


	// Add rows
	var rows = self.tbody.selectAll("tr")
			.data(self.data)
			.enter()
			.append("tr")


	// Fill in columns
	var cells = rows.selectAll("td")
			.data(function(row) {
return self.columns.map(function(column) { return {column: column, value: row[column]}});
			})
			.enter()
			.append("td")
				.text(function(d) { return d.value; });
};


xTable.prototype.redraw = function() {
	var self = this;

	return function() {
		self.update();
	}

};


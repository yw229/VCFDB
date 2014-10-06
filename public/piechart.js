
PieChart = function(eltid, options) {
	var self		= this;
	this.chart		= document.getElementById(eltid);
	this.cx			= this.chart.clientWidth;
	this.cy			= this.chart.clientHeight;
	this.options		= options || {};
	this.data		= options['data'];
	this.rng		= options['rng'] || [new Date(), new Date(new Date()-new Date(1000*60*60*24*1))];


	this.margin = {'top': 0, 'right': 0, 'bottom': 0, 'left': 0};
	this.size = {
		'width'		: this.cx - this.margin.left - this.margin.right
		,'height'	: this.cy - this.margin.top  - this.margin.bottom
	};
	this.size.radius	= Math.min(this.size.width, this.size.height) / 2;

	this.centroids	= [];
	this.handles	= [];

	this.color	= d3.scale.ordinal()
				.range(['#d87c82', '#e1965d']);

	this.arc	= d3.svg.arc()
				.outerRadius(this.size.radius - 10)
				.innerRadius(this.size.radius - 60);

	this.pie	= d3.layout.pie()
				.sort(null)
				.value(function(d) { return d.load; });

	this.svg	= d3.select(this.chart).append('svg')
				.attr('width',	this.cx)
				.attr('height', this.cy)
				.append('g')
				.attr('transform', 'translate(' + this.size.width / 2 + ',' + this.size.height / 2 + ')');


	// Top Left

	self.svg.append('text')
		.attr('class', 'title')
		.attr('x', -self.size.width/2+10)
		.attr('y', -self.size.height/2+10)
		.attr('dy', '.71em')
		.text('Cluster Load');

	self.svg.append('text')
		.attr('id', 'dateRange')
		.attr('class', 'subtitle')
		.attr('x', -self.size.width/2+10)
		.attr('y', -self.size.height/2+10+48+5)
		.attr('dy', '.71em')
		.text('---');


	// Top Right

	self.svg.append('text')
		.attr('id', 'unutilized')
		.attr('class', 'title')
		.attr('x', self.size.width/2-10)
		.attr('y', -self.size.height/2+10)
		.attr('dy', '.71em')
		.style('text-anchor', 'end')
		.text('---');

	self.svg.append('text')
		.attr('class', 'subtitle')
		.attr('x', self.size.width/2-10)
		.attr('y', -self.size.height/2+10+48+5)
		.attr('dy', '.71em')
		.style('text-anchor', 'end')
		.text('Unutilized');


	// Bottom Right

	self.svg.append('text')
		.attr('class', 'subtitle')
		.attr('x', self.size.width/2-10)
		.attr('y', self.size.height/2-10-48-5-24)
		.attr('dy', '.71em')
		.style('text-anchor', 'end')
		.text('Total CPU Minutes');

	self.svg.append('text')
		.attr('id', 'totalhours')
		.attr('class', 'title')
		.attr('x', self.size.width/2-10)
		.attr('y', self.size.height/2-10-48)
		.attr('dy', '.71em')
		.style('text-anchor', 'end')
		.text('---')


	// Bottom Left

	self.svg.append('text')
		.attr('id', 'utilized')
		.attr('class', 'title')
		.attr('x', -self.size.width/2+10)
		.attr('y', self.size.height/2-10-48-5-24)
		.attr('dy', '.71em')
		.text('---');

	self.svg.append('text')
		.attr('class', 'subtitle')
		.attr('x', -self.size.width/2+10)
		.attr('y', self.size.height/2-10-24)
		.attr('dy', '.71em')
		.text('Utilized');


	// center

/*
	self.svg.append('text')
		.attr('id', 'totalactivehours')
		.attr('class', 'title')
		.attr('x', 0)
		.attr('y', -18)
		.attr('dy', '.71em')
		.style('text-anchor', 'middle')
		.text('---');
*/

	self.redraw()();
}



PieChart.prototype.update = function() {
	var self = this;


	self.svg.selectAll('.arc').remove();
	self.g = self.svg.selectAll('.arc')
			.data(self.pie(self.data))
			.enter().append('g')
			.attr('class', 'arc');


	self.centroids = [];
	self.handles = [];

	self.g.append('path')
		.attr("d", self.arc)
		.style('fill', function(d) {
			self.centroids.push([(self.size.radius-10)*Math.cos(-Math.PI/2 + (d.startAngle + d.endAngle)/2.0), (self.size.radius-10)*Math.sin(-Math.PI/2 + (d.startAngle + d.endAngle)/2.0)]);
			self.handles.push([(self.size.radius)*Math.cos(-Math.PI/2 + (d.startAngle + d.endAngle)/2.0), (self.size.radius)*Math.sin(-Math.PI/2 + (d.startAngle + d.endAngle)/2.0)]);

			return self.color(d.data.load);
		});



	self.svg.selectAll('.underline').remove();

	// Top Left


	d3.select('#dateRange').text(self.rng[0].getFullYear() + "." + d3.format("02d")(self.rng[0].getMonth()+1) + "." + d3.format("02d")(self.rng[0].getDate()) + " - " + self.rng[1].getFullYear() + "." + d3.format("02d")(self.rng[1].getMonth()+1) + "." + d3.format("02d")(self.rng[1].getDate()));



	// Top Right

	d3.select("#unutilized").text(d3.format("00%")(self.data[0].load/(self.data[0].load+self.data[1].load)));

	self.svg.append('line')
		.attr('class', 'underline')
		.attr('x1', self.size.width/2-10)
		.attr('y1', -self.size.height/2+7+48)
		.attr('x2', self.size.width/2-10-250)
		.attr('y2', -self.size.height/2+7+48);

	self.svg.append('line')
		.attr('class', 'underline')
		.attr('x1', self.size.width/2-10-250)
		.attr('y1', -self.size.height/2+7+48)
		.attr('x2', self.handles[0][0])
		.attr('y2', self.handles[0][1]);

	self.svg.append('line')
		.attr('class', 'underline')
		.attr('x1', self.handles[0][0])
		.attr('y1', self.handles[0][1])
		.attr('x2', self.centroids[0][0])
		.attr('y2', self.centroids[0][1]);




	// Bottom Right

	// d3.select("#totalhours").text(d3.format(",d")(parseInt(self.data[0].load+self.data[1].load)));
	d3.select("#totalhours").text(d3.format(",d")(parseInt(self.data[1].load)));


	// Bottom Left

	d3.select("#utilized").text(d3.format("00%")(self.data[1].load/(self.data[0].load+self.data[1].load)));

	self.svg.append('line')
		.attr('class', 'underline')
		.attr('x1', -self.size.width/2+10)
		.attr('y1', self.size.height/2-10-24-7)
		.attr('x2', -self.size.width/2+10+250)
		.attr('y2', self.size.height/2-10-24-7);

	self.svg.append('line')
		.attr('class', 'underline')
		.attr('x1', -self.size.width/2+10+250)
		.attr('y1', self.size.height/2-10-24-7)
		.attr('x2', self.handles[1][0])
		.attr('y2', self.handles[1][1]);

	self.svg.append('line')
		.attr('class', 'underline')
		.attr('x1', self.handles[1][0])
		.attr('y1', self.handles[1][1])
		.attr('x2', self.centroids[1][0])
		.attr('y2', self.centroids[1][1]);



	// center

	// d3.select("#totalactivehours").text(d3.format(",d")(parseInt(self.data[1].load)));



	if (d3.event && d3.event.keyCode) {
		d3.event.preventDefault();
		d3.event.stopPropagation();
	}
};



PieChart.prototype.redraw = function() {
	var self = this;

	return function() {
		self.update();
	}

};




PieChart.prototype.notify = function (data) {
	var self	= this;

	self.data	= data['data'];
	self.rng	= data['rng'];

	self.redraw()();
}



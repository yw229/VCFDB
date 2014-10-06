
PieChart = function(eltid, options) {
	var self		= this;
	this.chart		= document.getElementById(eltid);
	this.cx			= this.chart.clientWidth;
	this.cy			= this.chart.clientHeight;
	this.options		= options || {};
	this.data		= options['data'];


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
				.value(function(d) { return d.value; });

	this.svg	= d3.select(this.chart).append('svg')
				.attr('width',	this.cx)
				.attr('height', this.cy)
				.append('g')
				.attr('transform', 'translate(' + this.size.width / 2 + ',' + this.size.height / 2 + ')');


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

			return self.color(d.data.value);
		});
};



PieChart.prototype.redraw = function() {
	var self = this;

	return function() {
		self.update();
	}

};


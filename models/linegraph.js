
LineGraph = function(eltid, options) {
	var self		= this;
	this.chart		= document.getElementById(eltid);
	this.cx			= this.chart.clientWidth;
	this.cy			= this.chart.clientHeight;
	this.options		= options || {};
	this.options.xmax	= options.xmax || new Date();
	this.options.xmin	= options.xmin || new Date(new Date()-new Date(1000*60*60*24*1));
	this.options.ymax	= options.ymax || 192;
	this.options.ymin	= options.ymin || 0;

	this.allpoints		= options.points;
	this.points		= [];

	this.margin = {'top': 30, 'right': 40, 'bottom': 30, 'left': 40};
	this.size = {
		'width'		: this.cx - this.margin.left - this.margin.right
		,'height'	: this.cy - this.margin.top  - this.margin.bottom
	};


	// Implementing the Observable Interface
	this.observers		= options.observers || [];



	// x-scale
	this.x	= d3.time.scale()
			.domain([this.options.xmin, this.options.xmax])
			.range([0, this.size.width]);

	// drag x-axis logic
	this.downx = Math.NaN;

	// y-scale (inverted domain)
	this.y = d3.scale.linear()
			.domain([this.options.ymax, this.options.ymin])
			.nice()
			.range([0, this.size.height])
			.nice();

	this.dragged = this.selected = null;

	this.line = d3.svg.line()
		.x(function(d, i) { return this.x(this.points[i].x); })
		.y(function(d, i) { return this.y(this.points[i].z); });


	this.svg = d3.select(this.chart).append('svg')
			.attr('width',	this.cx)
			.attr('height', this.cy)
			.append('g')
				.attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

	this.plot = this.svg.append('rect')
			.attr('width',		this.size.width)
			.attr('height',		this.size.height)
			.style('fill',		'#fff')
			.style('fill-opacity',	0.0)
			.attr('pointer-events',	'all');
	this.plot.call(d3.behavior.zoom().x(this.x).on('zoom', this.redraw()));

	this.svg.append('svg')
		.attr('top',	0)
		.attr('left',	0)
		.attr('width',	this.size.width)
		.attr('height',	this.size.height)
		.attr('viewBox','0 0 '+this.size.width+' '+this.size.height)
		.attr('class',	'line')
		.append('path')
			.attr('class',	'line')
			.attr('d',	this.line(this.points));

	d3.select(this.chart)
		.on('mousemove.drag',	self.mousemove())
		.on('touchmove.drag',	self.mousemove())
		.on("mouseup.drag",	self.mouseup())
		.on("touchend.drag",	self.mouseup());


	// Topline

	this.svg.append('line')
		.attr('class',	'topline')
		.attr('x1',	0)
		.attr('y1',	0)
		.attr('x2',	self.size.width)
		.attr('y2',	0);

	this.svg.append('g')
		.append('text')
		.attr('class',	'yaxis')
		.attr('x',	0)
		.attr('y',	0)
		.attr('dy',	'1.0em')
		.text('192 cores');


	this.redraw()();
};



LineGraph.prototype.update = function() {
	var self	= this;

	self.points	= $.grep(self.allpoints, function(elt, idx) { return (elt.x>=self.x.domain()[0]) && (elt.x<=self.x.domain()[1])} );

	for( i in self.points ) {
		console.log(self.points[i].x);
	}


	var lines	= self.svg.select('path')
				.attr('d', self.line(self.points));

	var circle	= self.svg.select('svg').selectAll('circle').data(self.points);


	circle.enter().append('circle')
		.attr('class',	'pts')
		.attr('cx',	function(d) { return self.x(d.x); })
		.attr('cy',	function(d) { return self.y(d.z); })
		.attr('r',	1.0)
		.style('fill',	'#fff')
		.style('stroke', '#fff')
		.style('stroke-width', '0px');

	circle
		.attr('class',	'pts')
		.attr('cx',	function(d) { return self.x(d.x); })
		.attr('cy',	function(d) { return self.y(d.z); });

	circle.exit().remove();


	// alert observers
	self.notify();


	if (d3.event && d3.event.keyCode) {
		d3.event.preventDefault();
		d3.event.stopPropagation();
	}
};



LineGraph.prototype.mousemove = function() {
	var self = this;
	return function() {
		var	p	= d3.mouse(self.svg[0][0])
			,t	= d3.event.changedTouches;

		// Tooltip
		var mySector	= d3.bisector(function(d) { return d.x; }).left;
		var	x0	= self.x.invert(p[0]);
		var	i	= mySector(self.points, x0, 1);


		var loadTxt	= d3.format("00%")(self.points[i-1].y);
		var absTxt	= self.points[i-1].z;

		var dtTxt	= self.points[i-1].x.getFullYear() + "." + d3.format("02d")(self.points[i-1].x.getMonth()+1) + "." + d3.format("02d")(self.points[i-1].x.getDate());
		var tmTxt	= d3.format("02d")(self.points[i-1].x.getHours()) + ":" + d3.format("02d")(self.points[i-1].x.getMinutes());


		d3.select("#dataPoint").transition().text(absTxt + " cores (" + loadTxt + " of available) on " + dtTxt + " @ " + tmTxt);


		if (!isNaN(self.downx)) {
			d3.select('body').style("cursor", "ew-resize");

			var	rupx		= self.x.invert(p[0])
				,xaxis1		= self.x.domain()[0]
				,xaxis2		= self.x.domain()[1]
				,xextent	= xaxis2 - xaxis1;

			if (rupx != 0) {
				var	changex
					,new_domain;
				changex = self.downx / rupx;
				new_domain = [xaxis1, xaxis1 + (xextent * changex)];
				self.x.domain(new_domain);
				self.redraw()();
			}

			d3.event.preventDefault();
			d3.event.stopPropagation();
		}

	}
};



LineGraph.prototype.mouseup = function() {
	var self = this;
	return function() {
		document.onselectstart = function() { return true; };
		d3.select('body').style("cursor", "auto");

		if (!isNaN(self.downx)) {
			self.redraw()();
			self.downx = Math.NaN;
			d3.event.preventDefault();
			d3.event.stopPropagation();
		}
	}
};



LineGraph.prototype.redraw = function() {
	var self = this;
	return function() {
		var	tx	= function(d) {	return 'translate(' + self.x(d) + ',0)'; }
			,ty	= function(d) {	return 'translate(0,' + self.y(d) + ')'; }
			,stroke	= function(d) {	return d ? '#ccc' : '#666'; }
			,fx	= self.x.tickFormat(10)
			,fy	= self.y.tickFormat(10);

		// Regenerate x-ticks
		var gx = self.svg.selectAll('g.x')
				.data(self.x.ticks(10), String)
				.attr('transform', tx);

		gx.select('text')
			.text(fx);

		var gxe = gx.enter().insert('g', 'a')
				.attr("class", 'x')
				.attr("transform", tx);

		gxe.append('text')
			.attr('class',		'axis')
			.attr('y',		self.size.height)
			.attr('dy',		'1em')
			.attr('text-anchor',	'middle')
			.style('fill',		'#fff')
			.text(fx)
			.style('cursor',	'ew-resize')
			.on('mouseover',	function(d) { d3.select(this).style('font-weight', 'bold');})
			.on('mouseout',		function(d) { d3.select(this).style('font-weight', 'normal');})
			.on('mousedown.drag',	self.xaxis_drag())
			.on('touchstart.drag',	self.xaxis_drag());

		gx.exit().remove();


		d3.select('#datapoint').remove();
		self.svg.append('text')
			.attr('id',		'dataPoint')
			.attr('class',		'yaxis')
			.attr('x',		self.size.width)
			.attr('y',		0)
			.attr('dy',		'1.0em')
			.style('text-anchor',	'end')
			.text('');


		self.plot.call(d3.behavior.zoom().x(self.x).on('zoom', self.redraw()));

		self.update();		
	}	
};



LineGraph.prototype.xaxis_drag = function() {
	var self = this;
	return function(d) {
		document.onselectstart	= function() { return false; };
		var p			= d3.mouse(self.svg[0][0]);
		self.downx		= self.x.invert(p[0]);
	}
};




// Observer methods


LineGraph.prototype.register = function(callback) {
	var self = this;

	self.observers.push(callback);
	self.notify();
}



LineGraph.prototype.unregister = function(callback) {
	var	self	= this;

	var	i	= 0
		,len	= this.observers.length;

	for(; i < len; i++) {
		if (this.observers[i] === callback) {
			this.overservers.splice(i, 1);
			return;
		}
	}
}



LineGraph.prototype.notify = function(data) {
	var self = this;

	var	i	= 0
		,len	= self.observers.length;


	var active	= self.points.reduce(function(a,b){ return a + 5.0*b.y; }, 0);
	var full	= self.points.reduce(function(a,b){ return a + 5.0; }, 0);
	var passive	= full - active;

	var data	= {'data': [{'id': 'active', 'load': passive}, {'id': 'passive', 'load': active}], 'rng': [self.points[0].x, self.points[self.points.length-1].x] };

	for(; i < len; i++) {
		this.observers[i].notify(data);
	}
}


//Defining global variables
var canvas, canvasSupported, ctx;
// main object for namespacing purposes
var neurons = {
	// definition of points
	vars: {
		r: 3,
		spacing: this.r*6,
		minAmount: 10,
		width:640,
		height:300
	},
	nArray: [],
	combinationArray: [],
	buildRandomCoords: function(amount) {
		amount = amount || this.vars.minAmount;
		this.nArray = [];
		for (var i=0; i<amount; i++) {
			var j = 0;
			do {
				j++;
				used = false;
				var x = parseInt(Math.random() * (canvas.width - this.vars.r*2)) + this.vars.r*2;
				var y = parseInt(Math.random() * (canvas.height - this.vars.r*2)) + this.vars.r*2;
				
				for (var i=0; i<this.nArray.length; i++) {
					if ((x > this.nArray[i][0] - this.vars.spacing) &&  (x < this.nArray[i][0] + this.vars.spacing) && (y > this.nArray[i][1] - this.vars.spacing) &&  (y < this.nArray[i][1] + this.vars.spacing)) {
						used = true;
					}
				}
			} while (used && j <5)
			if (!used) {
				this.nArray.push([x,y]);
			}
		}
	},
	initOrSubmit: function() {
		if (canvasSupported){
			if (parseInt($('#amount').val()) >= 300) {
				alert('Please enter a number under 300');
			} else {
				var method = $('select#method option:selected').val() 
				this.buildNeurons(method);
				this.buildConnections(method);
			}
		}
	},
	changeMethod: function() {
		if (canvasSupported){
			var method = $('select#method option:selected').val() 
			this.buildNeurons(method,true);
			this.buildConnections(method);
		}
	},
	buildNeurons: function(method,keepcoords) {
		if (canvasSupported){
			if (!keepcoords) { // keep coordinates if method is changed
				this.buildRandomCoords($('#amount').val());
			}
			ctx.clearRect ( 0 , 0 , canvas.width , canvas.height );
			for (var i=0; i<this.nArray.length; i++) {
				this.nArray[i].push(new this.Neuron(this.nArray[i][0],this.nArray[i][1],this.vars.r));
			}
		}
	},
	buildConnections: function(method) {
		this.combinationArray = [];
		this.included = function(arr, obj) {
			for(var i=0; i<arr.length; i++) {
				if ((arr[i][0] == obj[0]) && (arr[i][1] == obj[1])) {
					return true;
				}
			}
		};
		this.drawLine = function(startX, startY, endX, endY) {
			ctx.strokeStyle='rgb(120,120,120)';
			ctx.save(); 
			ctx.beginPath();
			ctx.moveTo(startX,startY);
			ctx.lineTo(endX,endY);
			ctx.stroke();
			ctx.restore();
		};
		
		if (method == "shortest") {
			for (var i=0; i<this.nArray.length; i++) {
				var smallestDiff = 1000;
				var smallestNum = 0;
				var found = false;
				for (var j=0; j<this.nArray.length; j++) {
					if (i != j) {
						var thisX = this.nArray[i][0];
						var thisY = this.nArray[i][1];
						var thatX = this.nArray[j][0];
						var thatY = this.nArray[j][1];
						var diff = (Math.abs(thatX-thisX)) + (Math.abs(thatY-thisY));
						if ((diff <= smallestDiff) && (!this.included(this.combinationArray,[j,i]))) {
							smallestDiff = diff;
							smallestNum = j;
							found = true;
						}
					}
				}
				if (found) {
					this.combinationArray.push([i,smallestNum]);
					this.drawLine(this.nArray[i][0],this.nArray[i][1],this.nArray[smallestNum][0],this.nArray[smallestNum][1]);
				}
			}
		}
		
		if (method == "twoforeach") {
			for (var i=0; i<this.nArray.length; i++) {
				var smallestDiff = 1000;
				var secondSmallest = 1001;
				var smallestNum = 0;
				var secondSmallestNum = 0;
				var found = false;
				var foundSecond = false;
				for (var j=0; j<this.nArray.length; j++) {
					if (i != j) {
						var thisX = this.nArray[i][0];
						var thisY = this.nArray[i][1];
						var thatX = this.nArray[j][0];
						var thatY = this.nArray[j][1];
						var diff = (Math.abs(thatX-thisX)) + (Math.abs(thatY-thisY));
						if ((diff <= smallestDiff) && (!this.included(this.combinationArray,[j,i]))) {
							smallestDiff = diff;
							smallestNum = j;
							found = true;
						}
						if ((diff <= secondSmallest) && (!this.included(this.combinationArray,[j,i])) && (smallestNum != j)) {
							secondSmallest = diff;
							secondSmallestNum = j;
							foundSecond = true;
						}
					}
				}
				if (found) {
					this.combinationArray.push([i,smallestNum]);
					this.drawLine(this.nArray[i][0],this.nArray[i][1],this.nArray[smallestNum][0],this.nArray[smallestNum][1]);
				}
				if (foundSecond) {
					this.combinationArray.push([i,secondSmallestNum]);
					this.drawLine(this.nArray[i][0],this.nArray[i][1],this.nArray[secondSmallestNum][0],this.nArray[secondSmallestNum][1]);
				}
			}
		}
		
		if (method == "all"){
			for (var i=0; i<this.nArray.length; i++) {
				for (var j=0; j<this.nArray.length; j++) {
					if (i != j) {
						if (!this.included(this.combinationArray,[j,i])) {
							found = true;
							this.combinationArray.push([i,j]);
							this.drawLine(this.nArray[i][0],this.nArray[i][1],this.nArray[j][0],this.nArray[j][1]);
						}
					}
				}
				
			}
		}					
		
		
	},
	
	// to be instanciated
	Neuron: function(x,y,r) {
		// basic point drawing function
		paintPoint = function(x,y,r) {
			ctx.fillStyle = 'rgb(255,0,0)';
			ctx.beginPath();
			ctx.arc(x,y,r,0,Math.PI*2,true);
			ctx.closePath();
			ctx.fill();
		}
		
		this.x = x;
		this.y = y;
		paintPoint(this.x,this.y,r);	  
		
	}
}


$(document).ready(function() {
	canvas = document.getElementById('neurons');  
	canvas.width = neurons.vars.width;
	canvas.height = neurons.vars.height;
	if (canvas.getContext){
			canvasSupported = true;
			ctx = canvas.getContext('2d');
			ctx.globalCompositeOperation = 'destination-over';
	}
	$('#main').submit(function(e) {
	  e.preventDefault();
	  neurons.initOrSubmit();
	});
	$('#method').change(function(e) {
	  neurons.changeMethod();
	});
	neurons.initOrSubmit();
});

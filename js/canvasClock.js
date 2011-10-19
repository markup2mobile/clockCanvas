/*
For desktop browser size clock depending on the size of the canvas.
To correctly display the clock must to comply with the proportion of the canvas about x/y = 3.3
*/
function canvasClock(canvas){
	var mobile = (/Mobile/i).test(navigator.userAgent);
	var step_angle;
	if (mobile) {	//for mobile browser
		step_angle = 10;	//step of angle animation
		canvas.width = parseInt(document.documentElement.clientWidth*0.9);	//setting the width and height of the canvas
		if (parseInt(canvas.width/3.3)%2 == 0) canvas.height = parseInt(canvas.width/3.3);
		else canvas.height = parseInt(canvas.width/3.3)+1;
	}
	else {	//for desktop browser
		step_angle = 2;		//step of angle animation
		if (canvas.width < 320) {
			canvas.width = 660;		//setting the width and height of the canvas
			canvas.height = 200;
		}
	}
	var width_canvas = canvas.offsetWidth;
	var height_canvas = canvas.offsetHeight;
	var margin_up = Math.round(height_canvas*0.3/2);
	var height_num = height_canvas - margin_up*2;
	var width_num = Math.round(height_num/2);
	var line_width = Math.round(width_num*0.23);
	var width_points = Math.round(width_canvas*0.07);
	var width_between_num = Math.round(width_num*0.1)+line_width;
	var width_num_block = width_num*2 + width_between_num;
	var margin_side = Math.round((width_canvas - width_points*2 - width_num_block*3)/2);
	var num_shift = width_num+width_between_num;
	var hour_blockY = margin_up;
	var min_blockY = margin_up;
	var sec_blockY = margin_up;
	var hour_blockX = margin_side;
	var min_blockX = hour_blockX + width_num_block + width_points;
	var sec_blockX = min_blockX + width_num_block + width_points;
	var rad_points = Math.round(height_num*0.035);
	var angle = 180/step_angle;
	var limit = angle/2 + 1;
	var gap = Math.round(height_num*0.02);
	var hour_string;
	var min_string;
	var sec_string;
	var switch_true = true;
	var color = "rgb(40,230,105)";	//color of the digits
	var colorback = "rgb(14,42,14)";	//background color of the digits
	var count;

//positioning canvas
	canvas.style.marginLeft = -canvas.width*0.5 + 'px';
	canvas.style.marginTop = -canvas.height*0.5 + 'px';
//get the current time
	var ctx = canvas.getContext('2d');
	var hour = getHours();
	var min = getMin();
	var sec = getSec();
//initialization clock
	init_clock();
	setTimeout(second,1000);
	
//redefine the layout for clock at resize(orientationcange)
	window.addEventListener("resize", function(){
		if (mobile) {
			canvas.width = parseInt(document.documentElement.clientWidth*0.9);
			if (parseInt(canvas.width/3.3)%2 == 0) canvas.height = parseInt(canvas.width/3.3);
			else canvas.height = parseInt(canvas.width/3.3)+1;
			width_canvas = canvas.offsetWidth;
			height_canvas = canvas.offsetHeight;
			margin_up = Math.round(height_canvas*0.3/2);
			height_num = height_canvas - margin_up*2;
			width_num = Math.round(height_num/2);
			line_width = Math.round(width_num*0.23);
			width_points = Math.round(width_canvas*0.07);
			width_between_num = Math.round(width_num*0.1)+line_width;
			width_num_block = width_num*2 + width_between_num;
			margin_side = Math.round((width_canvas - width_points*2 - width_num_block*3)/2);
			num_shift = width_num+width_between_num;
			hour_blockY = margin_up;
			min_blockY = margin_up;
			sec_blockY = margin_up;
			hour_blockX = margin_side;
			min_blockX = hour_blockX + width_num_block + width_points;
			sec_blockX = min_blockX + width_num_block + width_points;
			rad_points = Math.round(height_num*0.035);
			angle = 180/step_angle;
			limit = angle/2 + 1;
			gap = Math.round(height_num*0.02);
			init_clock();
			count = 6;
		}
		
		canvas.style.marginLeft = -canvas.width*0.5 + 'px';
		canvas.style.marginTop = -canvas.height*0.5 + 'px';
		
	}, false);

	function init_clock(fix){
		if (fix) canvas.width = canvas.width; // canvas reset
		ctx.fillStyle = color;
		
		drawNumber(parseInt(hour/10),hour_blockX,hour_blockY,switch_true);
		drawNumber(hour%10,hour_blockX+num_shift,hour_blockY,switch_true);
		
		drawNumber(parseInt(min/10),min_blockX,min_blockY,switch_true);
		drawNumber(min%10,min_blockX+num_shift,min_blockY,switch_true);
		
		drawNumber(parseInt(sec/10),sec_blockX,sec_blockY,switch_true);
		drawNumber(sec%10,sec_blockX+num_shift,sec_blockY,switch_true);
		
		if (fix) count--;
		else clear_points();
	}

	function second(){
		sec++;
		draw_points();
		if(sec > 59) {
			sec = 0;
			five_zero(sec_blockX,sec_blockY);
			drawNumber(0,sec_blockX+num_shift,sec_blockY);
			min++;
			setTimeout(second,1000);
			if(min > 59) {
				min = 0;
				five_zero(min_blockX,min_blockY);
				drawNumber(0,min_blockX+num_shift,min_blockY);
				hour++;
				if(hour > 23) {
					hour = 0;
					two_zero(hour_blockX,hour_blockY);
					three_zero(hour_blockX+num_shift,hour_blockY);
				}
				else {
					if (hour%10 == 0) drawNumber(parseInt(hour/10),hour_blockX,hour_blockY);
					drawNumber(hour%10,hour_blockX+num_shift,hour_blockY);
				}
			}
			else {
				if (min%10 == 0) drawNumber(parseInt(min/10),min_blockX,min_blockY);
				drawNumber(min%10,min_blockX+num_shift,min_blockY);
			}
		}
		else {
			setTimeout(second,1000);
			if (sec%10 == 0) drawNumber(parseInt(sec/10),sec_blockX,sec_blockY);
			drawNumber(sec%10,sec_blockX+num_shift,sec_blockY);
		}
	}	
// draw the active points between the numbers
	function draw_points(){
		ctx.save();
		ctx.translate(hour_blockX+width_num_block+width_points/2,height_canvas/2);
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.fillRect(-rad_points,-height_num/6-2*rad_points,2*rad_points,2*rad_points);
		ctx.fillRect(-rad_points,height_num/6,2*rad_points,2*rad_points);
		ctx.translate(width_num_block+width_points,0);
		ctx.beginPath();
		ctx.fillRect(-rad_points,-height_num/6-2*rad_points,2*rad_points,2*rad_points);
		ctx.fillRect(-rad_points,height_num/6,2*rad_points,2*rad_points);
		ctx.restore();
		ctx.fillStyle = color;
	}
// clear the active points between the numbers
	function clear_points(){
		if (count>0) init_clock(switch_true);	//if resize display then fix
		ctx.save();
		ctx.translate(hour_blockX+width_num_block+line_width/2,0);
		ctx.clearRect(0,0,width_points-line_width,height_canvas);
		ctx.translate(width_num_block+width_points,0);
		ctx.clearRect(0,0,width_points-line_width,height_canvas);
		ctx.restore();
		ctx.save();
		ctx.fillStyle = colorback;
		ctx.translate(hour_blockX+width_num_block+width_points/2,height_canvas/2);
		ctx.beginPath();
		ctx.fillRect(-rad_points,-height_num/6-2*rad_points,2*rad_points,2*rad_points);
		ctx.fillRect(-rad_points,height_num/6,2*rad_points,2*rad_points);
		ctx.translate(width_num_block+width_points,0);
		ctx.beginPath();
		ctx.fillRect(-rad_points,-height_num/6-2*rad_points,2*rad_points,2*rad_points);
		ctx.fillRect(-rad_points,height_num/6,2*rad_points,2*rad_points);
		ctx.fill();
		ctx.restore();
	}
// function that animates the transitions between numbers
	function zero_one(x,y,start) {
		var i = 0;
		if (start) i = limit-1;
		function inner_zero_one(x,y) {
			ctx.save();
			ctx.translate(x,y);
			ctx.clearRect(-line_width/2,-line_width/2,width_num+line_width/2,height_num+line_width/2);
			background(0,0);
			ctx.globalAlpha = (((limit-1)-i)/(limit-1));
			
			ctx.beginPath();
			ctx.moveTo(0,gap);
			ctx.lineTo(-line_width/2,line_width/2+gap);
			ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
			ctx.lineTo(0,height_num/2-gap);
			ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
			ctx.lineTo(line_width/2,line_width/2+gap);
			ctx.fill();
			ctx.beginPath();
			ctx.moveTo(0,height_num/2+gap);
			ctx.lineTo(-line_width/2,height_num/2+line_width/2+gap);
			ctx.lineTo(-line_width/2,height_num-line_width/2-gap);
			ctx.lineTo(0,height_num-gap);
			ctx.lineTo(line_width/2,height_num-line_width/2-gap);
			ctx.lineTo(line_width/2,height_num/2+line_width/2+gap);
			ctx.fill();

			ctx.globalAlpha = 1;
			ctx.translate(width_num,0);
			ctx.rotate(-(Math.PI/angle)*i);
			
			ctx.beginPath();
			ctx.moveTo(-width_num+gap,0);
			ctx.lineTo(-width_num+line_width/2+gap,-line_width/2);
			ctx.lineTo(-line_width/2-gap,-line_width/2);
			ctx.lineTo(-gap,0);
			ctx.lineTo(-line_width/2-gap,line_width/2);
			ctx.lineTo(-width_num+line_width/2+gap,line_width/2);
			ctx.fill();
			
			ctx.rotate((Math.PI/angle)*i);
			ctx.translate(0,height_num);
			ctx.rotate((Math.PI/angle)*i);
			
			ctx.beginPath();
			ctx.moveTo(-width_num+gap,0);
			ctx.lineTo(-width_num+line_width/2+gap,-line_width/2);
			ctx.lineTo(-line_width/2-gap,-line_width/2);
			ctx.lineTo(-gap,0);
			ctx.lineTo(-line_width/2-gap,line_width/2);
			ctx.lineTo(-width_num+line_width/2+gap,line_width/2);
			ctx.fill();
			i++;
			ctx.restore();
			if (i<=limit) {
				ctx.save();
				ctx.translate(x+width_num,y);
				ctx.beginPath();
				ctx.moveTo(0,gap);
				ctx.lineTo(-line_width/2,line_width/2+gap);
				ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(0,height_num/2-gap);
				ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(line_width/2,line_width/2+gap);
				ctx.fill();
				
				ctx.translate(0,height_num/2);
				
				ctx.beginPath();
				ctx.moveTo(0,gap);
				ctx.lineTo(-line_width/2,line_width/2+gap);
				ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(0,height_num/2-gap);
				ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(line_width/2,line_width/2+gap);
				ctx.fill();
				ctx.restore();
				if (i<limit) { 
					setTimeout(function(){inner_zero_one(x,y)},1);
				}
				else if (!start) clear_points();
			}
		}
		inner_zero_one(x,y);
	}
// function that animates the transitions between numbers
	function one_two(x,y,start) {
		var i = 0;
		if (start) i = limit-1;
		function inner_one_two(x,y) {
			ctx.save();
			ctx.translate(x,y);
			ctx.clearRect(-line_width/2,-line_width/2,width_num+line_width/2,height_num+line_width/2);
			background(0,0);
			ctx.globalAlpha = (i/(limit-1));
			
			ctx.translate(0,height_num/2);
			
			ctx.beginPath();
			ctx.moveTo(0,gap);
			ctx.lineTo(-line_width/2,line_width/2+gap);
			ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
			ctx.lineTo(0,height_num/2-gap);
			ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
			ctx.lineTo(line_width/2,line_width/2+gap);
			ctx.fill();
			
			ctx.translate(0,height_num/2);
			
			ctx.beginPath();
			ctx.moveTo(gap,0);
			ctx.lineTo(line_width/2+gap,-line_width/2);
			ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
			ctx.lineTo(width_num-gap,0);
			ctx.lineTo(width_num-line_width/2-gap,line_width/2);
			ctx.lineTo(line_width/2+gap,line_width/2);
			ctx.fill(); // -

			ctx.globalAlpha = 1;

			ctx.translate(width_num,-height_num);
			ctx.rotate(-(Math.PI/2)+(Math.PI/angle)*i);

			ctx.beginPath();
			ctx.moveTo(-width_num+gap,0);
			ctx.lineTo(-width_num+line_width/2+gap,-line_width/2);
			ctx.lineTo(-line_width/2-gap,-line_width/2);
			ctx.lineTo(-gap,0);
			ctx.lineTo(-line_width/2-gap,line_width/2);
			ctx.lineTo(-width_num+line_width/2+gap,line_width/2);
			ctx.fill();		
			ctx.rotate((Math.PI/2)-(Math.PI/angle)*i);

			ctx.translate(0,height_num/2);
			ctx.rotate(-(Math.PI/2)+(Math.PI/angle)*i);

			ctx.beginPath();
			ctx.moveTo(-width_num+gap,0);
			ctx.lineTo(-width_num+line_width/2+gap,-line_width/2);
			ctx.lineTo(-line_width/2-gap,-line_width/2);
			ctx.lineTo(-gap,0);
			ctx.lineTo(-line_width/2-gap,line_width/2);
			ctx.lineTo(-width_num+line_width/2+gap,line_width/2);
			ctx.fill();
			i++;
			ctx.restore();
			if (i<=limit) {
				ctx.save();
				ctx.translate(x+width_num,y);	
				ctx.beginPath();
				ctx.moveTo(0,gap);
				ctx.lineTo(-line_width/2,line_width/2+gap);
				ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(0,height_num/2-gap);
				ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(line_width/2,line_width/2+gap);
				ctx.fill();	
				ctx.restore();
				if (i<limit) { 
					setTimeout(function(){inner_one_two(x,y)},1);
				}
				else if (!start) clear_points();
			}
		}
		inner_one_two(x,y);
	}
// function that animates the transitions between numbers
	function two_three(x,y,start) {
		var i = 0;
		if (start) i = limit-1;
		function inner_two_three(x,y) {
			ctx.save();
			ctx.translate(x,y);
			ctx.clearRect(-line_width/2,-line_width/2,width_num+line_width/2,height_num+line_width/2);
			background(0,0);

			ctx.translate(0,height_num);
			ctx.rotate(-(Math.PI/2)+(Math.PI/angle)*i);

			ctx.beginPath();
			ctx.moveTo(gap,0);
			ctx.lineTo(line_width/2+gap,-line_width/2);
			ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
			ctx.lineTo(width_num-gap,0);
			ctx.lineTo(width_num-line_width/2-gap,line_width/2);
			ctx.lineTo(line_width/2+gap,line_width/2);
			ctx.fill(); // -
			ctx.rotate((Math.PI/2)-(Math.PI/angle)*i);

			ctx.translate(width_num,0);
			ctx.rotate((Math.PI/angle)*i);

			ctx.beginPath();
			ctx.moveTo(-width_num+gap,0);
			ctx.lineTo(-width_num+line_width/2+gap,-line_width/2);
			ctx.lineTo(-line_width/2-gap,-line_width/2);
			ctx.lineTo(-gap,0);
			ctx.lineTo(-line_width/2-gap,line_width/2);
			ctx.lineTo(-width_num+line_width/2+gap,line_width/2);
			ctx.fill();	// -|
			i++;
			ctx.restore();
			if (i<=limit) {
				ctx.save();
				ctx.translate(x,y);
				ctx.beginPath();
				ctx.moveTo(gap,0);
				ctx.lineTo(line_width/2+gap,-line_width/2);
				ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
				ctx.lineTo(width_num-gap,0);
				ctx.lineTo(width_num-line_width/2-gap,line_width/2);
				ctx.lineTo(line_width/2+gap,line_width/2);
				ctx.fill(); // -
				ctx.translate(0,height_num/2);
				ctx.beginPath();
				ctx.moveTo(gap,0);
				ctx.lineTo(line_width/2+gap,-line_width/2);
				ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
				ctx.lineTo(width_num-gap,0);
				ctx.lineTo(width_num-line_width/2-gap,line_width/2);
				ctx.lineTo(line_width/2+gap,line_width/2);
				ctx.fill(); // -
				ctx.translate(width_num,-height_num/2);
				ctx.beginPath();
				ctx.moveTo(0,gap);
				ctx.lineTo(-line_width/2,line_width/2+gap);
				ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(0,height_num/2-gap);
				ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(line_width/2,line_width/2+gap);
				ctx.fill(); // |
				ctx.restore();
				if (i<limit) { 
					setTimeout(function(){inner_two_three(x,y)},1);
				}
				else if (!start) clear_points();
			}
		}
		inner_two_three(x,y);
	}
// function that animates the transitions between numbers	
	function three_four(x,y,start) {
		var i = 0;
		if (start) i = limit-1;
		function inner_three_four(x,y) {
			ctx.save();
			ctx.translate(x,y);
			ctx.clearRect(-line_width/2,-line_width/2,width_num+line_width/2,height_num+line_width/2);
			background(0,0);
			
			ctx.rotate((Math.PI/angle)*i);
			
			ctx.beginPath();
			ctx.moveTo(gap,0);
			ctx.lineTo(line_width/2+gap,-line_width/2);
			ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
			ctx.lineTo(width_num-gap,0);
			ctx.lineTo(width_num-line_width/2-gap,line_width/2);
			ctx.lineTo(line_width/2+gap,line_width/2);
			ctx.fill(); // -
			ctx.rotate(-(Math.PI/angle)*i);
			
			ctx.translate(width_num,height_num);
			ctx.rotate((Math.PI/angle)*i);
			
			ctx.beginPath();
			ctx.moveTo(-width_num+gap,0);
			ctx.lineTo(-width_num+line_width/2+gap,-line_width/2);
			ctx.lineTo(-line_width/2-gap,-line_width/2);
			ctx.lineTo(-gap,0);
			ctx.lineTo(-line_width/2-gap,line_width/2);
			ctx.lineTo(-width_num+line_width/2+gap,line_width/2);
			ctx.fill();	// -|
			i++;
			ctx.restore();
			if (i<=limit) {
				ctx.save();
				ctx.translate(x+width_num,y);
				ctx.beginPath();
				ctx.moveTo(0,gap);
				ctx.lineTo(-line_width/2,line_width/2+gap);
				ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(0,height_num/2-gap);
				ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(line_width/2,line_width/2+gap);
				ctx.fill(); // |
				ctx.translate(0,height_num/2);
				ctx.beginPath();
				ctx.moveTo(0,gap);
				ctx.lineTo(-line_width/2,line_width/2+gap);
				ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(0,height_num/2-gap);
				ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(line_width/2,line_width/2+gap);
				ctx.fill(); // |
				ctx.translate(-width_num,0);
				ctx.beginPath();
				ctx.moveTo(gap,0);
				ctx.lineTo(line_width/2+gap,-line_width/2);
				ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
				ctx.lineTo(width_num-gap,0);
				ctx.lineTo(width_num-line_width/2-gap,line_width/2);
				ctx.lineTo(line_width/2+gap,line_width/2);
				ctx.fill(); // -
				ctx.restore();
				if (i<limit) { 
					setTimeout(function(){inner_three_four(x,y)},1);
				}
				else if (!start) clear_points();
			}
		}
		inner_three_four(x,y);
	}
// function that animates the transitions between numbers	
	function four_five(x,y,start) {
		var i = 0;
		if (start) i = limit-1;
		function inner_four_five(x,y) {
			ctx.save();
			ctx.translate(x,y);
			ctx.clearRect(-line_width/2,-line_width/2,width_num+line_width/2,height_num+line_width/2);
			background(0,0);

			ctx.translate(width_num,0);
			ctx.rotate(-(Math.PI/2)+(Math.PI/angle)*i);

			ctx.beginPath();
			ctx.moveTo(-width_num+gap,0);
			ctx.lineTo(-width_num+line_width/2+gap,-line_width/2);
			ctx.lineTo(-line_width/2-gap,-line_width/2);
			ctx.lineTo(-gap,0);
			ctx.lineTo(-line_width/2-gap,line_width/2);
			ctx.lineTo(-width_num+line_width/2+gap,line_width/2);
			ctx.fill();	// -|
			ctx.rotate((Math.PI/2)-(Math.PI/angle)*i);

			ctx.translate(0,height_num);
			ctx.rotate((Math.PI/2)-(Math.PI/angle)*i);
			ctx.beginPath();
			ctx.moveTo(-width_num+gap,0);
			ctx.lineTo(-width_num+line_width/2+gap,-line_width/2);
			ctx.lineTo(-line_width/2-gap,-line_width/2);
			ctx.lineTo(-gap,0);
			ctx.lineTo(-line_width/2-gap,line_width/2);
			ctx.lineTo(-width_num+line_width/2+gap,line_width/2);
			ctx.fill();	// -|
			i++;
			ctx.restore();
			if (i<=limit) {
				ctx.save();
				ctx.translate(x,y);
				ctx.beginPath();
				ctx.moveTo(0,gap);
				ctx.lineTo(-line_width/2,line_width/2+gap);
				ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(0,height_num/2-gap);
				ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(line_width/2,line_width/2+gap);
				ctx.fill(); // |
				ctx.translate(0,height_num/2);
				ctx.beginPath();
				ctx.moveTo(gap,0);
				ctx.lineTo(line_width/2+gap,-line_width/2);
				ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
				ctx.lineTo(width_num-gap,0);
				ctx.lineTo(width_num-line_width/2-gap,line_width/2);
				ctx.lineTo(line_width/2+gap,line_width/2);
				ctx.fill(); // -
				ctx.translate(width_num,0);
				ctx.beginPath();
				ctx.moveTo(0,gap);
				ctx.lineTo(-line_width/2,line_width/2+gap);
				ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(0,height_num/2-gap);
				ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(line_width/2,line_width/2+gap);
				ctx.fill(); // |
				ctx.restore();
				if (i<limit) { 
					setTimeout(function(){inner_four_five(x,y)},1);
				}
				else if (!start) clear_points();
			}
		}
		inner_four_five(x,y);
	}
// function that animates the transitions between numbers
	function five_six(x,y,start) {
		var i = 0;
		if (start) i = limit-1;
		function inner_five_six(x,y) {
			ctx.save();
			ctx.translate(x,y);
			ctx.clearRect(-line_width/2,-line_width/2,width_num+line_width/2,height_num+line_width/2);
			background(0,0);
			
			ctx.translate(0,height_num/2);
			ctx.rotate((Math.PI/angle)*i);
			
			ctx.beginPath();
			ctx.moveTo(gap,0);
			ctx.lineTo(line_width/2+gap,-line_width/2);
			ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
			ctx.lineTo(width_num-gap,0);
			ctx.lineTo(width_num-line_width/2-gap,line_width/2);
			ctx.lineTo(line_width/2+gap,line_width/2);
			ctx.fill(); // -
			i++;
			ctx.restore();
			if (i<=limit) {
				ctx.save();
				ctx.translate(x,y);
				ctx.beginPath();
				ctx.moveTo(0,gap);
				ctx.lineTo(-line_width/2,line_width/2+gap);
				ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(0,height_num/2-gap);
				ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(line_width/2,line_width/2+gap);
				ctx.fill(); // |
				ctx.beginPath();
				ctx.moveTo(gap,0);
				ctx.lineTo(line_width/2+gap,-line_width/2);
				ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
				ctx.lineTo(width_num-gap,0);
				ctx.lineTo(width_num-line_width/2-gap,line_width/2);
				ctx.lineTo(line_width/2+gap,line_width/2);
				ctx.fill(); // -
				ctx.translate(0,height_num/2);
				ctx.beginPath();
				ctx.moveTo(gap,0);
				ctx.lineTo(line_width/2+gap,-line_width/2);
				ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
				ctx.lineTo(width_num-gap,0);
				ctx.lineTo(width_num-line_width/2-gap,line_width/2);
				ctx.lineTo(line_width/2+gap,line_width/2);
				ctx.fill(); // -
				ctx.translate(0,height_num/2);
				ctx.beginPath();
				ctx.moveTo(gap,0);
				ctx.lineTo(line_width/2+gap,-line_width/2);
				ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
				ctx.lineTo(width_num-gap,0);
				ctx.lineTo(width_num-line_width/2-gap,line_width/2);
				ctx.lineTo(line_width/2+gap,line_width/2);
				ctx.fill(); // -
				ctx.translate(width_num,-height_num/2);
				ctx.beginPath();
				ctx.moveTo(0,gap);
				ctx.lineTo(-line_width/2,line_width/2+gap);
				ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(0,height_num/2-gap);
				ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(line_width/2,line_width/2+gap);
				ctx.fill(); // |
				ctx.restore();
				if (i<limit) { 
					setTimeout(function(){inner_five_six(x,y)},1);
				}
				else if (!start) clear_points();
			}
		}
		inner_five_six(x,y);
	}
// function that animates the transitions between numbers
	function six_seven(x,y,start) {
		var i = 0;
		if (start) i = limit-1;
		function inner_six_seven(x,y) {
			ctx.save();
			ctx.translate(x,y);
			ctx.clearRect(-line_width/2,-line_width/2,width_num+line_width/2,height_num+line_width/2);
			background(0,0);
			
			ctx.globalAlpha = (((limit-1)-i)/(limit-1));
			ctx.translate(0,height_num/2);
			
			ctx.beginPath();
			ctx.moveTo(0,gap);
			ctx.lineTo(-line_width/2,line_width/2+gap);
			ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
			ctx.lineTo(0,height_num/2-gap);
			ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
			ctx.lineTo(line_width/2,line_width/2+gap);
			ctx.fill(); // |
			ctx.globalAlpha = 1;
			
			ctx.translate(0,-height_num/2);
			ctx.rotate((Math.PI/2)-(Math.PI/angle)*i);
			
			ctx.beginPath();
			ctx.moveTo(gap,0);
			ctx.lineTo(line_width/2+gap,-line_width/2);
			ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
			ctx.lineTo(width_num-gap,0);
			ctx.lineTo(width_num-line_width/2-gap,line_width/2);
			ctx.lineTo(line_width/2+gap,line_width/2);
			ctx.fill(); // -
			ctx.rotate(-(Math.PI/2)+(Math.PI/angle)*i);
			
			ctx.translate(width_num,height_num/2);
			ctx.rotate((Math.PI/angle)*i);
			
			ctx.beginPath();
			ctx.moveTo(-width_num+gap,0);
			ctx.lineTo(-width_num+line_width/2+gap,-line_width/2);
			ctx.lineTo(-line_width/2-gap,-line_width/2);
			ctx.lineTo(-gap,0);
			ctx.lineTo(-line_width/2-gap,line_width/2);
			ctx.lineTo(-width_num+line_width/2+gap,line_width/2);
			ctx.fill();	// -|
			ctx.rotate(-(Math.PI/angle)*i);
			
			ctx.translate(0,height_num/2);
			ctx.rotate((Math.PI/angle)*i);
			
			ctx.beginPath();
			ctx.moveTo(-width_num+gap,0);
			ctx.lineTo(-width_num+line_width/2+gap,-line_width/2);
			ctx.lineTo(-line_width/2-gap,-line_width/2);
			ctx.lineTo(-gap,0);
			ctx.lineTo(-line_width/2-gap,line_width/2);
			ctx.lineTo(-width_num+line_width/2+gap,line_width/2);
			ctx.fill();	// -|
			i++;
			ctx.restore();
			if (i<=limit) {
				ctx.save();
				ctx.translate(x,y);
				ctx.beginPath();
				ctx.moveTo(gap,0);
				ctx.lineTo(line_width/2+gap,-line_width/2);
				ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
				ctx.lineTo(width_num-gap,0);
				ctx.lineTo(width_num-line_width/2-gap,line_width/2);
				ctx.lineTo(line_width/2+gap,line_width/2);
				ctx.fill(); // -
				ctx.translate(width_num,height_num/2);
				ctx.beginPath();
				ctx.moveTo(0,gap);
				ctx.lineTo(-line_width/2,line_width/2+gap);
				ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(0,height_num/2-gap);
				ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(line_width/2,line_width/2+gap);
				ctx.fill(); // |
				ctx.restore();
				if (i<limit) { 
					setTimeout(function(){inner_six_seven(x,y)},1);
				}
				else if (!start) clear_points();
			}
		}
		inner_six_seven(x,y);
	}
// function that animates the transitions between numbers
	function seven_eight(x,y,start) {
		var i = 0;
		if (start) i = limit-1;
		function inner_seven_eight(x,y) {
			ctx.save();
			ctx.translate(x,y);
			ctx.clearRect(-line_width/2,-line_width/2,width_num+line_width/2,height_num+line_width/2);
			background(0,0);
			ctx.globalAlpha = (i/(limit-1));
			ctx.translate(0,height_num/2);

			ctx.beginPath();
			ctx.moveTo(0,gap);
			ctx.lineTo(-line_width/2,line_width/2+gap);
			ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
			ctx.lineTo(0,height_num/2-gap);
			ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
			ctx.lineTo(line_width/2,line_width/2+gap);
			ctx.fill(); // |
			ctx.globalAlpha = 1;

			ctx.translate(0,-height_num/2);
			ctx.rotate((Math.PI/angle)*i);

			ctx.beginPath();
			ctx.moveTo(gap,0);
			ctx.lineTo(line_width/2+gap,-line_width/2);
			ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
			ctx.lineTo(width_num-gap,0);
			ctx.lineTo(width_num-line_width/2-gap,line_width/2);
			ctx.lineTo(line_width/2+gap,line_width/2);
			ctx.fill(); // -
			ctx.rotate(-(Math.PI/angle)*i);

			ctx.translate(width_num,height_num/2);
			ctx.rotate((Math.PI/2)-((Math.PI/angle)*i));

			ctx.beginPath();
			ctx.moveTo(-width_num+gap,0);
			ctx.lineTo(-width_num+line_width/2+gap,-line_width/2);
			ctx.lineTo(-line_width/2-gap,-line_width/2);
			ctx.lineTo(-gap,0);
			ctx.lineTo(-line_width/2-gap,line_width/2);
			ctx.lineTo(-width_num+line_width/2+gap,line_width/2);
			ctx.fill();	// -|
			ctx.rotate(-(Math.PI/2)+((Math.PI/angle)*i));

			ctx.translate(0,height_num/2);
			ctx.rotate((Math.PI/2)-(Math.PI/angle)*i);

			ctx.beginPath();
			ctx.moveTo(-width_num+gap,0);
			ctx.lineTo(-width_num+line_width/2+gap,-line_width/2);
			ctx.lineTo(-line_width/2-gap,-line_width/2);
			ctx.lineTo(-gap,0);
			ctx.lineTo(-line_width/2-gap,line_width/2);
			ctx.lineTo(-width_num+line_width/2+gap,line_width/2);
			ctx.fill();	// -|
			i++;
			ctx.restore();
			if (i<=limit) {
				ctx.save();
				ctx.translate(x,y);
				ctx.beginPath();
				ctx.moveTo(gap,0);
				ctx.lineTo(line_width/2+gap,-line_width/2);
				ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
				ctx.lineTo(width_num-gap,0);
				ctx.lineTo(width_num-line_width/2-gap,line_width/2);
				ctx.lineTo(line_width/2+gap,line_width/2);
				ctx.fill(); // -
				ctx.translate(width_num,0);
				ctx.beginPath();
				ctx.moveTo(0,gap);
				ctx.lineTo(-line_width/2,line_width/2+gap);
				ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(0,height_num/2-gap);
				ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(line_width/2,line_width/2+gap);
				ctx.fill(); // |
				ctx.translate(0,height_num/2);
				ctx.beginPath();
				ctx.moveTo(0,gap);
				ctx.lineTo(-line_width/2,line_width/2+gap);
				ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(0,height_num/2-gap);
				ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(line_width/2,line_width/2+gap);
				ctx.fill(); // |
				ctx.restore();
				if (i<limit) { 
					setTimeout(function(){inner_seven_eight(x,y)},1);
				}
				else if (!start) clear_points();
			}
		}
		inner_seven_eight(x,y);
	}
// function that animates the transitions between numbers
	function eight_nine(x,y,start) {
		var i = 0;
		if (start) i = limit-1;
		function inner_eight_nine(x,y) {
			ctx.save();
			ctx.translate(x,y);
			ctx.clearRect(-line_width/2,-line_width/2,width_num+line_width/2,height_num+line_width/2);
			background(0,0);

			ctx.translate(0,height_num);
			ctx.rotate((Math.PI/2)+((Math.PI/angle)*i));

			ctx.beginPath();
			ctx.moveTo(-width_num+gap,0);
			ctx.lineTo(-width_num+line_width/2+gap,-line_width/2);
			ctx.lineTo(-line_width/2-gap,-line_width/2);
			ctx.lineTo(-gap,0);
			ctx.lineTo(-line_width/2-gap,line_width/2);
			ctx.lineTo(-width_num+line_width/2+gap,line_width/2);
			ctx.fill();	// -|
			i++;
			ctx.restore();
			if (i<=limit) {
				ctx.save();
				ctx.translate(x,y);
				ctx.beginPath();
				ctx.moveTo(0,gap);
				ctx.lineTo(-line_width/2,line_width/2+gap);
				ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(0,height_num/2-gap);
				ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(line_width/2,line_width/2+gap);
				ctx.fill(); // |
				ctx.beginPath();
				ctx.moveTo(gap,0);
				ctx.lineTo(line_width/2+gap,-line_width/2);
				ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
				ctx.lineTo(width_num-gap,0);
				ctx.lineTo(width_num-line_width/2-gap,line_width/2);
				ctx.lineTo(line_width/2+gap,line_width/2);
				ctx.fill(); // -
				ctx.translate(0,height_num/2);
				ctx.beginPath();
				ctx.moveTo(gap,0);
				ctx.lineTo(line_width/2+gap,-line_width/2);
				ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
				ctx.lineTo(width_num-gap,0);
				ctx.lineTo(width_num-line_width/2-gap,line_width/2);
				ctx.lineTo(line_width/2+gap,line_width/2);
				ctx.fill(); // -
				ctx.translate(width_num,-height_num/2);
				ctx.beginPath();
				ctx.moveTo(0,gap);
				ctx.lineTo(-line_width/2,line_width/2+gap);
				ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(0,height_num/2-gap);
				ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(line_width/2,line_width/2+gap);
				ctx.fill(); // |
				ctx.translate(0,height_num/2);
				ctx.beginPath();
				ctx.moveTo(0,gap);
				ctx.lineTo(-line_width/2,line_width/2+gap);
				ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(0,height_num/2-gap);
				ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(line_width/2,line_width/2+gap);
				ctx.fill(); // |
				ctx.translate(-width_num,0);
				ctx.beginPath();
				ctx.moveTo(gap,0);
				ctx.lineTo(line_width/2+gap,-line_width/2);
				ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
				ctx.lineTo(width_num-gap,0);
				ctx.lineTo(width_num-line_width/2-gap,line_width/2);
				ctx.lineTo(line_width/2+gap,line_width/2);
				ctx.fill(); // -
				ctx.translate(0,height_num/2);
				ctx.beginPath();
				ctx.moveTo(gap,0);
				ctx.lineTo(line_width/2+gap,-line_width/2);
				ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
				ctx.lineTo(width_num-gap,0);
				ctx.lineTo(width_num-line_width/2-gap,line_width/2);
				ctx.lineTo(line_width/2+gap,line_width/2);
				ctx.fill(); // -
				ctx.restore();
				if (i<limit) { 
					setTimeout(function(){inner_eight_nine(x,y)},1);
				}
				else if (!start) clear_points();
			}
		}
		inner_eight_nine(x,y);
	}
// function that animates the transitions between numbers
	function nine_zero(x,y,start) {
		var i = 0;
		if (start) i = limit-1;
		function inner_nine_zero(x,y) {
			ctx.save();
			ctx.translate(x,y);
			ctx.clearRect(-line_width/2,-line_width/2,width_num+line_width/2,height_num+line_width/2);
			background(0,0);

			ctx.translate(0,height_num/2);
			ctx.rotate((Math.PI/angle)*i);

			ctx.beginPath();
			ctx.moveTo(gap,0);
			ctx.lineTo(line_width/2+gap,-line_width/2);
			ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
			ctx.lineTo(width_num-gap,0);
			ctx.lineTo(width_num-line_width/2-gap,line_width/2);
			ctx.lineTo(line_width/2+gap,line_width/2);
			ctx.fill(); // -
			i++;
			ctx.restore();
			if (i<=limit) {
				ctx.save();
				ctx.translate(x,y);
				ctx.beginPath();
				ctx.moveTo(0,gap);
				ctx.lineTo(-line_width/2,line_width/2+gap);
				ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(0,height_num/2-gap);
				ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(line_width/2,line_width/2+gap);
				ctx.fill(); // |
				ctx.beginPath();
				ctx.moveTo(gap,0);
				ctx.lineTo(line_width/2+gap,-line_width/2);
				ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
				ctx.lineTo(width_num-gap,0);
				ctx.lineTo(width_num-line_width/2-gap,line_width/2);
				ctx.lineTo(line_width/2+gap,line_width/2);
				ctx.fill(); // -

				ctx.translate(width_num,0);
				ctx.beginPath();
				ctx.moveTo(0,gap);
				ctx.lineTo(-line_width/2,line_width/2+gap);
				ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(0,height_num/2-gap);
				ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(line_width/2,line_width/2+gap);
				ctx.fill(); // |
				ctx.translate(0,height_num/2);
				ctx.beginPath();
				ctx.moveTo(0,gap);
				ctx.lineTo(-line_width/2,line_width/2+gap);
				ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(0,height_num/2-gap);
				ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(line_width/2,line_width/2+gap);
				ctx.fill(); // |
				ctx.translate(-width_num,height_num/2);
				ctx.beginPath();
				ctx.moveTo(gap,0);
				ctx.lineTo(line_width/2+gap,-line_width/2);
				ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
				ctx.lineTo(width_num-gap,0);
				ctx.lineTo(width_num-line_width/2-gap,line_width/2);
				ctx.lineTo(line_width/2+gap,line_width/2);
				ctx.fill(); // -
				ctx.restore();
				if (i<limit) { 
					setTimeout(function(){inner_nine_zero(x,y)},1);
				}
				else if (!start) clear_points();
			}
		}
		inner_nine_zero(x,y);
	}
// function that animates the transitions between numbers
	function two_zero(x,y) {
		var i = 0;
		function inner_two_zero(x,y) {
			ctx.save();
			ctx.translate(x,y);
			ctx.clearRect(-line_width/2,-line_width/2,width_num+line_width/2,height_num+line_width/2);
			background(0,0);

			ctx.rotate((Math.PI/angle)*i);

			ctx.beginPath();
			ctx.moveTo(gap,0);
			ctx.lineTo(line_width/2+gap,-line_width/2);
			ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
			ctx.lineTo(width_num-gap,0);
			ctx.lineTo(width_num-line_width/2-gap,line_width/2);
			ctx.lineTo(line_width/2+gap,line_width/2);
			ctx.fill(); // -
			ctx.rotate(-(Math.PI/angle)*i);

			ctx.translate(width_num,height_num/2);
			ctx.rotate(-(Math.PI/angle)*i);

			ctx.beginPath();
			ctx.moveTo(-width_num+gap,0);
			ctx.lineTo(-width_num+line_width/2+gap,-line_width/2);
			ctx.lineTo(-line_width/2-gap,-line_width/2);
			ctx.lineTo(-gap,0);
			ctx.lineTo(-line_width/2-gap,line_width/2);
			ctx.lineTo(-width_num+line_width/2+gap,line_width/2);
			ctx.fill();	// -|
			i++;
			ctx.restore();
			if (i<=limit) {
				ctx.save();
				ctx.translate(x,y);
				ctx.beginPath();
				ctx.moveTo(gap,0);
				ctx.lineTo(line_width/2+gap,-line_width/2);
				ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
				ctx.lineTo(width_num-gap,0);
				ctx.lineTo(width_num-line_width/2-gap,line_width/2);
				ctx.lineTo(line_width/2+gap,line_width/2);
				ctx.fill(); // -
				ctx.translate(0,height_num/2);
				ctx.beginPath();
				ctx.moveTo(0,gap);
				ctx.lineTo(-line_width/2,line_width/2+gap);
				ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(0,height_num/2-gap);
				ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(line_width/2,line_width/2+gap);
				ctx.fill(); // |
				ctx.translate(width_num,-height_num/2);
				ctx.beginPath();
				ctx.moveTo(0,gap);
				ctx.lineTo(-line_width/2,line_width/2+gap);
				ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(0,height_num/2-gap);
				ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(line_width/2,line_width/2+gap);
				ctx.fill(); // |
				ctx.translate(-width_num,height_num);
				ctx.beginPath();
				ctx.moveTo(gap,0);
				ctx.lineTo(line_width/2+gap,-line_width/2);
				ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
				ctx.lineTo(width_num-gap,0);
				ctx.lineTo(width_num-line_width/2-gap,line_width/2);
				ctx.lineTo(line_width/2+gap,line_width/2);
				ctx.fill(); // -
				ctx.restore();
				if (i<limit) { 
					setTimeout(function(){inner_two_zero(x,y)},1);
				}
			}
		}
		inner_two_zero(x,y);
	}
// function that animates the transitions between numbers
	function three_zero(x,y) {
		var i = 0;
		function inner_three_zero(x,y) {
			ctx.save();
			ctx.translate(x,y);
			ctx.clearRect(-line_width/2,-line_width/2,width_num+line_width/2,height_num+line_width/2);
			background(0,0);
			
			ctx.translate(0,height_num/2);
			ctx.rotate(-(Math.PI/angle)*i);
			
			ctx.beginPath();
			ctx.moveTo(gap,0);
			ctx.lineTo(line_width/2+gap,-line_width/2);
			ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
			ctx.lineTo(width_num-gap,0);
			ctx.lineTo(width_num-line_width/2-gap,line_width/2);
			ctx.lineTo(line_width/2+gap,line_width/2);
			ctx.fill(); // -
			ctx.rotate((Math.PI/angle)*i);

			ctx.translate(0,height_num/2);
			ctx.rotate(-(Math.PI/angle)*i);

			ctx.moveTo(gap,0);
			ctx.lineTo(line_width/2+gap,-line_width/2);
			ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
			ctx.lineTo(width_num-gap,0);
			ctx.lineTo(width_num-line_width/2-gap,line_width/2);
			ctx.lineTo(line_width/2+gap,line_width/2);
			ctx.fill(); // -
			i++;
			ctx.restore();
			if (i<=limit) {
				ctx.save();
				ctx.translate(x,y);
				ctx.beginPath();
				ctx.moveTo(gap,0);
				ctx.lineTo(line_width/2+gap,-line_width/2);
				ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
				ctx.lineTo(width_num-gap,0);
				ctx.lineTo(width_num-line_width/2-gap,line_width/2);
				ctx.lineTo(line_width/2+gap,line_width/2);
				ctx.fill(); // -
				ctx.translate(0,height_num);
				ctx.beginPath();
				ctx.moveTo(gap,0);
				ctx.lineTo(line_width/2+gap,-line_width/2);
				ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
				ctx.lineTo(width_num-gap,0);
				ctx.lineTo(width_num-line_width/2-gap,line_width/2);
				ctx.lineTo(line_width/2+gap,line_width/2);
				ctx.fill(); // -
				ctx.translate(width_num,-height_num);
				ctx.beginPath();
				ctx.moveTo(0,gap);
				ctx.lineTo(-line_width/2,line_width/2+gap);
				ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(0,height_num/2-gap);
				ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(line_width/2,line_width/2+gap);
				ctx.fill(); // |
				ctx.translate(0,height_num/2);
				ctx.beginPath();
				ctx.moveTo(0,gap);
				ctx.lineTo(-line_width/2,line_width/2+gap);
				ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(0,height_num/2-gap);
				ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(line_width/2,line_width/2+gap);
				ctx.fill(); // |

				ctx.restore();
				if (i<limit) { 
					setTimeout(function(){inner_three_zero(x,y)},1);
				}
			}
		}
		inner_three_zero(x,y);
	}
// function that animates the transitions between numbers
	function five_zero(x,y) {
		var i = 0;
		function inner_five_zero(x,y) {
			ctx.save();
			ctx.translate(x,y);
			ctx.clearRect(-line_width/2,-line_width/2,width_num+line_width/2,height_num+line_width/2);
			background(0,0);

			ctx.translate(width_num,0);
			ctx.rotate(-(Math.PI/angle)*i);

			ctx.beginPath();
			ctx.moveTo(-width_num+gap,0);
			ctx.lineTo(-width_num+line_width/2+gap,-line_width/2);
			ctx.lineTo(-line_width/2-gap,-line_width/2);
			ctx.lineTo(-gap,0);
			ctx.lineTo(-line_width/2-gap,line_width/2);
			ctx.lineTo(-width_num+line_width/2+gap,line_width/2);
			ctx.fill();	// -|
			ctx.rotate((Math.PI/angle)*i);

			ctx.translate(-width_num,height_num/2);
			ctx.rotate((Math.PI/angle)*i);

			ctx.beginPath();
			ctx.moveTo(gap,0);
			ctx.lineTo(line_width/2+gap,-line_width/2);
			ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
			ctx.lineTo(width_num-gap,0);
			ctx.lineTo(width_num-line_width/2-gap,line_width/2);
			ctx.lineTo(line_width/2+gap,line_width/2);
			ctx.fill(); // -
			i++;
			ctx.restore();
			if (i<=limit) {
				ctx.save();
				ctx.translate(x,y);
				ctx.beginPath();
				ctx.moveTo(0,gap);
				ctx.lineTo(-line_width/2,line_width/2+gap);
				ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(0,height_num/2-gap);
				ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(line_width/2,line_width/2+gap);
				ctx.fill(); // |
				ctx.beginPath();
				ctx.moveTo(gap,0);
				ctx.lineTo(line_width/2+gap,-line_width/2);
				ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
				ctx.lineTo(width_num-gap,0);
				ctx.lineTo(width_num-line_width/2-gap,line_width/2);
				ctx.lineTo(line_width/2+gap,line_width/2);
				ctx.fill(); // -
				ctx.translate(0,height_num);
				ctx.beginPath();
				ctx.moveTo(gap,0);
				ctx.lineTo(line_width/2+gap,-line_width/2);
				ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
				ctx.lineTo(width_num-gap,0);
				ctx.lineTo(width_num-line_width/2-gap,line_width/2);
				ctx.lineTo(line_width/2+gap,line_width/2);
				ctx.fill(); // -
				ctx.translate(width_num,-height_num/2);
				ctx.beginPath();
				ctx.moveTo(0,gap);
				ctx.lineTo(-line_width/2,line_width/2+gap);
				ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(0,height_num/2-gap);
				ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
				ctx.lineTo(line_width/2,line_width/2+gap);
				ctx.fill(); // |
				ctx.restore();
				if (i<limit) { 
					setTimeout(function(){inner_five_zero(x,y)},1);
				}
			}
		}
		inner_five_zero(x,y);
	}
// draw the default background for numbers
	function background(x,y) {
		ctx.lineWidth = line_width;
		ctx.save();
		ctx.fillStyle = colorback;
		ctx.translate(x,y);

		ctx.beginPath();
		ctx.moveTo(0,gap);
		ctx.lineTo(-line_width/2,line_width/2+gap);
		ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
		ctx.lineTo(0,height_num/2-gap);
		ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
		ctx.lineTo(line_width/2,line_width/2+gap);
		ctx.fill(); // |

		ctx.beginPath();
		ctx.moveTo(0,height_num/2+gap);
		ctx.lineTo(-line_width/2,height_num/2+line_width/2+gap);
		ctx.lineTo(-line_width/2,height_num-line_width/2-gap);
		ctx.lineTo(0,height_num-gap);
		ctx.lineTo(line_width/2,height_num-line_width/2-gap);
		ctx.lineTo(line_width/2,height_num/2+line_width/2+gap);
		ctx.fill(); // |

		ctx.translate(width_num,0);

		ctx.beginPath();
		ctx.moveTo(0,gap);
		ctx.lineTo(-line_width/2,line_width/2+gap);
		ctx.lineTo(-line_width/2,height_num/2-line_width/2-gap);
		ctx.lineTo(0,height_num/2-gap);
		ctx.lineTo(line_width/2,height_num/2-line_width/2-gap);
		ctx.lineTo(line_width/2,line_width/2+gap);
		ctx.fill(); // |

		ctx.beginPath();
		ctx.moveTo(0,height_num/2+gap);
		ctx.lineTo(-line_width/2,height_num/2+line_width/2+gap);
		ctx.lineTo(-line_width/2,height_num-line_width/2-gap);
		ctx.lineTo(0,height_num-gap);
		ctx.lineTo(line_width/2,height_num-line_width/2-gap);
		ctx.lineTo(line_width/2,height_num/2+line_width/2+gap);
		ctx.fill(); // |

		ctx.translate(-width_num,0);

		ctx.beginPath();
		ctx.moveTo(gap,0);
		ctx.lineTo(line_width/2+gap,-line_width/2);
		ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
		ctx.lineTo(width_num-gap,0);
		ctx.lineTo(width_num-line_width/2-gap,line_width/2);
		ctx.lineTo(line_width/2+gap,line_width/2);
		ctx.fill(); // -

		ctx.translate(0,height_num/2);

		ctx.beginPath();
		ctx.moveTo(gap,0);
		ctx.lineTo(line_width/2+gap,-line_width/2);
		ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
		ctx.lineTo(width_num-gap,0);
		ctx.lineTo(width_num-line_width/2-gap,line_width/2);
		ctx.lineTo(line_width/2+gap,line_width/2);
		ctx.fill(); // -

		ctx.translate(0,height_num/2);

		ctx.beginPath();
		ctx.moveTo(gap,0);
		ctx.lineTo(line_width/2+gap,-line_width/2);
		ctx.lineTo(width_num-line_width/2-gap,-line_width/2);
		ctx.lineTo(width_num-gap,0);
		ctx.lineTo(width_num-line_width/2-gap,line_width/2);
		ctx.lineTo(line_width/2+gap,line_width/2);
		ctx.fill(); // _

		ctx.restore();
	}
// define a function for the animation
	function drawNumber(num,x,y,start){
		switch (num) {
			case 0:
				nine_zero(x,y,start);
				break;
			case 1:
				zero_one(x,y,start);
				break;
			case 2:
				one_two(x,y,start);
				break;
			case 3:
				two_three(x,y,start);
				break;
			case 4:
				three_four(x,y,start);
				break;
			case 5:
				four_five(x,y,start);
				break;
			case 6:
				five_six(x,y,start);
				break;
			case 7:
				six_seven(x,y,start);
				break;
			case 8:
				seven_eight(x,y,start);
				break;
			case 9:
				eight_nine(x,y,start);
				break;
		}
	}
// determine the current time
	function getHours(){
		var date = new Date();
		return parseInt(date.getHours());
	}

	function getMin(){
		var date = new Date();
		return parseInt(date.getMinutes());
	}

	function getSec(){
		var date = new Date();
		return parseInt(date.getSeconds());
	}

}

function getElementsClassName(className, node) {
	var classElements = [];
	if (!node) node = '*';
	var list = document.getElementsByTagName(node);
	var reg_name = new RegExp('(^|\\s+)'+className+'($|\\s+)');
	for (var i=0; i<list.length; ++i) {
		if (reg_name.test(list[i].className)) classElements.push(list[i]);
	}
	return classElements;
}

function initCanvasClock() {
	var canvasAreas = new Array();
	var listCanvasClock = getElementsClassName('canvasClock', 'canvas');
	for (var i=0;i<listCanvasClock.length;i++) {
		canvasAreas[i] = new canvasClock(listCanvasClock[i])
	}
}

if (window.addEventListener)
	window.addEventListener("load", initCanvasClock, false);
else if (window.attachEvent)
	window.attachEvent("onload", initCanvasClock);
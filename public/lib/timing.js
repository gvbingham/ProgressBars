//var one_sec_function = window.setInterval(one_sec, 1000);
//var one_min_function = window.setInterval(one_min, 60000);

/*function one_sec() {
	if (document.readyState == 'complete') {
	    for (var i in BAR.bars) {
	    	get_remaining_seconds(i);
	    	if (BAR.bars[i]['remaining_seconds'] <= 86400 && BAR.bars[i]['remaining_seconds'] >= 3600) {
	    		update_svg_width(i);
	    		update_time_text(i);
	        }
	    }
	}
}

function one_min() {
	if (document.readyState == 'complete') {
	    for (var i in BAR.bars) {
	    	if (BAR.bars[i]['remaining_seconds'] >= 86400) {
	    		update_svg_width(i);
	    		update_time_text(i);
	        }
	    }
	}
}
*/

function draw() {
    for (var i in BAR.bars) {
    	get_remaining_seconds(i);
		update_svg_width(i);
		update_time_text(i);
    }
}

function update_svg_width(index) {
    if (BAR.settings.current_category == BAR.bars[index].category || BAR.settings.current_category == "all") { // if in same category
	    if (document.getElementById('svg_' + BAR.bars[index].id)) {
	        document.getElementById('svg_' + BAR.bars[index].id).style.width = get_percent(index) + '%';
	    }
	}
}

function update_time_text(index) {
    if (BAR.settings.current_category == BAR.bars[index].category || BAR.settings.current_category == "all") { // if in same category
	    if (document.getElementById('time_' + BAR.bars[index].id)) {
	        document.getElementById('time_' + BAR.bars[index].id).innerHTML = BAR.bars[index]['time_text'];
	    }
	}
}
import Ember from 'ember';
import Cell from '../models/cell';

var GameMap = Ember.Object.extend({
	rows: []
});
var MapRow = Ember.Object.extend({
	cells: []
});

export default Ember.Controller.extend({
	mapWidth: 10,
	mapHeight: 10,

	map: Ember.computed('mapWidth', 'mapHeight', function() {
		var w = this.get('mapWidth');
		var h = this.get('mapHeight');
		return GameMap.create({rows: buildMapRows(w, h)});
	}),

	actions: {
		check: function(cell) {
			console.log(cell.neighbors);
		}
	}
});

var buildMapRows = function(width, height) {
	var rows = [];
	for (let r = 0; r < height; r++) {
		var cells = [];
		for (let c = 0; c < width; c++) {
			let cell = Cell.create();
			cells.push(cell);
		}
		var row = MapRow.create({cells: cells});
		rows.push(row);
	}

	for (let r = 0; r < height; r++) {
		for (let c = 0; c < width; c++) {
			let cell = rows[r].cells[c];
			for (let i = r-1; i <= r+1; i++) {
				for (let j = c-1; j <= c+1; i++) {
					if (between(i, 0, height) && 
						between(j, 0, width)) {
						cell.neighbors.push(rows[i].cells[j]);
					}
				}
			}
		}
	}
	return rows;
};

var between = function(val, min, max) {
	return (val <= max && val >= min);
};

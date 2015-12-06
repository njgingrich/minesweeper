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
	for (var r = 0; r < height; r++) {
		var cells = [];
		for (var c = 0; c < width; c++) {
			var cell = Cell.create();
			cells.push(cell);
		}
		var row = MapRow.create({cells: cells});
		rows.push(row);
	}
	return rows;
};

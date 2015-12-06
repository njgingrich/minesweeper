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
	mineCount: 10,
	isGameOver: false,

	map: Ember.computed('mapWidth', 'mapHeight', 'mineCount', function() {
		var w = this.get('mapWidth');
		var h = this.get('mapHeight');
		return GameMap.create({rows: buildMapRows(w, h, this.get('mineCount'))});
	}),

	actions: {
		check: function(cell) {
			// check if bomb
			if (cell.get('hasBomb')) {
				alert('You lose!');
				this.set('map', GameMap.create({
					rows: buildMapRows(this.get('mapWidth'), 
							 		   this.get('mapHeight'),
							 		   this.get('mineCount'))
					})); 
			}

			// if not, check neighbors and update count
			// update counts as needed, make other cells empty if need-be
			cell.set('cleared', true);
			updateCell(cell);	
		},
		reset: function() {
			this.set('map', GameMap.create({
				rows: buildMapRows(this.get('mapWidth'), 
						 		   this.get('mapHeight'),
						 		   this.get('mineCount'))
				})); 
		}
	}
});

var buildMapRows = function(width, height, mineCount) {
	var rows = [];
	for (let r = 0; r < height; r++) {
		var cells = [];
		for (let c = 0; c < width; c++) {
			let cell = Cell.create({
				hasBomb: false,
				cleared: false,
				neighbors: []
			});
			cells.push(cell);
		}
		var row = MapRow.create({cells: cells});
		rows.push(row);
	}

	placeMines(rows, width, height, mineCount);
	return setNeighbors(rows, width, height);
};

var setNeighbors = function(rows, width, height) {
	for (let r = 0; r < height; r++) {
		for (let c = 0; c < width; c++) { 
			let cell = rows[r].cells[c];
			// I hate myself
			for (let i = r-1; i <= r+1; i++) {
				for (let j = c-1; j <= c+1; j++) {
					if ( !(i === r && j === c) &&
						  (i >= 0 && i < height) &&
					  	  (j >= 0 && j < width)) {
						cell.get('neighbors').push(rows[i].cells[j]);
					}
				}
			}
		}
	}
	return rows;
};

var placeMines = function(rows, width, height, mineCount) {
	for (let i = 0; i < mineCount; i++) {
		var row = getRandomInt(0, height);
		var col = getRandomInt(0, width);

		rows[row].cells[col].set('hasBomb', true);
	}
};

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function updateCell(cell) {
	let neighbors = cell.get('neighbors');
	let count = cell.get('count');

	for (let i = 0; i < neighbors.length; i++) {
		if (neighbors[i].get('hasBomb')) {
			continue;
		} else if ( !(neighbors[i].get('cleared')) &&
			   		  cell.get('count') === 0) {
			neighbors[i].set('cleared', true);
			updateCell(neighbors[i]);
		}
	}
}









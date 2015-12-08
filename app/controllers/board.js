import Ember from 'ember';
import Cell from '../models/cell';

var GameMap = Ember.Object.extend({
	rows: []
});
var MapRow = Ember.Object.extend({
	cells: []
});

export default Ember.Controller.extend({
    init: function() {
        this._super();
        Ember.run.later(this, this.tick, 1000);
    },
    tick: function() {
        this.incrementProperty('time');
        Ember.run.later(this, this.tick, 1000);
    },
	time: 0,
	mapWidth: 10,
	mapHeight: 10,
	mineCount: 10,
	clearedSquares: 0,
	isGameOver: Ember.computed('clearedSquares', 'mapWidth', 'mapHeight', 'mineCount', function() {
		let width  = this.get('mapWidth');
		let height = this.get('mapHeight');

		return ((width*height) - this.get('clearedSquares')) == this.get('mineCount');
	}),
	map: Ember.computed('mapWidth', 'mapHeight', 'mineCount', function() {
		//var w = this.get('mapWidth');
		//var h = this.get('mapHeight');
		return this.reset();
		//return GameMap.create({rows: buildMapRows(w, h, this.get('mineCount'))});
	}),

	actions: {
		check: function(cell) {
			// check if bomb
			if (cell.get('hasBomb')) {
				alert('You lose!');
				this.reset();
			} else {

			// if not, check neighbors and update count
			// update counts as needed, make other cells empty if need-be
			cell.set('cleared', true);
			this.update(cell);
			}
		},
		reset: function() {
			this.reset();
		}
	},
	reset: function() {
		this.set('clearedSquares', 0);
		var map = GameMap.create({
			rows: buildMapRows(this.get('mapWidth'),
					 		   this.get('mapHeight'),
					 		   this.get('mineCount'))
			});
	    this.set('map', map);
		return map;
	},

	update: function(cell) {
		let neighbors = cell.get('neighbors');
		this.incrementProperty('clearedSquares');
		// check if won
		if (this.get('isGameOver')) {
			alert('You win!!!!!');
		}

		for (let i = 0; i < neighbors.length; i++) {
			if (neighbors[i].get('hasBomb')) {
				continue;
			} else if ( !(neighbors[i].get('cleared')) &&
				   		  cell.get('count') === 0) {
				neighbors[i].set('cleared', true);
				this.update(neighbors[i]);
			}
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
    let i = 0;
    while (i < mineCount) {
        var row = getRandomInt(0, height);
		var col = getRandomInt(0, width);
        if (rows[row].cells[col].get('hasBomb')) {
            continue;
        }
        rows[row].cells[col].set('hasBomb', true);
        i++;
    }
};

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}


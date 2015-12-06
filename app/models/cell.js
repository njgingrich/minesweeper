import Ember from 'ember';

export default Ember.Object.extend({
	hasBomb: false,
	cleared: false,
	text: Ember.computed('cleared', 'count', function() {
		if (this.get('cleared')) {
			return this.get('count');	
		} else {
			return "?";
		}
	}),
	neighbors: [],
	count: Ember.computed('neighbors', function() {
		let count = 0;

		for (let i = 0; i < this.get('neighbors').length; i++) {
			if (this.get('neighbors')[i].get('hasBomb')) {
				count++;
			}
		}
		return count;
	})	
});

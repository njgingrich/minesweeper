import Ember from 'ember';

export default Ember.Object.extend({
	hasBomb: false,
	cleared: false,
	text: "?",
	neighbors: [],
	count: Ember.computed(function() {
		return 0;
	})	
});

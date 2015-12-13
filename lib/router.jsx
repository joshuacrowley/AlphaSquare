Router.route('/', function () {
	this.render('menu');
	Meteor.subscribe("games");
});

Router.route('/games/:_id', {
	name: 'games',
	template: 'gameboard',

	subscriptions: function() {
		var subs = [];
		subs.push(Meteor.subscribe("boxes", this.params._id));
		subs.push(Meteor.subscribe("tiles", this.params._id));
		subs.push(Meteor.subscribe("games"));
		return subs
	},

	waitOn: function() {
		Session.setDefaultPersistent("playerScore", 0);
		Session.setDefaultPersistent("outcome", "Welcome! Click a tile, and then tap on the board to place it.");
		Session.setDefaultPersistent('shared', false);
		Session.setDefaultPersistent('special', false);
		Session.setDefaultPersistent('tile', "none");
		Session.setDefault('solution', 0);
		Session.setDefault("number", 0);
		
		Session.set("gameToken", this.params._id);
		Session.set("gameId", Games.findOne({gameToken: this.params._id})._id);
		
		var current = Iron.Location.get();

		if(current.queryObject.shared === "yes"){
			Session.set('shared', true);
		};

		if (typeof Session.get('playerToken') === 'undefined'){
			var playerToken = Random.id([8]);
			Session.setDefaultPersistent('playerToken', playerToken);
			Meteor.call('addOpponent', Session.get("gameId"), playerToken);
    		analytics.identify(playerToken);
 
		}else{
			Meteor.call('addOpponent', Session.get("gameId"), Session.get('playerToken'));
			analytics.identify(Session.get('playerToken'));
		};
    }

});
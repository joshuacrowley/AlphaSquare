Router.route('/', {
	name: 'menu',
	template: 'menu',

	subscriptions: function() {
		var subs = [];
		subs.push(Meteor.subscribe("games"));
		return subs
	},

	waitOn: function() {

		if (typeof Session.get('playerToken') === 'undefined'){
			var playerToken = Random.id([8]);
			Session.setDefaultPersistent('playerToken', playerToken);
			//Meteor.call('addOpponent', Session.get("gameId"), playerToken);
    		analytics.identify(playerToken);
 
		}else{
			analytics.identify(Session.get('playerToken'));
		};
	}

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

		game = Games.findOne({gameToken: this.params._id});

		Session.setDefaultPersistent("playerScore", 0);
		Session.setDefaultPersistent("outcome", "Welcome! Click a tile, and then tap on the board to place it.");
		Session.setDefaultPersistent('shared', false);
		Session.setDefaultPersistent('special', false);
		Session.setDefaultPersistent('tile', "none");
		Session.setDefault('solution', 0);
		Session.setDefault("number", 0);
		
		Session.set("gameToken", this.params._id);
		Session.set("gameId", game._id);
		
		var current = Iron.Location.get();

		if(current.queryObject.shared === "yes"){
			Session.set('shared', true);
		};

		if (typeof Session.get('playerToken') === 'undefined'){
			var playerToken = Random.id([8]);
			Session.setDefaultPersistent('playerToken', playerToken);
    		analytics.identify(playerToken);
 
		}else{
			
			analytics.identify(Session.get('playerToken'));
		};

		if(game.gameOwner != Session.get("playerToken") && game.gameOpponent === "none"){
			Meteor.call('addOpponent', Session.get("gameToken"), Session.get("playerToken"), true);
		}

    }

});
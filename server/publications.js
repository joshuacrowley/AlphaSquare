Meteor.publish("boxes", function (gameToken) {
	return Boxes.find({gameToken: gameToken});
});

Meteor.publish("tiles", function (gameToken) {
	return Tiles.find({gameToken: gameToken});
});

Meteor.publish("games", function () {
	return Games.find({});
});

if (Meteor.isServer) {
  Meteor.startup(function () {
	Boxes._ensureIndex({ "gameToken" : 1 });
	Tiles._ensureIndex({ "gameToken" : 1 });
	Games._ensureIndex({ "gameToken" : 1 });
	})
};
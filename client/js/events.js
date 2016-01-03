Template.menu.events({
  'click #join-public': function () {
    Meteor.call('findGame', Session.get('playerToken'), true, function(error, result){
      Router.go('games', {_id: result});
      Session.set('gameToken', result);
    });
    analytics.track("Joined game");
    Session.set("outcome", "You've created a public game. You'll need to wait until someone joins. They'll go first.");
    //ga('send', 'event', 'button', 'click', 'join-game');
  },
    'click #create-private': function () {
    Meteor.call('findGame', Session.get('playerToken'), false, function(error, result){
      Router.go('games', {_id: result});
      Session.set('gameToken', result);
    });
    Session.set("outcome", "You've created a private game. Share this url with a friend to play. They'll get to go first.");
    analytics.track("Joined game");
    //ga('send', 'event', 'button', 'click', 'join-game');
  }
});

Template.handle.events({
  'submit form': function (e) {
    e.preventDefault();
    var name = $('input#handle').val();

    console.log(name);

    Meteor.call('addName', Session.get("gameToken"), Session.get("playerToken"), name, 
      function(error, result){
      Session.set('outcome', result);
    });

  analytics.track("Added Name");
    //ga('send', 'event', 'button', 'click', 'add-name');
  }
});

Template.gameboard.events({
  'click button#join-game': function () {
    Meteor.call('findGame', Session.get('playerToken'), function(error, result){
      Router.go('games', {_id: result});
      Session.set('gameToken', result);
    });
    Session.set("playerScore", 0);
    Session.set("outcome", "Joined a new game!");
    analytics.track("Played Again");
    //ga('send', 'event', 'button', 'click', 'played-again');
  },

  'click button#end-game': function () {
    Meteor.call('clearGame', Session.get("gameToken"), function (error, result) {
      console.log(error);
    });
  },

  'click #facebook':function (event){
    console.log("facebook");
    analytics.track("Invited Facebook");
    //ga('send', 'event', 'button', 'click', 'invited-facebook');
  },

  'click div.handTile': function (event) {
  	$( "div.handTile" ).removeClass("highlight");
    $(event.target).addClass("highlight");
    var tile = $(event.target).index()+1;

    var tiles = $('div.handTile');
    var selected = tiles.filter('.highlight'); 
    var theNumber = $(selected).data("content");

    Session.set("number", theNumber);

    Session.set("tile", tile);
    analytics.track("Picked Tile");
    //ga('send', 'event', 'button', 'click', 'picked-tile');
    runLogic();
  },

  'click div.box.fade': function (event) {

    if (Session.get("tile") === "none"){
      Session.set("outcome", "Select a tile from the list on the far right. Then click on a box.");
      analytics.track("No placement");
    }else{
      placeTile(Session.get("tile"), parseInt(event.target.getAttribute("data-boxOrder"), 10));
      Session.set("tile", "none");      
      $( "li" ).removeClass("highlight");
    };
    //a
    //ga('send', 'event', 'button', 'click', 'placed-tile');
  }
});


Template.gameboard.helpers({
  outcome: function(){
    return Session.get("outcome");
  },
  gameOver: function(){
    return Games.findOne({gameToken : Session.get("gameToken")}).finished;
  }
});

Template.menu.helpers({
  winners: function () {
    Games.find({}).fetch();
  }
});

Template.playerRecord.helpers({
  currentPlayer: function(){
    if(this.playerToken === Session.get("playerToken")){return true};
  }

});

Template.scoreBoard.helpers({
  playerCount : function(){
    var players = Games.findOne({gameToken : Session.get("gameToken")}).player;
    return players.length
  }
});

Template.leaderboard.helpers({
  player: function(){
    var player = Games.findOne({gameToken : Session.get("gameToken")}).player;
    //player = _.filter(player, function(player) { return player.playerScore > 1 });
    return _.sortBy(player, 'playerScore').reverse();
  },
    currentPlayer: function(){
    if(this.playerToken === Session.get("playerToken")){return true};
  }
});

Template.tileList.helpers({
  tiles: function () {

    var ownerType;

    var game = Games.findOne({gameToken: Session.get("gameToken")});

    if(Session.get("playerToken") === game.gameOwner){
      ownerType = "gameOwner";
    }else if(Session.get("playerToken") === game.gameOpponent){
      ownerType = "gameOpponent";
    } else{
      ownerType = "none";
    };

    var tileHand = Tiles.find({gameToken : Session.get("gameToken"), tileState: "unplayed", owner: ownerType}).fetch();
    if(Session.get("shared") === true){
      return _.first(tileHand, 4);
    }else{
      return _.first(tileHand, 3);
    };
  },
  gameUrl: function() {
    var facebook = "https://www.facebook.com/dialog/share?app_id=1701598060068880&display=popup"
    //var domain = Meteor.absoluteUrl();
    var domain = "http://alphabetter.meteor.com/";
    var game = Router.current().location.get().path;
    var shared = "?shared=yes"
    return facebook + "&href=" + encodeURIComponent(domain) + "&redirect_uri=" + encodeURIComponent(domain+game)+shared;
  },
  shared: function(){
    return Session.get("shared");
  },
  special: function(){
    return Session.get("special");
  }

});

Template.tileList.onRendered(function () {

  $(function() {
    $('a[href*=#]:not([href=#])').click(function() {
      if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
          $('html,body').animate({
            scrollTop: target.offset().top
          }, 1000);
          return false;
        }
      }
    });
  });


});






Template.tile.helpers({

  alphaTile : function(){
    return numberAlpha(this.content);
  }

})


Template.gameboard.helpers({
  joined: function (){

    var player = Games.findOne({
      gameToken : Session.get("gameToken"), 
      player: {$in: [Session.get("playerToken")]}
    });

    if(player !== null){
      return false;
    }else{
      return true;
    }
  },
  gameScore : function (){
    var player = Games.findOne({gameToken : Session.get("gameToken")}).player;
    player = _.filter(player, function(player) { return player.playerToken === Session.get("playerToken") });
    return player[0].playerScore;
  },
  gameover: function(){
    return Games.findOne({gameToken : Session.get("gameToken")}).finished;
  },
  gameTime: function(){
    var time = Games.findOne({gameToken : Session.get("gameToken")}).createdAt
    return moment(time).fromNow();
  },
    tilesLeft : function(){
    var total = Tiles.find({gameToken : Session.get("gameToken"), tileState: "unplayed", owner: "none"}).fetch();
    return total.length;
  }
});
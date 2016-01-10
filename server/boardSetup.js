startGame = function (gameOwner, publicGame){

  var gridWidth = 6;
  var gridHeight = 6;
  var token = Random.id([8]);
  
  rangeCorrect = function (num){
    if(num < 0 || num > gridHeight*gridHeight){
      return 0;
    }else{
      return num;
    }
  };

  var sequence = [1,2,3,4,5,6,6,1,2,3,4,5,5,6,1,2,3,4,4,5,6,1,2,3,3,4,5,6,1,2,2,3,4,5,6,1];

  var evenSequence = [1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,6,6,6,6,6,6]

  //var sequence = [1,2,3,4,5,6,7,8,9,9,1,2,3,4,5,6,7,8,8,9,1,2,3,4,5,6,7,7,8,9,1,2,3,4,5,6,6,7,8,9,1,2,3,4,5,5,6,7,8,9,1,2,3,4,4,5,6,7,8,9,1,2,3,3,4,5,6,7,8,9,1,2,2,3,4,5,6,7,8,9,1];

  var n = 6;
  var rows = _.groupBy(sequence, function(element, index){
      return Math.floor(index/n);
  });

  rows = _.shuffle(rows);
  sequence = _.flatten(rows);

  var columns = _.groupBy(sequence, function(element, index){
    return index%n;
  });

  columns = _.shuffle(columns);
  fixedSequence = _.flatten(columns);

  var tilesToHide = _.sample(_.range(0,36),18);

  Games.insert({
    gameToken: token,
    createdAt: new Date(),
    publicGame: publicGame,
    finished: false,
    endGame: false,
    turnState: gameOwner,
    gameOwner: gameOwner,
    gameOpponent: "none",
    player: []
  });

  var player = "gameOpponent";

  var i = 0;

  evenSequence.forEach(function (tile) {

    player = (player === "gameOpponent") ? "gameOwner" : "gameOpponent";

        Tiles.insert({
          "gameToken": token,
          tileState: "unplayed",
          owner : player,
          spot: i,
          content: tile,
          createdAt: new Date(),
          shuffle: _.random(1,10000)
        });

    i++;

  });

  var i = 0;

  fixedSequence.forEach(function (box) {

      var hidden = true;
      var value = 0;
      var penaltyValue = 0;
      var penaltyAmount = 0;

      if (_.contains(tilesToHide, i)){
        penaltyValue = sequence[i];
        penaltyAmount = _.random(1,10);
      };

      Boxes.insert({
        "penaltyValue" : penaltyValue,
        "penaltyAmount" : penaltyAmount,
        "boxOrder" : i,
        "gameToken": token,
        "createdAt": new Date(),
        "content": value,
        "hidden": hidden,
        "special" : "none"
      });

      i++;

  });

  /*
  var tileToMove = Tiles.findOne({gameToken: token, spot : 1});
  var BoxToPlace = Boxes.findOne({gameToken: token, boxOrder : 12});
  Boxes.update({ _id : BoxToPlace._id}, {$set : {content : tileToMove.content, hidden : false}});
  Tiles.update({_id : tileToMove._id}, {$set : {tileState : "played"}});
  */

  return token;

};
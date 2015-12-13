startGame = function (){

  var gridWidth = 5;
  var gridHeight = 5;
  var token = Random.id([8]);
  
  rangeCorrect = function (num){
    if(num < 0 || num > gridHeight*gridHeight){
      return 0;
    }else{
      return num;
    }
  };

  var sequence = [1,2,3,4,5,5,1,2,3,4,4,5,1,2,3,3,4,5,1,2,2,3,4,5,1];

  //var sequence = [1,2,3,4,5,6,7,8,9,9,1,2,3,4,5,6,7,8,8,9,1,2,3,4,5,6,7,7,8,9,1,2,3,4,5,6,6,7,8,9,1,2,3,4,5,5,6,7,8,9,1,2,3,4,4,5,6,7,8,9,1,2,3,3,4,5,6,7,8,9,1,2,2,3,4,5,6,7,8,9,1];

  var n = 5;
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

  var tilesToHide = _.sample(_.range(0,25),25);

  Games.insert({
    gameToken: token,
    createdAt: new Date(),
    finished: false,
    endGame: false,
    player: []
  });

  tilesToHide.forEach(function (tile) {
        Tiles.insert({
          "gameToken": token,
          tileState: "unplayed",
          owner : "none",
          spot: tile,
          content: fixedSequence[tile],
          createdAt: new Date()
        });
  });

  var i = 0;

  fixedSequence.forEach(function (box) {

      var hidden = false
      var value = box

      if (_.contains(tilesToHide, i)){
        hidden = true;
        value = 0;
      };

      Boxes.insert({
        "boxOrder" : i++,
        "gameToken": token,
        "createdAt": new Date(),
        "content": value,
        "hidden": hidden,
        "special" : "none"
      });

  });

    return token;
};
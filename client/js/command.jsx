Meteor.startup(function() {

    Tracker.autorun(function() {

    mixpanel.identify(Session.get("playerToken"));
	    mixpanel.people.set({
	        "$created": new Date()
	    });
    });

    mixpanel.track("Visitor");
});		


Template.gameboard.onRendered(function () {
		if (Meteor.isClient) {
			Meteor.startup(function () {
				runLogic();
				React.render(<Gameboard />, document.getElementById("classicBoard"));
			});
		};
});


numberAlpha = function(number) {
		switch (number) {
			case 1:
				return "A";
			case 2:
			    return "B";
			case 3:
			    return "C";
			case 4:
			    return "D";
			case 5:
			    return "E";
			case 6:
			    return "F";
			case 7:
			    return "G";
			case 8:
			    return "H";
			case 9:
			    return "I";
			case 10:
			    return "J";
	    }
	};

placeTile = function(tileSpot, boxSpot, penaltyValue) {

	var tileToMove = Tiles.findOne({gameToken : Session.get("gameToken"), spot: tileSpot });
	var BoxToPlace = Boxes.findOne({gameToken : Session.get("gameToken"), boxOrder : boxSpot});

	if(typeof BoxToPlace != "undefined" && typeof tileToMove != "undefined"){

	if(BoxToPlace.content === 0){
		
		Meteor.call('moveTileDiscardTile', BoxToPlace, tileToMove, Session.get("gameToken"), function (error, result) {
			if(!error){

        if (penaltyValue != tileToMove.content ) {

            Session.set("outcome", "Nice move, you've gained two points. Pick another tile.");
            Meteor.call('updateScore', Session.get("gameId"), Session.get("playerToken"), 2);

        }else{

          Session.set("outcome", "Oh no. Your tile matched the spot, so you don't earn any points. Pick another tile.");

        }

        Meteor.call('swapPlayers', Session.get("gameToken"), Session.get("playerToken"));

				$('#outcome').addClass('animated pulse').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
					function(){
						$(this).removeClass('animated pulse');
				});
				analytics.track("Placed Tile", {
		  			correct: true
		  		});

		  		Session.set("tile", "none");

		};

	});


	}else{

		Session.set("outcome", "Nope, that spot has already been answered correctly. Pick another spot.");
		analytics.track("Placed Tile", {
  			correct: false
  		});
	
	};
};
};


var addGuess = function(BoxToPlace, tileToMove){
	Boxes.update({_id : BoxToPlace._id}, {$set : {guess : tileToMove.content}});
};

runLogic = function(future, box, content){

	var okay = true;	

  if(future === true){
    var boxMap = Boxes.find({gameToken:Session.get("gameToken")},{sort : { boxOrder : 1}}).fetch();
    boxMap[box].content = content;
  }else{
      var boxMap = Boxes.find({gameToken:Session.get("gameToken")}).fetch();
  };

  var game = "";

  boxMap.forEach(function (box) {
    if(box.content === 0){
      game += ".";
    }else{
      game += box.content;
    };
  });

  var puzzle = game.match(/.{1,5}/g);

  console.log("woot");

    var v = function (row, col, value) {
      return row + "," + col + "=" + value;
    };

    Logic._disablingTypeChecks(function () {
      var T = +new Date;
      var solver = new Logic.Solver();

      // All rows, columns, and digits are 0-based internally.
      for (var x = 0; x < 5; x++) {
        // Find the top-left of box x. For example, Box 0 has a top-left
        // of (0,0).  Box 3 has a top-left of (3,0).
        //var boxRow = Math.floor(x/3)*3;
        //var boxCol = (x%3)*3;
        for (var y = 0; y < 5; y++) {
          var numberInEachSquare = [];
          var columnHavingYInRowX = [];
          var rowHavingYInColumnX = [];
          var squareHavingYInBoxX = [];
          for (var z = 0; z < 5; z++) {
            numberInEachSquare.push(v(x,y,z));
            columnHavingYInRowX.push(v(x,z,y));
            rowHavingYInColumnX.push(v(z,x,y));
            /*squareHavingYInBoxX.push(v(
              boxRow + Math.floor(z/3),
              boxCol + (z%3),
              y));*/
          }
          solver.require(Logic.exactlyOne(numberInEachSquare));
          solver.require(Logic.exactlyOne(columnHavingYInRowX));
          solver.require(Logic.exactlyOne(rowHavingYInColumnX));
          //solver.require(Logic.exactlyOne(squareHavingYInBoxX));

        }
      }

      for (var r = 0; r < 5; r++) {
        var str = puzzle[r];
        for (var c = 0; c < 5; c++) {
          // zero-based digit
          var digit = str.charCodeAt(c) - 49;
          if (digit >= 0 && digit < 5) {
            solver.require(v(r, c, digit));
          }
        }
      }

      solver.solve();
      console.log("Solved in " + ((new Date) - T) + " ms");

      var solution = [];
      for (var r = 0; r < 5; r++) {
        var row = [];
        solution.push(row);
        var str = puzzle[r];
        for (var c = 0; c < 5; c++) {
          var chr = str.charAt(c);
          if (chr >= "1" && chr <= "5") {
            row.push({given: chr});
          } else {
            var nums = [];
            for (var d = 0; d < 5; d++) {
              var x = v(r, c, d);
              if (solver.solveAssuming(x)) {
                nums.push(d+1);
              } else {
                solver.forbid(x);
              }
            }
            row.push({allowed: nums});
          }
        }
      };

      var raw = [];
      for (var r = 0; r < 5; r++) {
        var row = [];
        raw.push(row);
        var str = puzzle[r];
        for (var c = 0; c < 5; c++) {
          var chr = str.charAt(c);
          if (chr >= "1" && chr <= "5") {
            row.push([parseInt(chr)]);
          } else {
            var nums = [];
            for (var d = 0; d < 5; d++) {
              var x = v(r, c, d);
              if (solver.solveAssuming(x)) {
                nums.push(d+1);
              } else {
                solver.forbid(x);
              }
            }
            row.push(nums);
          }
        }
      };

      

      if(future === true){

        var flat = _.flatten(raw, true);
        //var plucky = _.pluck(flat, "allowed");
        
		var rows = _.groupBy(flat, function(element, index){
		  return Math.floor(index/5);
		});

		var rows = $.map(rows, function(value, index) {
    		return [value];
		});

		var columns = _.groupBy(flat, function(element, index){
		    return index%5;
		});

		var columns = $.map(columns, function(value, index) {
    		return [value];
		});

		results = [];

		rows.forEach(function (row) {
			var flatter = _.flatten(row);
      var sum = _.reduce(flatter, function(memo, num){ return memo + num; }, 0);
      if(sum != 15){
        var unique = _.uniq(flatter);
        results.push(unique);
      };
		});

		columns.forEach(function (column) {
			var flatter = _.flatten(column);
      var sum = _.reduce(flatter, function(memo, num){ return memo + num; }, 0);
      if(sum != 15){
        	var unique = _.uniq(flatter);
        	results.push(unique);
      };
		});

        var unplayedTiles = []

        tiles = Tiles.find({gameToken : Session.get("gameToken"), tileState : "unplayed"}).fetch();

        tiles.forEach(function (tile) {
          unplayedTiles.push(tile.content);
        });
        
        uniqueTiles = _.uniq(unplayedTiles);

        results.forEach(function (result) {

        	//var outcome = uniqueTiles.length === result.length;

        	var outcome = _.difference(uniqueTiles, result);

		        if (result.length !== 5){
		        //if(!outcome){
		          okay = false;
		        }
        });


      }else{
        Session.set('solution', solution);
        Session.set('raw', raw);
      };

      

    });

	return okay;
};
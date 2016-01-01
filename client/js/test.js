testLogic = function (puzzle){

 	var v = function (row, col, value) {
      return row + "," + col + "=" + value;
    };

    Logic._disablingTypeChecks(function () {
      var T = +new Date;
      var solver = new Logic.Solver();

      for (var x = 0; x < 5; x++) {
        for (var y = 0; y < 5; y++) {
          var numberInEachSquare = [];
          var columnHavingYInRowX = [];
          var rowHavingYInColumnX = [];
          var squareHavingYInBoxX = [];
          for (var z = 0; z < 5; z++) {
            numberInEachSquare.push(v(x,y,z));
            columnHavingYInRowX.push(v(x,z,y));
            rowHavingYInColumnX.push(v(z,x,y));
          }
          solver.require(Logic.exactlyOne(numberInEachSquare));
          solver.require(Logic.exactlyOne(columnHavingYInRowX));
          solver.require(Logic.exactlyOne(rowHavingYInColumnX));
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
            /*row.push({
            	spot : ((r*5)+c),
            	given: chr
            });*/
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
            row.push({
				spot : ((r*5)+c),
            	allowed: nums
            });

          }
        }
      }  
	};
	return solution;
};

var squarePuzzle =  [
[".",".",".",".","."],
[".",".",".",".","."],
[".",".",".",".","."],
[".",".",".",".","."],
[".",".",".",".","."]
];

var result = testLogic(puzzle);

var flatResult = _.flatten(result, true);








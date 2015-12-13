checkForty = function(){

      var solver = new Logic.Solver();
      var fortyFive = Logic.constantBits(45);

      var A = Logic.constantBits(5);
      var B = Logic.variableBits('B', 4);
      var C = Logic.variableBits('C', 4);
      var D = Logic.variableBits('D', 4);
      var E = Logic.variableBits('E', 4);
      var F = Logic.variableBits('F', 4);
      var G = Logic.variableBits('G', 4);
      var H = Logic.variableBits('H', 4);
      var I = Logic.variableBits('I', 4);

      var locations = [A, B, C, D, E, F, G, H, I];

      console.log(A.bits);

      var xySum = Logic.sum(locations);

      _.each(locations, function (loc) {
            solver.require(Logic.greaterThanOrEqual(loc, Logic.constantBits(1)));
            solver.require(Logic.lessThanOrEqual(loc, Logic.constantBits(9)));
      });

      _.each(locations, function (loc1, i) {
            _.each(locations, function (loc2, j) {
                  if (i !== j) {
                  solver.forbid(Logic.equalBits(loc1, loc2));
                  }
            });
      });

      solver.require(Logic.equalBits(xySum, fortyFive));
      
      var solution = solver.solve();

      console.log(solution.evaluate(A));
      console.log(solution.evaluate(B));
      console.log(solution.evaluate(C));
      console.log(solution.evaluate(D));
      console.log(solution.evaluate(E));
      console.log(solution.evaluate(F));
      console.log(solution.evaluate(G));
      console.log(solution.evaluate(H));
      console.log(solution.evaluate(I));
      //solution.evaluate(fortyFive)

};
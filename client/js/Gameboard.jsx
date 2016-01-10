// Gameboard component - represents the whole game
Gameboard = React.createClass({
 
  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],

	getMeteorData() {
  		return {
    		boxes : Boxes.find({gameToken : Session.get("gameToken")},{sort : { boxOrder : 1}}).fetch(),
    		game: Games.findOne({gameToken : Session.get("gameToken")})
  		};
	},

	buildRows(){
		gameRows = [];
		var n = 6;
		var rows = _.groupBy(this.data.boxes, function(element, index){return Math.floor(index/n)});
		rows = _.toArray(rows);
		game = this.data.game;
		rows.forEach(function (row) {
      		gameRows.push(<BoardRow rowData={row} gameData={game} />)
  		});
  		return (gameRows);
	},

	render() {
    return (<div id="board">{this.buildRows()}</div>);
	}

});

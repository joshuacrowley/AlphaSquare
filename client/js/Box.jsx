// Box component - represents a box on the gameboard
Box = React.createClass({

  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      solution: Session.get('solution'),
      number: Session.get('number'),
      tile: Session.get('tile')
    };
  },

	boxType() {
		if(this.props.box.hidden === true && this.props.box.penaltyValue != 0){
			var penaltyValue = numberAlpha(this.props.box.penaltyValue);
			var penaltyAmount = this.props.box.penaltyAmount;
			return (<span className="guess animated julse">{penaltyValue}{penaltyAmount}</span>)
		}else{
			var content = numberAlpha(this.props.box.content);
			return (<span className="center bounceIn animated {gameOver}" data-content={this.props.box.content} >{content}</span>)
		};
	},

	tileTime() {

		if(Session.get("playerToken") != this.props.gameData.turnState){

		var suggest = false

		var list = _.flatten(this.data.solution, true);

		if(_.contains(list[this.props.box.boxOrder].allowed, this.data.number)){			
      			suggest = true
			};

		if (typeof this.data.number === 'number' && suggest){

			var tiles  = $('div.handTile')
			var selected = tiles.filter('.highlight')    
			var number = $(selected).data("spot");
			var content = $(selected).data("content");

			placeTile(number, this.props.box.boxOrder, this.props.box.penaltyValue, this.props.box.penaltyAmount);
			$( "li" ).removeClass("highlight");

    	}else{
      		Session.set("outcome", "Select a tile from the list on the far right. Then click on a box.");
      		analytics.track("No placement");
    	};

    }else{
    	Session.set("outcome", "It's not your turn.");
    	analytics.track("Not your turn");
    }

	},

	attempted() {

		if(this.props.box.hidden){		
			return this.props.box.guess != "" ? "attempted" : ""
		};
	},

	gameOver() {
		
	},

	numberAlpha(number) {
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
	},

	render() {

		var suggest = false

		var list = _.flatten(this.data.solution, true);

		if(_.contains(list[this.props.box.boxOrder].allowed, this.data.number)){			
      			suggest = true
			};

		var suggestHelper = suggest === false ? " suggest" : " white";
		var gameOver = this.props.gameData.endGame === true && this.props.box.hidden === false ? "box white" : "box";
		var boxClass =  gameOver += suggestHelper;

		return(
		<div key={this.props.box._id} className={boxClass} id={this.attempted()} data-boxorder={this.props.box.boxOrder} onClick={this.tileTime}>
			{this.boxType()}
		</div>
		);
	}
});

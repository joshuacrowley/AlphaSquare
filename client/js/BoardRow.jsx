// Box component - represents a box on the gameboard
BoardRow = React.createClass({

	renderRows() {
		dataRows = [];
		var row = this.props.rowData;
		var game = this.props.gameData;
		row.forEach(function (cell) {
			dataRows.push(<Box box={cell} gameData={game} />)
		});
    	return (dataRows);
    },	

	render() {
		return(<div key="" className="flexRow">{this.renderRows()}</div>);
	}
});

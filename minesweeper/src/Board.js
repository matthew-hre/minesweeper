import React from "react";

import Row from "./Row";

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(64),
        }
    }

    createBoard() {
        let result = [];
        result.push(<button onClick="isSquareBomb(0, 0)"></button>)
        for(let i = 0; i < 8; i++) {
            result.push(<Row id={i.toString()} key={i.toString()}/>)
        }
        return result;
    }

    isSquareBomb(x, y) {
        let rows = document.getElementsByClassName("row");
    
        let foundRow;
        for(let row of rows) {
            if(row.props.key === y.toString()) {
                foundRow = row;
                break;
            }
        }
    
        let squares = foundRow.getElementsByClassName("square");
    
        let foundSquare;
        for(let square of squares) {
            if(square.props.key === x.toString()) {
                foundSquare = square;
                break;
            }
        }
    
        if (foundSquare.className.includes("true")) {
            return true; // BOOM!
        }
    
        return false; // dud.
    }

    render() {
        return this.createBoard();
    }
}

export default Board;
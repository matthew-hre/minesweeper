import React from "react";

import Row from "./Row";

let defaultBoard = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(64),
            isWhiteTurn: true,
        }
    }

    createBoard() {
        let result = [];
        for(let i = 0; i < 8; i++) {
            result.push(<Row id={i.toString()}/>)
        }
        return result;
    }

    render() {
        return this.createBoard();
    }
}

export default Board;
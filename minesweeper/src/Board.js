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
        for(let i = 0; i < 8; i++) {
            result.push(<Row id={i.toString()} key={i.toString()}/>)
        }
        return result;
    }

    render() {
        return this.createBoard();
    }
}

export default Board;
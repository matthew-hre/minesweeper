import React from "react";
import Board from "./Board";

import "./style.css";

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 10,
            height: 10,
            bombs: 10,
        }
    }


    render() {
        const { width, height, bombs } = this.state;
        return (
            <div className="game">
                <Board width={width} height={height} bombs={bombs}/>
            </div>
        );
    }
}

export default Game;
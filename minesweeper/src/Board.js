import React from "react";
import PropTypes from "prop-types"

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.initData(this.props.width, this.props.height, this.props.bombs),
            gameOver: false,
            bombCount: this.props.bombs,
        }
    }

    initData(width, height, bombCount) {

        const board = this.createNewBoard(width, height);
        this.populateBoard(board);

        return board;
    }

    createNewBoard(width, height) {
        let data = [];

        for(let i = 0; i < height; i++) {
            // new row
            data.push([]);

            for(let j = 0; j < width; j++) {

                const newSquare = {
                    x: i,
                    y: j,

                    isBomb: false,
                    nextTo: 0,
                    isRevealed: false,
                    isEmpty: false,
                    isFlagged: false,
                }

                data[i][j] = newSquare;

            }
        }

        return data;
    }

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    populateBoard(data, width, height, bombCount) {
        //let x = 0;
        //let y = 0;
        let currentBombs = 0;

        while(currentBombs < bombCount) {
            let randomX = this.getRandomInt(width);
            let randomY = this.getRandomInt(height);

            if(!data[randomX][randomY].isMine) {
                data[randomX][randomY].isMine = true;
                currentBombs++;
            }
        }
        return data;
    }

    renderBoard(data) {
        let result = [];
        data.forEach((row) => {
            row.forEach((square) => {
                // implement drawing
            });
            result += <br />;
        });

        return result;
    }

    render() {
        return (
            <div className="board">
                <div className="info">
                    <span className="info-text">BOMBS: {this.state.bombCount}</span>
                    <span className="info-text">{this.gameOver}</span>
                </div>
            </div>
        );
    }
}

// type checks
Board.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    bombs: PropTypes.number,
}

export default Board;
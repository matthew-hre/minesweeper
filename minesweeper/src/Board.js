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

        let data = this.createNewBoard(width, height);
        data = this.populateBoard(data, width, height, bombCount);
        data = this.calculateAdjacentSquares(data, width, height);

        return data;
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
        let currentBombs = 0;

        while(currentBombs < bombCount) {
            let randomX = this.getRandomInt(width);
            let randomY = this.getRandomInt(height);

            if(!data[randomX][randomY].isBomb) {
                data[randomX][randomY].isBomb = true;
                currentBombs++;
            }   
        }
        return data;
    }

    calculateAdjacentSquares(data, width, height) {
        let updatedData = data;

        for(let i = 0; i < width; i++) {
            for(let j = 0; j < height; j++) {
                if(!data[j][i].isBomb) {
                    let nearbyBombs = 0;
                    const area = this.findNextTo(data[j][i].x, data[j][i].y, data);
                    area.map(value => {
                        if(value.isBomb) nearbyBombs++;
                        return area; // so vscode will stop yelling at me >:C
                    });
                    if(nearbyBombs === 0) {
                        updatedData[j][i].isEmpty = true;
                    }
                    updatedData[j][i].nextTo = nearbyBombs;
                }
            }
        }
        return updatedData;
    }

    findNextTo(x, y, data) {
        let cellsNextTo = [];

        if(x > 0) {
            cellsNextTo.push(data[x - 1][y]);
        } 

        if(x < this.props.height - 1) {
            cellsNextTo.push(data[x + 1][y]);
        }

        if(y > 0) {
            cellsNextTo.push(data[x][y - 1]);
        }

        if(y < this.props.width - 1) {
            cellsNextTo.push(data[x][y + 1]);
        }

        if(x > 0 && y > 0) {
            cellsNextTo.push(data[x - 1][y]);
        } 

        if(x < this.props.height - 1 && y < this.props.width - 1) {
            cellsNextTo.push(data[x + 1][y]);
        }

        if(y > 0 && x < this.props.height - 1) {
            cellsNextTo.push(data[x][y - 1]);
        }

        if(y < this.props.width - 1 && x > 0) {
            cellsNextTo.push(data[x][y + 1]);
        }

        return cellsNextTo;
    }

    renderBoard(data) {
        let result = [];
        data.forEach((row) => {
            row.forEach((square) => {
                // implement drawing (ok i will tomorrow <3)
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
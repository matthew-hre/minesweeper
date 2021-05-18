import React from "react";
import PropTypes from "prop-types";

import Square from "./Square";

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

    getHidden(data) {
        let hiddenList = [];

        data.map((row) => {
            data.map((square) => {
                if(!square.isRevealed) {
                    hiddenList.push();
                }
            });
        });

        return hiddenList;
    }

    getBombs(data) {
        let bombList = [];

        data.map((row) => {
            data.map((square) => {
                if(!square.isRevealed) {
                    bombList.push();
                }
            });
        });

        return bombList;
    }

    getFlags(data) {
        let flagList = [];

        data.map((row) => {
            data.map((square) => {
                if(!square.isFlagged) {
                    flagList.push();
                }
            });
        });

        return flagList;
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

    reveal(x, y, data) {
        let area = this.findNextTo(x, y, data);

        area.map((square) => {
            if(!square.isFlagged && !square.isRevealed && (square.isEmpty || !square.isMine)) {
                data[square.x][square.y].isRevealed = true;
                if(square.isEmpty) {
                    this.reveal(square.x, square.y, data);
                }
            }
        });
        return data;
    }

    handleClick(x, y) {

        console.log(x + ", " + y);

        const clicked = this.state.data[x][y];

        if(clicked.isRevealed || clicked.isFlagged) return null;

        if(clicked.isMine) {
            alert("you lose!");
            this.setState({gameStatus: "you suck at this."});
            //this.revealBoard();
        }

        let updatedData = this.state.data;
        updatedData[x][y].isRevealed = true;
        updatedData[x][y].isFlagged = false;

        if(updatedData[x][y].isEmpty) {
            updatedData = this.reveal(x, y, updatedData);
        }

        if(this.getHidden(updatedData).length === this.props.mines) {
            alert("winner!");
            //this.revealBoard();
            this.setState({gameStatus: "you win!"});
        }

        this.setState({
            data: updatedData,
            bombCount: this.props.bombs - this.getFlags(updatedData).length,
        });
    }

    renderBoard(data) {
        return data.map((row) => {
            return row.map((square) => {
                return (
                    <Square
                    key={square.x + "," + square.y}
                    onClick={() => this.handleClick(square.x, square.y)}
                    cMenu={(e) => this.handleContextMenu(e, square.x, square.y)}
                    value={square}
                    />
                );
            })
        });
    }

    render() {
        return (
            <div className="board">
                <div className="info">
                    <span className="info-text">BOMBS: {this.state.bombCount}</span>
                    <span className="info-text">{this.gameOver}</span>
                </div>
                <div className="game">
                    {this.renderBoard(this.state.data)}
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
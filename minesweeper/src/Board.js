import React from "react";

import Square from "./Square";

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.initData(this.props.width, this.props.height, this.props.bombs),
            gameOver: "click away...",
            bombCount: this.props.bombs,
            clickCount: 0
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
                    area.forEach(value => {
                        if(value.isBomb) nearbyBombs++;
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

    getWithAttribute(data, attr) {
        let list = [];

        data.forEach((row) => {
            row.forEach((square) => {
                if(attr(square)) {
                    list.push();
                }
            });
        });

        return list;
    }

    getHidden(data) {
        return this.getWithAttribute(data, (square) => !square.isRevealed);
    }

    getBombs(data) {
        return this.getWithAttribute(data, (square) => square.isBomb);
    }

    getFlags(data) {
        return this.getWithAttribute(data, (square) => square.isFlagged);
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
            cellsNextTo.push(data[x - 1][y - 1]);
        } 

        if(x < this.props.height - 1 && y < this.props.width - 1) {
            cellsNextTo.push(data[x + 1][y + 1]);
        }

        if(y > 0 && x < this.props.height - 1) {
            cellsNextTo.push(data[x + 1][y - 1]);
        }

        if(y < this.props.width - 1 && x > 0) {
            cellsNextTo.push(data[x - 1][y + 1]);
        }

        return cellsNextTo;
    }

    reveal(x, y, data) {
        let area = this.findNextTo(x, y, data);

        area.forEach((square) => {
            if(!square.isFlagged && !square.isRevealed && (square.isEmpty || !square.isBomb)) {
                data[square.x][square.y].isRevealed = true;
                if(square.isEmpty) {
                    this.reveal(square.x, square.y, data);
                }
            }
        });
        return data;
    }

    revealBoard() {
        this.state.data.forEach((row) => {
            row.forEach((square) => {
                square.isRevealed = true;
            });
        });

        this.setState({data: this.state.data});
    }

    async handleClick(x, y) {
        let clicked = this.state.data[x][y];

        if(this.state.clickCount === 0) {
            if(!clicked.isEmpty) {
                clicked = this.state.data[x][y];
                const newData = this.initData(this.props.width, this.props.height, this.props.bombs);
                await this.setState({data: newData});
                return this.handleClick(x, y);
            }
        }

        if(clicked.isRevealed || clicked.isFlagged) return null;

        if(clicked.isBomb) {
            this.setState({gameOver: "you suck at this."});
            this.revealBoard();
        }

        let updatedData = this.state.data;
        const currentSquare = updatedData[x][y];

        currentSquare.isRevealed = true;
        currentSquare.isFlagged = false;

        if(currentSquare.isEmpty) {
            updatedData = this.reveal(x, y, updatedData);
        }

        if(this.getHidden(updatedData).length === this.props.bombs) {
            this.revealBoard();
            this.setState({gameOver: "winner winner"});
        }

        this.setState({
            data: updatedData,
            clickCount: this.state.clickCount+1,
        });
    }

    onContextMenu(e, x, y) {
        e.preventDefault();

        const newData = this.state.data;

        const squareToFlag = newData[x][y];
        let bombCount = this.state.bombCount;

        if(squareToFlag.isRevealed) return;
        
        if(squareToFlag.isFlagged) {
            squareToFlag.isFlagged = false;
            bombCount++;
        } else {
            squareToFlag.isFlagged = true;
            bombCount--;
        }

        if(bombCount === 0) {
            const bombs = this.getBombs(newData);
            const flags = this.getFlags(newData);

            if(bombs.length === flags.length) {
                this.setState({
                    data: this.state.data,
                    bombCount: 0,
                    gameOver: "winner winner"
                });
            }
        }

        this.setState({data: this.state.data, bombCount: bombCount});
    }

    renderBoard(data) {
        return data.map((row) => {
            return row.map((square) => {
                return (
                    <Square
                    key={square.x + "," + square.y}
                    onClick={() => this.handleClick(square.x, square.y)}
                    onContextMenu={(e) => this.onContextMenu(e, square.x, square.y)}
                    value={square}
                    />
                );
            });
        });
    }

    render() {
        return (
            <div className="board">
                <div className="info">
                    <div className="info-text">bombs remaining: {this.state.bombCount}</div>
                    <div className="info-text">{this.state.gameOver}</div>
                </div>
                <div className="game">
                    {this.renderBoard(this.state.data)}
                </div>
            </div>
        );
    }
}

export default Board;
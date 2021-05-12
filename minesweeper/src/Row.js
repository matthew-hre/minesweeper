import React from "react";
import Square from "./Square";
import './style.css';

class Row extends React.Component {
    createRow() {
        let result = [];
        let isBomb = false;
        for(let i = 0; i < 8; i++) {
            result.push(<Square bomb={isBomb} key={i.toString()}/>)
        }
        return result;
    }

    render() {
        return (
            <div className="row">
                {this.createRow()}
            </div>
        )
    }
}

export default Row;
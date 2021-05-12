import React from "react";
import Square from "./Square";
import './style.css';

class Row extends React.Component {
    createRow() {
        let id = this.props.id;
        id = (id/2 === Math.round(id/2)) ? 0 : 1;
        let result = [];
        let color = "";
        for(let i = 0; i < 8; i++) {
            if(i % 2 === id) {
                color = "white";
            } else {
                color = "black";
            }
            result.push(<Square color={color}/>)
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
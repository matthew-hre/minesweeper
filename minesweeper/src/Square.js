import React from "react";
import './style.css';

class Square extends React.Component {

    getValue() {
        const value = this.props.value;

        if(!value.isRevealed) {
            return (value.isFlagged) ? "🚩" : null;
        }

        if(value.isBomb) {
            return "💣";
        }
 
        if (value.nextTo === 0) {
            return null;
        }
        return value.nextTo;
    }

    render() {
        const {value, onClick, onContextMenu} = this.props;
        let className = "square";
        if(!value.isRevealed) {
            className += " hidden";
        } else if(value.isBomb) {
            className += " bomb"
        } else if(value.isFlagged) {
            className += " flagged"
        }

        return(
            <div
            onClick={onClick} 
            onContextMenu={onContextMenu}
            className={className}>
            {this.getValue()}
            </div>
        );
    }
}

export default Square;
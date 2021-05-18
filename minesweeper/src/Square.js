import React from "react";
import PropTypes from "prop-types";
import './style.css';

class Square extends React.Component {

    getValue() {
        const value = this.props.value;

        if(!value.isRevealed) {
            return (this.props.value.isFlagged) ? "F" : null;
        }

        if(value.isBomb) {
            return "B"
        }
 
        if (value.nextTo === 0) {
            return null;
        }
        return value.nextTo;
    }

    render() {
        const {value, onClick, openMenu} = this.props;
        return(
            <div className="square" 
            onClick={this.props.onClick} 
            onContextMenu={this.props.openMenu}>
            {this.getValue()}
            </div>
        );
    }
}

// type checks
const states = {
    isRevealed: PropTypes.bool,
    isBomb: PropTypes.bool,
    isFlagged: PropTypes.bool,
}

Square.propTypes = {
    value: PropTypes.objectOf(PropTypes.shape(states)),
    onClick: PropTypes.func,
    openMenu: PropTypes.func,
}

export default Square;
import React from "react";
import './style.css';

class Square extends React.Component {
    render() {
        let props = this.props;
        return(<div className={`square ${props.color}`}></div>);
    }
}

export default Square;
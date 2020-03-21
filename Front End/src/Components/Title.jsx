import React, { Component } from "react";

class Title extends Component {
    render() {
        return (
            <h1 style={{ fontSize: "2em", margin: "4%" }}>{this.props.title}</h1>
        )
    }
}

export default Title;
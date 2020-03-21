import React, { Component } from 'react';
import ReactLoading from 'react-loading';


export default class Loading extends Component {
    render() {
        return (
            <div>                
                <h1 style={{color: 'white', marginLeft: '22.5%' }}>{this.props.text}</h1>
                <ReactLoading className="loading" type={this.props.type} color={this.props.color} height={this.props.height} width={this.props.width} />

            </div>
        )
    }
}

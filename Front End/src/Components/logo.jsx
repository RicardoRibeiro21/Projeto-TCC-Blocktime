import React,{ Component } from "react";
import logo from '../Assets/img/Logo_Tecnologia_600x150.png'

class Logo extends Component {
    render() {
        return (
            <div id="logo" >
                <img src={logo} alt="Logo da empresa BlockTime" width="300 px" />
            </div>
        )
    }
}

export default Logo;
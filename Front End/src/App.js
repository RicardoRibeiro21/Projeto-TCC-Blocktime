import React, { Component } from 'react';
import './App.css';
import Loading from '../src/Services/Functions/loading';

class Splash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }
    async Redireciona() {
        await setTimeout(() => {
            this.setState({ loading: false })
            this.props.history.push("/login")
        }, 2000)
    }
    render() {
        this.Redireciona()
        return (            
            this.state.loading == true ? <div className="loading" style={{ marginTop: '16%'}}> <Loading text='Carregando' type='bars' color='#EDEBDF' height='150px' width='150px'/></div> :
            <div><h1>Erro ao carregar a página</h1></div>                

        )
    }
}

export default Splash;
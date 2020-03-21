import React, { Component } from 'react';
import '../Usuario/editar.css';
import verificaLogin from '../../Services/Functions/verificaLogin';
import UrlApi from '../../Services/apiService';
class Editar extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            url: "",
            login: "",
            senha: "",
            user: []
        };
    }
    componentDidMount() {
        if (verificaLogin() == false) { this.props.history.push("/login") }
        localStorage.getItem("usuario-logado-api");
        this.buscaUsuario();
    }

    atualizaUrl(event) {
        this.setState({ url: event.target.value });
    }

    atualizaLogin(event) {
        this.setState({ login: event.target.value });
    }

    atualizaSenha(event) {
        this.setState({ senha: event.target.value });
    }
    buscaUsuario() {
        fetch(UrlApi + "/Users/UsuarioLogado", {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + localStorage.getItem("usuario-logado-api")
            }
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ user: data })
                console.log(this.state.user)
            })
            .catch(error => {
                alert("Ocorreu um erro ao buscar o usuário logado")
            })
    }

    editaUsuario(event) {
        event.preventDefault();

        fetch(UrlApi + "/Users/Editar",
            {
                method: 'PUT'
                , body: JSON.stringify({
                    id: this.state.id
                    , url: this.state.url
                    , login: this.state.login
                    , senha: this.state.senha
                }),
                headers: {}
            })
            .then(resposta => resposta,
                this.setState({ erro: "Usuário alterado com sucesso!!" }))
            .catch(erro => console.log(erro))
    }



    render() {
        return (

            <form >
                <div>
                    {/* {
                        this.state.user.map(element => {
                            return (
                                <div>
                                    <p>{element.login}</p>
                                    <p>{element.auth}</p>
                                    <p>{element.senha}</p>
                                    <p>{element.url}</p>
                                </div>
                            )
                        })
                    } */}
                    <label >
                        <input type="text" placeholder={this.state.user.url} value={this.state.url} onChange={this.atualizaUrl.bind(this)}></input>
                        <input type="text" placeholder={this.state.user.login} value={this.state.login} onChange={this.atualizaLogin.bind(this)}></input>
                        <input type="password" placeholder={this.state.user.senha} value={this.state.senha} onChange={this.atualizaSenha.bind(this)}></input>
                    </label>
                    <button type="Submit" className="btn-editar" onSubmit={this.editaUsuario.bind(this)}>Finalizar</button>
                </div>
            </form>
        )
    }
}
export default Editar;
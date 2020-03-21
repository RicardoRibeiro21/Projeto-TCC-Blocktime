import React, { Component } from 'react';
import './listarEvents.css';
import Logo from '../../Components/logo';
import Url from '../../Services/zabbixService';
import Logoff from '../../Services/Functions/logoff';
import 'bootstrap/dist/css/bootstrap.min.css';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Title from '../../Components/Title';
import verificaLogin from '../../Services/Functions/verificaLogin';

let vetor = []
let indice = -1
let estilo = ""
let inicio = ""
let fim = ""

class Eventos extends Component {
    constructor() {
        super();
        this.state = {
            listEvents: [],
            errorMessage: "",
            search: '',
            hostid: localStorage.getItem("HostId"),
            userLogado: localStorage.getItem("usuario-blocktime"),
            visivel: false,
            dataInicial: localStorage.getItem("dataInicial"),
            dataFinal: localStorage.getItem("dataFinal")
        }
    }
    //Chama os métodos antes da página ser carregada
    componentDidMount() {
        if (verificaLogin() == false) { this.props.history.push("/login") }
        else {
            this.inicioPagina()
            this.listaEvents();
        }
    }

    inicioPagina() {
        inicio = new Date(localStorage.getItem("dataInicial") * 1000)
        fim = new Date(localStorage.getItem("dataFinal") * 1000)
        inicio = inicio.toLocaleDateString("pt-BR")
        fim = fim.toLocaleDateString("pt-BR")
        document.title = "Lista de Eventos de " + localStorage.getItem("HostName") + " de " + inicio + " à " + fim
    }

    logoff() {
        Logoff.efetuarLogoff()
        this.props.history.push('/Login');
    }

    fundo() {
        console.log(this.state.visivel)
        this.setState({ visivel: !this.state.visivel })
        console.log(this.state.visivel)
    }

    updateSearch(event) {
        this.setState({ search: event.target.value.substr(0, 20) });
    }
    //Requisição para o zabbix
    listaEvents() {
        let bodyCriado = {
            jsonrpc: "2.0",
            method: "event.get",
            params: {
                value: 1,
                time_from: this.state.dataInicial,
                time_till: this.state.dataFinal,
                sortfield: "clock",
                hostids: this.state.hostid
            },
            auth: this.state.userLogado,
            "id": 1
        }

        fetch(Url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyCriado)
        })
            .then(resposta => resposta.json())
            .then(data => {
                this.setState({ listEvents: data.result })
            })
            .catch(erro => console.log(erro))
    }

    render() {
        if (this.state.visivel === true) { estilo = "red" }
        else { estilo = "black" }
        return (
            <div className="container-event" style={{ color: estilo }}>
                <div className="fundoHostGroup">
                    <Breadcrumb>
                        <Breadcrumb.Item href="/Hostgroups">HostGroups</Breadcrumb.Item>
                        <Breadcrumb.Item href="/Hosts">Hosts</Breadcrumb.Item>
                        <Breadcrumb.Item active>Triggers</Breadcrumb.Item>
                        <a onClick={this.logoff.bind(this)} style={{ marginLeft: "71%" }}>Logoff</a>
                    </Breadcrumb>
                    {/* <button   onClick={ this.fundo.bind(this)} style={{margin:"5%", marginLeft:"80%"}}>Mudar Fundo</button> */}
                    <Logo />
                    <Title title={`Eventos de ${localStorage.getItem("HostName")}`} />
                    <div className="tabela-event">
                        <table className="tableHostGroup">
                            <thead className="primeiralinhaHostGroup">
                                <tr>
                                    <th className="leftHostGroup">ID</th>
                                    <th className="leftHostGroup">Descrição</th>
                                    <th className="leftHostGroup">Data</th>
                                    <th className="leftHostGroup">Hora</th>
                                    <th className="leftHostGroup">Grau</th>
                                </tr>
                            </thead>
                            <tbody id="myTable">
                                {
                                    this.state.listEvents.map(element => {
                                        vetor.push(element.hostid)
                                        indice++
                                        let dia = new Date(element.clock * 1000).toLocaleDateString("pt-BR")
                                        let hora = new Date(element.clock * 1000).toLocaleTimeString("pt-BR")
                                        return (
                                            <tr className="linhaHostGroup" key={element.groupid}>
                                                <td className="centerNum" >{element.eventid}</td>
                                                <td className="leftHostGroup">{element.name}</td>
                                                <td className="leftHostGroup">{dia}</td>
                                                <td className="leftHostGroup">{hora}</td>
                                                <td className="leftHostGroup">{element.severity}</td>
                                            </tr>)
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default Eventos;

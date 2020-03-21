import React, { Component } from 'react';
import './listarHosts.css';
import '../../Assets/css/hostGroupModal.css';
import Logo from '../../Components/logo';
import Url from '../../Services/zabbixService';
import Logoff from '../../Services/Functions/logoff';
import 'bootstrap/dist/css/bootstrap.min.css';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import CriarArrayX from '../../Services/Functions/CriarVetorX';
import Title from '../../Components/Title';
import verificaLogin from '../../Services/Functions/verificaLogin';
let vetor = []
let indice = -1
let displayModal = "none"
let displayTabela = ""
let vetorName = []
let convertString = ""

class Hosts extends Component {
    constructor() {
        super();
        this.state = {
            listHosts: [],
            errorMessage: "",
            search: '',
            nameGroup: localStorage.getItem("GroupName"),
            groupid: localStorage.getItem("Grouphostid"),
            userLogado: localStorage.getItem("usuario-blocktime"),
            modal: false,
            dataInicial: "X",
            dataFinal: "Y",
            hostName: ""
        }
    }

    //Chama os métodos antes da página ser carregada
    componentDidMount() {
        if (verificaLogin() == false) { this.props.history.push("/login") }
        else {
            this.listarHosts();
            document.title = "Lista de Hosts"
        }
    }

    convertTimestamp(_dataInicial, _dataFinal) {
        let _inicialStamp = (new Date(_dataInicial).getTime())
        _inicialStamp = (_inicialStamp / 1000) + 14401
        this.setState({ dataInicial: _inicialStamp })
        let _finalStamp = (new Date(_dataFinal).getTime())
        _finalStamp = (_finalStamp / 1000) + 14401
        this.setState({ dataFinal: _finalStamp })
        localStorage.setItem("dataInicial", _inicialStamp)
        localStorage.setItem("dataFinal", _finalStamp)
        CriarArrayX(_inicialStamp, _finalStamp)
        this.props.history.push('/Eventos')
    }

    janelaModal(_hostId, _hostName) {
        this.setState({ hostName: _hostName })
        localStorage.setItem("HostId", _hostId);
        localStorage.setItem("HostName", _hostName);
        console.log(localStorage.getItem("HostId"))
        console.log(this.state.hostName)
        this.setState({ modal: !this.state.modal })
        console.log(this.state.modal)
    }


    logoff() {
        Logoff.efetuarLogoff()
        this.props.history.push('/Login');
    }
    //Requisição para o zabbix    
    listarHosts() {
        let bodyCriado = {
            jsonrpc: "2.0",
            method: "host.get",
            params: {
                output: ["hostid", "host"],
                groupids: this.state.groupid
            },
            auth: this.state.userLogado,
            id: 1
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
                this.setState({ listHosts: data.result })
                console.log(data.result)
                console.log(this.state.listGroupHost);
            })
            .catch(erro => console.log(erro))
    }
    //Setando os estados
    updateSearch(event) {
        this.setState({ search: event.target.value.substr(0, 20) });
    }
    dataInicial(event) {
        this.setState({ dataInicial: event.target.value })
    }
    dataFinal(event) {
        this.setState({ dataFinal: event.target.value })
    }


    render() {
        if (this.state.modal === true) {
            displayModal = ""
            displayTabela = "none"
        }
        else {
            displayModal = "none"
            displayTabela = ""
        }
        return (
            <div>
                <div className="renato" style={{ display: displayModal }}>
                    <div className="containerModal">
                        <div className="fundo-modal">
                            <h2 className="h1-modal">Host: {this.state.hostName}</h2>
                            <p className="p-modal"> Defina o período que deseja visuaulizar as Triggers</p>
                            <div className="h1-modal-esquerda">
                                <p className="p-modal">Data Inicial</p>
                                <input type="date" value={this.state.dataInicial} onChange={this.dataInicial.bind(this)} required />
                                <p className="p-modal">Data Final</p>
                                <input type="date" value={this.state.dataFinal} onChange={this.dataFinal.bind(this)} required />
                            </div>
                            <div>
                                <button className="button-relatorio" onClick={this.janelaModal.bind(this, this.state.groupid, this.state.nameGroup)} style={{ backgroundColor: '#FF460D' }}>Cancelar</button>
                                <button className="button-relatorio" onClick={this.convertTimestamp.bind(this, this.state.dataInicial, this.state.dataFinal)} >Visualizar Triggers</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-hosts" style={{ display: displayTabela }}>
                    <div className="fundoHostGroup">
                        <Breadcrumb>
                            <Breadcrumb.Item href="/Hostgroups">HostGroups</Breadcrumb.Item>
                            <Breadcrumb.Item active>Hosts</Breadcrumb.Item>
                            <a onClick={this.logoff.bind(this)} style={{ marginLeft: "80%" }}>Logoff</a>
                        </Breadcrumb>
                        <Logo />
                        <Title title={`Hosts ${localStorage.getItem("GroupName")}`} />
                        <div className="tabela-hosts">
                            <table className="tableHostGroup">
                                <thead className="primeiralinhaHostGroup">
                                    <tr>
                                        <th className="leftHostGroup">ID</th>
                                        <th className="leftHostGroup">Nome do Host</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody id="myTable">
                                    {
                                        this.state.listHosts.map(element => {
                                            vetor.push(element.hostid)
                                            convertString = element.host
                                            convertString = convertString.toString()
                                            vetorName.push(convertString)
                                            indice++
                                            return (
                                                <tr className="linhaHostGroup" key={element.groupid}>
                                                    <td className="centerNum" >{element.hostid}</td>
                                                    <td className="leftHostGroup">{element.host}</td>
                                                    <td className="centerNum"><a onClick={this.janelaModal.bind(this, vetor[indice], vetorName[indice])} >Listar Eventos</a></td>
                                                </tr>)
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Hosts;


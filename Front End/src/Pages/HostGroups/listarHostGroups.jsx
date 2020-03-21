import React, { Component } from 'react';
import '../../Assets/css/hostGroupModal.css';
import './listarHostGroup.css';
import Logo from '../../Components/logo';
import Url from '../../Services/zabbixService';
import Logoff from '../../Services/Functions/logoff';
import 'bootstrap/dist/css/bootstrap.min.css';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Title from '../../Components/Title';
import CriarArrayX from '../../Services/Functions/CriarVetorX';
import verificaLogin from '../../Services/Functions/verificaLogin';

let vetor = []
let vetorNome = []
let indice = -1
let displayModal = "none"
let displayTabela = ""

class grouphost extends Component {
    constructor() {
        super();
        this.state = {
            listGroupHost: [],
            errorMessage: "",
            search: '',
            groupid: '',
            userLogado: localStorage.getItem("usuario-blocktime"),
            modal: false,
            nome: "",
            id: "",
            search: '',
            dataInicial: "X",
            dataFinal: "Y",
            tipoRelatorio: ''
        }
    }

    //Chama os métodos antes da página ser carregada
    componentDidMount() {
        if (verificaLogin() == false) { this.props.history.push("/login") }
        else {
            this.listaGroupHost();
            document.title = "Lista de Clientes"
        }
    }

    janelaModal(_id, _nome) {
        localStorage.setItem("GroupName", _nome);
        localStorage.setItem("Grouphostid", _id);
        this.setState({ nome: _nome })
        this.setState({ id: _id })
        this.setState({ modal: !this.state.modal })
    }
    logoff() {
        Logoff.efetuarLogoff()
        this.props.history.push('/Login');
    }
    //Requisição do zabbix para pegar os Grupos de Hosts
    listaGroupHost() {
        let bodyCriado = {
            jsonrpc: "2.0",
            method: "hostgroup.get",
            params: {
                output: ["groupid", "name"]
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
                this.setState({ listGroupHost: data.result })

                console.log(data.result)
                console.log(this.state.listGroupHost);
            })
            .catch(erro => console.log(erro))
    }

    //Setando os states para as variáveis que precisamos
    setarGroupid(idHostGroup, vetorNome) {
        localStorage.setItem("Grouphostid", idHostGroup);
        this.setarGroupName(vetorNome)
        this.props.history.push('/Hosts')
    }
    setarGroupName(groupName) {
        localStorage.setItem("GroupName", groupName);
    }
    updateSearch(event) {
        this.setState({ search: event.target.value.substr(0, 20) });
    }
    atualizaTipoRelatorio(event) {
        this.setState({ tipoRelatorio: event.target.value })
        localStorage.setItem("tipoRelatorio", this.state.tipoRelatorio)
    }
    dataFinal(event) {
        this.setState({ dataFinal: event.target.value })
    }
    dataInicial(event) {
        this.setState({ dataInicial: event.target.value })
    }
    convertTimestamp(_dataInicial, _dataFinal) {
        if (_dataFinal < _dataInicial) {
            alert("Data inválida. Selecione novamente o host");
            this.setState({ modal: !this.state.modal })
        }
        else {
            let _inicialStamp = (new Date(_dataInicial).getTime())
            _inicialStamp = (_inicialStamp / 1000) + 14401
            this.setState({ dataInicial: _inicialStamp })
            let _finalStamp = (new Date(_dataFinal).getTime())
            _finalStamp = (_finalStamp / 1000) + 14401
            this.setState({ dataFinal: _finalStamp })
            localStorage.setItem("dataInicial", _inicialStamp)
            localStorage.setItem("dataFinal", _finalStamp)
            CriarArrayX(_inicialStamp, _finalStamp)
        }
    }

    render() {
        //Setando o modal       
        if (this.state.modal === true) {
            displayModal = ""
            displayTabela = "none"
        }
        else {
            displayModal = "none"
            displayTabela = ""
        }

        //Campo de busca 
        var filteredHosts = this.state.listGroupHost.filter(
            (result) => {
                return result.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
            }
        );
        return (
            <div>
                <div className="renato" style={{ display: displayModal }}>
                    <div className="containerModal" >
                        <div className="fundo-modal">
                            <Title title={`Empresa ${this.state.nome}`} />
                            <p className="p-modal">Período do relatório</p>
                            <div className="">
                                <p className="p-modal">Data Inicial</p>
                                <input type="date" value={this.state.dataInicial} onChange={this.dataInicial.bind(this)} />
                                <p className="p-modal">Data Final</p>
                                <input type="date" value={this.state.dataFinal} onChange={this.dataFinal.bind(this)} />
                                <p className="p-modal">Tipo de Relatório: </p>
                                <select value={this.state.tipoRelatorio} onChange={this.atualizaTipoRelatorio.bind(this)} >
                                    <option value="">Selecione</option>
                                    <option value="Completo">Completo</option>
                                    <option value="Falhas">Apenas Falhas</option>
                                </select>
                            </div>
                            <div>
                                <button className="button-relatorio" onClick={this.janelaModal.bind(this, vetor[indice], vetorNome[indice])} style={{ backgroundColor: '#FF460D' }}>Cancelar</button>
                                <button className="button-relatorio" onClick={this.convertTimestamp.bind(this, this.state.dataInicial, this.state.dataFinal)}><a href={`/Grafico?tipo=${this.state.tipoRelatorio}&DataInicial=${this.state.dataInicial}&DataFinal=${this.state.dataFinal}`}>Visualizar Gráficos</a></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-groupHost" style={{ display: displayTabela }}>
                    <div className="background-groupHost">
                        <Breadcrumb light color="secondary" style={{ display: displayTabela }}>
                            <Breadcrumb.Item active>HostGroups</Breadcrumb.Item>
                            <a onClick={this.logoff.bind(this)} style={{ marginLeft: "85%" }}>Logoff</a>
                        </Breadcrumb>
                        <Logo />
                        <div>
                            <div className="divBusca">
                                <p style={{ margin: "2%" }}> Pesquisar: </p><input type="text" id="txtBusca" value={this.state.search} onChange={this.updateSearch.bind(this)} placeholder="Nome do HostGroup..." />
                                {/* <img src="lupa.png" id="btnBusca" alt="Buscar" width="20px" /> */}
                            </div>
                            <div className="tabela-groupHost" >
                                <table className="tableHostGroup">
                                    <thead className="primeiralinhaHostGroup">
                                        <tr>
                                            <th className="centerNum">ID</th>
                                            <th className="leftHostGroup">Nome do Host</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody id="myTable">
                                        {
                                            filteredHosts.map(element => {
                                                vetor.push(element.groupid)
                                                vetorNome.push(element.name)
                                                indice++
                                                return (
                                                    <tr className="linhaHostGroup" key={element.groupid}>
                                                        <td className="centerNum" >{element.groupid}</td>
                                                        <td className="leftHostGroup">{element.name}</td>
                                                        <td className="centerNum"><a onClick={this.setarGroupid.bind(this, vetor[indice], vetorNome[indice])} >Listar Hosts</a></td>
                                                        <td className="centerNum"><a onClick={this.janelaModal.bind(this, vetor[indice], vetorNome[indice])} >Gerar Relatório</a></td>
                                                    </tr>)
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default grouphost;

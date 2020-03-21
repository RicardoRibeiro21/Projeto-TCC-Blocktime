import React, { Component } from 'react';
import './grafico.css'
import Url from '../../Services/zabbixService'
import { Bar } from 'react-chartjs-2';
import CriarVetorX from '../../Services/Functions/CriarVetorX'
import Title from '../../Components/Title'
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Logoff from '../../Services/Functions/logoff';
import Logo from '../../Components/logo';
import convertClock from '../../Services/Functions/convertClock';
import verificaLogin from '../../Services/Functions/verificaLogin';
import Loading from '../../Services/Functions/loading';
//Variável auxiliar para verificaçao do dia em que o evento ocorreu
let horario
//Armazena os hosts criados
let hosts = []
//Armazena as trigger, relacionando com os hosts
let trigger = []
//Armazena os events, relacionado com os hosts e as triggers
let final = []
let inicio = localStorage.getItem("dataInicial");
console.log(inicio);
let fim = localStorage.getItem("dataFinal");
console.log(fim);
//Cria o vetor X
let dadosGraficos = CriarVetorX(inicio, fim)
let dadosGraficosTamanho = dadosGraficos.length
let exibir = ""
let f = parseInt(fim) + 82798
let i = parseInt(inicio) - 3600
if (dadosGraficosTamanho > 61) exibir = "rgba(0,0,0,0)"
else exibir = "rgba(0,0,0)"

class Grafico extends Component {
    constructor() {
        super();
        this.state = {
            userLogado: localStorage.getItem("usuario-blocktime"),
            dataInicial: i,
            dataFinal: f,
            grouphostid: localStorage.getItem("Grouphostid"),
            graficos: [],
            apresentacao: 0,
            tipoRelatorio: "",
            loading: true
        }
    }
    componentDidMount() {
        if (verificaLogin() == false) { this.props.history.push("/login") }
        else {
            document.title = localStorage.getItem("GroupName") + " Relatório de " + convertClock(i) + " à " + convertClock(f);
            this.pegarTipoRelatorio();
            this.ColetarHosts()
            console.log(dadosGraficos.length)
        }
    }
    pegarTipoRelatorio() {
        this.setState({ tipoRelatorio: document.URL.split('?')[1].split('=')[1].split('&')[0] })
    }

    //Requisições para o zabbix 
    async ColetarHosts() {
        let bodyCriado = {
            jsonrpc: "2.0",
            method: "host.get",
            params: {
                output: ["hostid", "host"],
                groupids: this.state.grouphostid,
                sortorder: "hostid"
            },
            auth: this.state.userLogado,
            id: 1
        }

        let dado = await fetch(Url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyCriado)
        })
        let data = await dado.json()
        hosts = await data.result
        this.coletarTriggers()
    }

    logoff() {
        Logoff.efetuarLogoff()
        this.props.history.push('/Login');
    }

    coletarTriggers() {
        hosts.map(async (element) => {
            let bodyCriado = {
                jsonrpc: "2.0",
                method: "trigger.get",
                params: {
                    hostids: element.hostid,
                    output: ["triggerid", "description"]
                },
                auth: this.state.userLogado,
                id: 1
            }

            let dado = await fetch(Url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyCriado)
            })
            let data = await dado.json()
            let formando = {
                host: element.host,
                hostId: element.hostid,
                trigger: data.result,
                ocorrencias: [],
            }
            formando.trigger.map(element => {
                element.vetor = []
                let cont = 1;
                while (cont <= dadosGraficosTamanho) {
                    element.vetor.push(0)
                    cont++
                }
            })
            trigger.push(formando)
        })
        this.associarEvents()
    }

    async associarEvents() {
        await hosts.map(async (element) => {
            let bodyCriado = {
                jsonrpc: "2.0",
                method: "event.get",
                params: {
                    hostids: element.hostid,
                    value: 1,
                    time_from: this.state.dataInicial,
                    time_till: this.state.dataFinal,
                    sortfield: "clock",
                    output: ["name", "clock", "objectid"]
                },
                auth: this.state.userLogado,
                id: 1
            }

            let dado = await fetch(Url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyCriado)
            })
            let data = await dado.json()

            let formando = {
                host: element.host,
                hostId: element.hostid,
                event: data.result
            }
            final.push(formando)
        })
        await this.visualizarDados()
    }
    async visualizarDados() {
        await console.log(trigger)
        await console.log(final)
        await this.tratarDados(trigger)
    }

    //Função responsável por relacionar eventos e trigger e fornecer valores para o eixo Y
    async tratarDados() {
        await setTimeout(() => {
            trigger.map(elemento => {
                elemento.trigger.map(elemento2 => {
                    final.map(elemento3 => {
                        elemento3.event.map(elemento4 => {
                            if (elemento2.triggerid === elemento4.objectid) {
                                elemento.ocorrencias.push(elemento4)
                                // console.log(elemento)
                            }
                        })
                    })
                })
            })
        }, 5000)
        await setTimeout(function () {
            trigger.map(element => {
                element.trigger.map(element1 => {
                    element.ocorrencias.map(element2 => {
                        if (element2.objectid === element1.triggerid) {
                            i = parseInt(inicio) - 3600;
                            let contador = 0;
                            horario = parseInt(element2.clock)
                            while (i <= f) {
                                if (horario >= i && horario <= (i + 86400)) {
                                    element1.vetor[contador] = element1.vetor[contador] + 1
                                }
                                contador++
                                i = i + 86400;
                            }
                        }
                    })
                })
            })
            this.setState({ graficos: trigger })
            this.setState({ loading: false })
            console.log(this.state.graficos);
        }.bind(this), 5000)
    }

    render() {
        return (
            <div className="content">
                <div className="fundoHostGroup">
                    <Breadcrumb className="noPrint" light color="secondary">
                        <Breadcrumb.Item href="/Hostgroups">HostGroups</Breadcrumb.Item>
                        <Breadcrumb.Item active>Graficos</Breadcrumb.Item>
                        <a className="logoff" onClick={this.logoff.bind(this)} style={{ marginLeft: "78%" }}>Logoff</a>
                    </Breadcrumb>
                    <Logo />
                    <Title title={`Relatório de erros: ${convertClock(inicio)} à ${convertClock(fim)}`} />
                    {
                        //Verifica se o loading é true, para fazer o efeito loading                        
                        this.state.loading == true ? <div className="loading"> <Loading type='bubbles' color='#FF460D' height='15%' width='15%'/> </div> :
                            //
                            this.state.graficos.length > 0 ?
                                this.state.graficos.map((element) => {
                                    //Verificando se houve ocorrencia e se o usuário quer apenas com trigger acionadas, não renderizando gráficos vazios
                                    if (this.state.tipoRelatorio === "Falhas" && element.ocorrencias.length === 0) { return "" }
                                    return (
                                        <div className="container-graficos">
                                            <h2 id="host">{element.host}</h2>
                                            {
                                                element.trigger.map((element2, index) => {
                                                    //Variável da quantidade de ocorrências                                        
                                                    let qtdOcorrencias = 0;
                                                    let graficoPorDia = [];
                                                    //Percorre o vetor de ocorrencias e armazena quantas ocorrencias foram encontradas
                                                    for (let i = 0; i < element.trigger[index].vetor.length; i++) {
                                                        qtdOcorrencias += element.trigger[index].vetor[i];
                                                        if (element.trigger[index].vetor[i] != 0) {
                                                            graficoPorDia.push(1);
                                                        }
                                                    }
                                                    //Verifica o número de ocorrencias, não renderizando o gráfico
                                                    if (this.state.tipoRelatorio === "Falhas" && qtdOcorrencias == 0) {
                                                        return ("");
                                                    }
                                                    //Cria gráfico de barras, mostrando as ocorrências nos respectivos dias
                                                    const data = {
                                                        labels: dadosGraficos,
                                                        datasets: [
                                                            {
                                                                label: "Ocorrências",
                                                                backgroundColor: 'rgba(218, 24, 24, 0.85)',
                                                                borderColor: 'black',
                                                                borderWidth: 0,
                                                                hoverBackgroundColor: 'rgba(248, 124, 124, 0.85)',
                                                                hoverBorderColor: 'black',
                                                                data: element2.vetor
                                                            }
                                                        ],
                                                        legend: {
                                                            display: "none"
                                                        }
                                                    };
                                                    const options = {
                                                        legend: {
                                                            display: false
                                                        },
                                                        scales: {
                                                            yAxes: [{
                                                                ticks: {
                                                                    fontColor: "black",
                                                                    min: 0,
                                                                    stepSize: 3
                                                                }
                                                            }],
                                                            xAxes: [{
                                                                barPercentage: 1.10,
                                                                ticks: {
                                                                    fontColor: exibir,
                                                                }
                                                            }]
                                                        },
                                                        title: {
                                                            display: "center",
                                                            text: element.trigger[index].description,
                                                            fontColor: "black",
                                                            fontSize: "16"
                                                        }
                                                    }
                                                    return (
                                                        <div >
                                                            <div>
                                                                <tr   >
                                                                    <td>
                                                                        <div className="graficos"><Bar
                                                                            width={500}
                                                                            height={120}
                                                                            data={data}
                                                                            options={options}
                                                                        /></div>
                                                                    </td>
                                                                </tr>
                                                                <td>Quantidade de ocorrências {qtdOcorrencias}</td>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                )
                                            }
                                        </div>
                                    )
                                }
                                )
                                :
                                <h3>Não foi possível gerar nenhum gráfico</h3>
                    }
                </div>
            </div>)
    }
}

export default Grafico;


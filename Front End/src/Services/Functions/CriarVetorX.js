// Esta função recebe dois parâmetros em TimeStamp, data inicial e data final 
// E devolve um vetor onde os elementos são os dias contidos no intervalo de tempo

export default function criarVetorX(inicio, fim) {
    let arrayX = []
    inicio = inicio - 7200
    fim = fim - 7200
    const diferencaInicio = inicio % 86400
    inicio = inicio - diferencaInicio + 86400

    const diferencaFim = fim % 86400
    fim = fim + 86400 - diferencaFim

    let dia = new Date(inicio * 1000).getDate()
    arrayX = [dia]

    while ((inicio + 86400 <= fim)) {   //86400 é a quantidade de segundos em um dia
        inicio = inicio + 86400
        let dia = new Date(inicio * 1000).getDate()
        arrayX.push(dia)

    }
    localStorage.setItem("ArrayX", arrayX)

    return arrayX

}




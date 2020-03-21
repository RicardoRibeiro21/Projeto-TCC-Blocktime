export default function verificaLogin() {
    var verificador = true;     
    if (localStorage.getItem("usuario-blocktime") === null || localStorage.getItem("usuario-blocktime") == "") {
        alert("É necessário realizar o login para acessar essa página!");
        verificador = false;
    }
    return verificador;
}

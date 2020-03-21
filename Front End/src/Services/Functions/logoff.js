import UrlApi from "../apiService"

const logoff = {
    efetuarLogoff() {
        fetch(UrlApi, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },            
        }
        )
            .then(response => response.json())
            .then(data => {
                if (data.result === true) {
                    localStorage.removeItem("usuario-blocktime")
                    console.log(data)
                }
            })
            .catch(erro => console.log(erro))
    }
}

export default logoff
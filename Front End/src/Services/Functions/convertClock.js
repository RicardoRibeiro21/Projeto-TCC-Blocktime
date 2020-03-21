export default function convertClock(data) {
    let date = new Date(data * 1000); 
    date = date.toLocaleDateString('pt-BR');
    return date;
}

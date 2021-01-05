const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedasSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultadoDiv = document.querySelector('#resultado');

const objBusqueda = {
    moneda:'',
    criptomoneda:''
}

//crear promise
const obtenerCriptomonedas = criptomonedas => new Promise(resolve =>{
    resolve(criptomonedas);
})

document.addEventListener('DOMContentLoaded', ()=>{
    consultarCriptomonedas();
    formulario.addEventListener('submit',submitFormulario);
    criptomonedasSelect.addEventListener('change', leerValor);
    monedasSelect.addEventListener('change', leerValor);
    
});

function leerValor(e){
    objBusqueda[e.target.name]= e.target.value;
}

function submitFormulario(e){
    e.preventDefault();
    const { moneda,criptomoneda } = objBusqueda;
    if(moneda === '' || criptomoneda === ''){
        imprimirAlerta('Todos los campos son obligatorios');
        return      
    }
    
    //consultar API
    consultarAPI();
    
}

function consultarAPI(){
    const { moneda,criptomoneda } = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    
    mostrarSpinner();
    
    fetch(url)
    .then(respuesta => respuesta.json())
    .then(resultado => mostrarCotizacionHTML(resultado.DISPLAY[criptomoneda][moneda]))
    
}

function mostrarSpinner(){
    limpiarHTML();
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;
    resultadoDiv.appendChild(spinner);
}

function mostrarCotizacionHTML(cotizacion){
    limpiarHTML();
    const { PRICE,HIGHDAY,LOWDAY,CHANGEPCT24HOUR,LASTUPDATE } = cotizacion;
    const precio = document.createElement('p');
    precio.className ='precio';
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`;
    
    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `Precio mas alto del dia: <span>${HIGHDAY}</span>`;
    
    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `Precio mas bajo del dia: <span>${LOWDAY}</span>`;
    
    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `Variacion ultimas 24 horas: <span>${CHANGEPCT24HOUR} %</span>`;
    
    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `Ultima Actualizacion: <span>${LASTUPDATE}</span>`;
    
    resultadoDiv.appendChild(precio);
    resultadoDiv.appendChild(precioAlto);
    resultadoDiv.appendChild(precioBajo);
    resultadoDiv.appendChild(ultimasHoras);
    resultadoDiv.appendChild(ultimaActualizacion);
}

function limpiarHTML(){
    while(resultadoDiv.firstChild){
        resultadoDiv.removeChild(resultadoDiv.firstChild);
    }
}

function imprimirAlerta(mensaje){
    const alerta = document.querySelector('.error');
    
    if(!alerta){
        
        const divMensaje = document.createElement('p');
        divMensaje.textContent = mensaje;
        divMensaje.className = 'error';
        
        resultadoDiv.appendChild(divMensaje);
        
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
    
    
}

function consultarCriptomonedas() { 
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;
    
    fetch(url)
    .then(respuesta => respuesta.json())
    .then(resultado => obtenerCriptomonedas(resultado.Data))
    .then(criptomonedas => selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto => {
        const { FullName,Name } = cripto.CoinInfo;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        
        criptomonedasSelect.appendChild(option);
        
    });
}
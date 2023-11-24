const arrayDestinos = [{id: 2, descripcion: 'Comprar un vehículo', interes: 1.3875},
{id: 3, descripcion: 'Vacaciones merecidas', interes: 1.6267},
{id: 4, descripcion: 'Otros destinos', interes: 1.8152},]

const divCotizar = document.querySelector("div.panel-cotizacion")
const divDetalle = document.querySelector("div.panel-desgloce")

const inputMonto = document.querySelector("input#montoPrestamo")
const inputPlazo = document.querySelector("input#plazoPago")
const selectDestinos = document.querySelector("select")
const textoMensaje = document.querySelector("p.texto-verde")

const btnCalcular = document.querySelector("button.button-calcular")
const btnContratar = document.querySelector("button.button-contratar")

const tablaDesgloce = document.querySelector("table tbody")

function cargarDestinos() {
    if (arrayDestinos.length > 0) {
        arrayDestinos.forEach((destino)=> selectDestinos.innerHTML += `<option>${destino.descripcion}</option>`)
    }
}

function retornarInteres(descripcion) {
    let destino = arrayDestinos.find((destino)=> destino.descripcion === descripcion)
    return destino.interes
}

function calcularPrestamo() {
    let dineroSolicitado = parseInt(inputMonto.value)
    let plazoEnMeses = parseInt(inputPlazo.value)
    let interesAplicado = retornarInteres(selectDestinos.value)

    const prestamo = new Prestamo(dineroSolicitado, interesAplicado, plazoEnMeses)
    let cuotaMensual = prestamo.calcularCuota()

    const spanMonto = document.querySelector("span.label-monto")
    const spanDestino = document.querySelector("span.label-destino")
    const spanTasa = document.querySelector("span.label-intereses") 
    const spanPlazo = document.querySelector("span.label-plazo")
    spanDestino.textContent = selectDestinos.value
    spanTasa.textContent = ((prestamo.interes - 1) * 100).toFixed(2)
    spanPlazo.textContent = prestamo.plazo
    armarTablaHTML(cuotaMensual, prestamo.plazo)
    mostrarTotalAdevolver((prestamo.monto * prestamo.interes))
    divCotizar.classList.add("ocultar-panel")
    divDetalle.classList.remove("ocultar-panel")
    guardarEnLS(inputMonto.value, inputPlazo.value, selectDestinos.value)
}

function armarTablaHTML(valorCuota, meses) {
        tablaDesgloce.innerHTML = ""

        for (let i = 1; i <= meses; i++) {
            tablaDesgloce.innerHTML += `<tr>
                                            <td>${i}</td>
                                            <td>El día 7 de cada mes</td>
                                            <td class="texto-derecha">$ ${(valorCuota)}</td>
                                        </tr>`
        }
}

function mostrarTotalAdevolver(totalPrestamo) {
const celdaTotal = document.querySelector("tfoot td.texto-derecha")
        celdaTotal.textContent = `$ ${totalPrestamo.toLocaleString("es-AR")}`
}

function guardarEnLS(dinero, meses, destino) {
    let datosDelPrestamo = {
        dinero: dinero,
        meses: meses,
        destino: destino
    }

    localStorage.setItem("HistorialPrestamo", JSON.stringify(datosDelPrestamo))
}

function recuperarDeLS() {
    let datosDelPrestamo = JSON.parse(localStorage.getItem("HistorialPrestamo"))

    if (datosDelPrestamo !== null) {
        inputMonto.value = datosDelPrestamo.dinero
        inputPlazo.value = datosDelPrestamo.meses
        selectDestinos.value = datosDelPrestamo.destino

        textoMensaje.textContent = "Recuperamos una cotización antigua por si quieres retomar la misma. Puedes cambiar el monto, plazo, o destino de tu préstamo si así lo deseas."
    }

}
btnCalcular.addEventListener("click", ()=> calcularPrestamo())

btnContratar.addEventListener("click", ()=> {   
    localStorage.clear()
    location.reload()
})
cargarDestinos()
recuperarDeLS()
import { tipo, crearTablaDinamica, crearOpciones} from "./cargaDinamica.js";
import { Monstruo } from "./monstruo.js";
import  { getMonstruos, postMonstruo, updateMonstruo, deleteMonstruos, getUnMonstruoFetch} from "./accesoDatos.js";

const formulario = document.forms[0]; 

localStorage.setItem("tipos",JSON.stringify(tipo)); 
const info = JSON.parse(localStorage.getItem("tipos")); 

document.addEventListener("DOMContentLoaded", function() {
    const listaTipo = document.getElementById("tipo");
    if (listaTipo) {
        listaTipo.appendChild(crearOpciones(info));
    }
});

URL = "http://localhost:3000/monstruos";

formulario.addEventListener("submit",(e) => {
    e.preventDefault();
    realizarOperacion(); 
});


/*------------------------OBTENER MONSTRUOS POR GET---------------------------*/
let listaMonstruos = [];
let listaMonstruosCopy = [];

getMonstruos(URL)
.then(lista => {
    listaMonstruos = lista;
    listaMonstruosCopy = lista;
    actualizarTabla();
    const promedioFiltro = calcularPromedioSegunFiltro(listaMonstruos);
    document.getElementById("promedio").value = promedioFiltro;
})
.catch(error => console.error(error));

/*----------------AL HACER CLICK EN UN CAMPO DE MI TABLA-------------------- */

document.addEventListener("click",(e)=>
{
    const evento = e.target;

    if (evento.matches("td")) {
        
        limpiarFormulario();
        let idSeleccionado = parseInt(evento.parentElement.dataset.id);
        getUnMonstruoFetch(URL, idSeleccionado, (monstruo) => {
            cargaFormulario(monstruo);
            visualizarBotones();
        });
        
    }
    else if(evento.matches("#btnEliminar"))
    {
        manejadorEliminar(parseInt(formulario.inputId.value));  
        limpiarFormulario();
        visualizarBotones();
    }
    else if(evento.matches("#btnCancelar"))
    {
        limpiarFormulario();
        visualizarBotones();
    }
    else if (evento.matches(".check")) 
    {
        // console.log(evento.matches(".check"));
        filtrarCheckbox(listaMonstruos);
    }
})


/*------CARGA DE FORMULARIO CON DATOS--------------- */

export function cargaFormulario(monstruo)
{
    formulario.inputId.value = monstruo.id;
    formulario.inputNombre.value = monstruo.nombre;
    formulario.inputAlias.value = monstruo.alias;
    formulario.rdbDefensa.value = monstruo.defensa;
    formulario.inputMiedo.value = monstruo.miedo;
    formulario.selectTipo.value = monstruo.tipo;
}

/*---------------OPERACION-------------------------*/
function realizarOperacion()
{
    const {inputId, inputNombre, selectTipo, inputAlias, rdbDefensa, inputMiedo} = formulario;
      
    const unMonstruo = new Monstruo(inputId.value,inputNombre.value,selectTipo.value,inputAlias.value,rdbDefensa.value,inputMiedo.value);

    if (unMonstruo !== null) 
    {
        inputId.value === "" ?  manejadorAlta(unMonstruo) :  manejadorActualizar(unMonstruo);   
    }
    limpiarFormulario();
    visualizarBotones();
    console.log("enviando....");
}

/*---------------MANEJADORES ALTA, MODFICAR, ELIMINAR-------------------------*/

const manejadorAlta = (monstruo) => {
    postMonstruo(URL,monstruo);
    actualizarTabla();
}

const manejadorActualizar = (monstruoActualizado) => {

    let id = parseInt(monstruoActualizado.id);
    monstruoActualizado.id = id;
    updateMonstruo(URL,monstruoActualizado);
    actualizarTabla();
}

const manejadorEliminar = (id) => {
    deleteMonstruos(URL,id);
    actualizarTabla();
}

/*---------------------ACTUALIZAR LOCALSTORAGE Y TABLA -------------------------------- */

function actualizarTabla()
{
    console.log("Actualizando tabla...");
    if (listaMonstruos) 
    {
        listaMonstruos.sort((a,b)=>{
            return b.miedo - a.miedo;
        })
        redenrizarTabla(crearTablaDinamica(listaMonstruos),document.getElementById("divTabla"));
    }
}

function redenrizarTabla(listaMonstruos, contenedor)
{
    while (contenedor.hasChildNodes())
    {
        contenedor.removeChild(contenedor.firstChild); 
    }
    
    if (listaMonstruos) {
        
        contenedor.appendChild(listaMonstruos);
    }
}

/*------------MOSTRAR BOTONES Y CAMBIA EL VALOR SEGUN LA ACCION------------------------ */

function visualizarBotones() 
{
    if (formulario.inputId.value != "") 
    {
        document.getElementById("btnEliminar").classList.remove("oculto");
        document.getElementById("btnCancelar").classList.remove("oculto");
        document.getElementById("btnSubmit").value = "Modificar"; 
    }
    else
    {
        document.getElementById("btnEliminar").classList.add("oculto");
        document.getElementById("btnCancelar").classList.add("oculto");
        document.getElementById("btnSubmit").value = "Guardar"; 
    }

}

function limpiarFormulario()
{
    formulario.reset();
    formulario.inputId.value = ""; 
}

/*************************FILTRO**************************************/
document.getElementById("filtro").addEventListener("change", (e)=>{

    e.preventDefault();
    const tipoSeleccionado = document.getElementById("filtro").value;
    const monstruosFiltrados = filtrarMonstruosPorTipo(tipoSeleccionado, listaMonstruosCopy);
    const promedioFiltro = calcularPromedioSegunFiltro(monstruosFiltrados);
    
    document.getElementById("promedio").value = promedioFiltro;
    redenrizarTabla(crearTablaDinamica(monstruosFiltrados),document.getElementById("divTabla")); 
    
    listaMonstruos = tipoSeleccionado !== "Todos" ? monstruosFiltrados : listaMonstruosCopy;
    // console.log(listaMonstruosCopy);
    // console.log(listaMonstruos);

    filtrarCheckbox(listaMonstruos);

});

/*********************FILTRO POR CHECKBOXES******************************* */
const filtrarCheckbox = (listaMonstruos) => {

    let checkboxActivados = [];
    let checkboxes = document.getElementsByClassName("check");
    checkboxes = Array.from(checkboxes);

    for (const checkbox of checkboxes) {
        if (checkbox.checked) {
            checkboxActivados[checkbox.value] = checkbox.checked;
        }
    }
  
    let listaMonstrucosCheck = listaMonstruos.map((unMonstruo) => {
    let datosAMostrar = [];
    
        for (const key in unMonstruo) 
        {
            if (checkboxActivados[key] || key === "id") 
            {
                datosAMostrar[key] = unMonstruo[key];
            } 
        }
        return datosAMostrar;
    });

    redenrizarTabla(crearTablaDinamica(listaMonstrucosCheck),document.getElementById("divTabla")); 
};


function filtrarMonstruosPorTipo(tipoSeleccionado, lista)
{
    let monstruosFiltrados = tipoSeleccionado != "Todos" ? lista.filter(monstruo => monstruo.tipo == tipoSeleccionado) : lista;
    return monstruosFiltrados;
}

function calcularPromedioSegunFiltro(listaMonstruosFiltrados)
{
    let promedioFiltro = 0;
    if (listaMonstruosFiltrados.length > 0) {

        let acumuladorFiltro = listaMonstruosFiltrados.reduce((acumulador, actual) => acumulador + parseInt(actual.miedo),0);
        promedioFiltro = acumuladorFiltro / listaMonstruosFiltrados.length;
    }   
    return promedioFiltro;
}


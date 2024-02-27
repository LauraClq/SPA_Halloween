import {crearCards} from "./cardsDinamicos.js";

const URL = "http://localhost:3000/monstruos";
const seccionMonstruos = document.getElementById("cardsMonstruos");
const spinner = document.querySelector("#spinner");

function getMonstruosFetch(url) 
{
    return new Promise( (resolve, reject) => {
        spinner.classList.remove("oculto");
        fetch(url)
        .then((res) => res.ok? res.json() : Promise.reject(res))
        .then((data) => resolve(data))
        .catch((res) => {console.error(`Error ${res.status}: ${res.statusText}`); reject(res);})
        .finally(() => spinner.classList.add("oculto"));
    });
}

getMonstruosFetch(URL)
.then((lista) => {
    lista.forEach(monstruo => {
        seccionMonstruos.appendChild(crearCards(monstruo));
    })
})
.catch((error) => console.error("Error:", error));